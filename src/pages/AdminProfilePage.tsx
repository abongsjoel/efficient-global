import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import type { Admin, AdminProfileImageResult } from "../utils/adminAuth";

type AdminProfilePageProps = {
  admin: Admin;
  onProfileImageRemove: () => Promise<AdminProfileImageResult>;
  onProfileImageUpdate: (
    profileImage: string,
  ) => Promise<AdminProfileImageResult>;
};

const formatRole = (role: string) => role.replace(/_/g, " ");

const formatStatus = (status: string) => roleStatusLabels[status] || status;

const roleStatusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
};

const supportedProfileImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const profileImageAcceptValue = Array.from(supportedProfileImageTypes).join(
  ",",
);
const maxSourceImageBytes = 8 * 1024 * 1024;
const maxStoredProfileImageBytes = 1_000_000;
const maxProfileImageDimension = 512;

const UploadIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M20 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5" />
  </svg>
);

const TrashIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="m19 6-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  </svg>
);

const LoadingSpinner = () => (
  <span
    aria-hidden="true"
    className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
  />
);

const getAdminInitials = (admin: Admin) => {
  const displayName = admin.name || admin.email;
  const nameParts = displayName.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }

  const fallback = nameParts[0] || admin.email.split("@")[0] || "A";

  return fallback.slice(0, 2).toUpperCase();
};

const getBase64ByteLength = (dataUrl: string) => {
  const base64Value = dataUrl.split(",")[1] || "";
  const padding = base64Value.endsWith("==")
    ? 2
    : base64Value.endsWith("=")
      ? 1
      : 0;

  return (base64Value.length * 3) / 4 - padding;
};

const validateProfileImageFile = (file: File) => {
  if (!supportedProfileImageTypes.has(file.type)) {
    return "Upload a PNG, JPG, or WebP profile image.";
  }

  if (file.size > maxSourceImageBytes) {
    return "Choose an image smaller than 8 MB.";
  }

  return "";
};

const loadImage = (imageUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("We could not read that image."));
    image.src = imageUrl;
  });

const createProfileImageDataUrl = async (file: File) => {
  const validationMessage = validateProfileImageFile(file);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(imageUrl);
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;

    if (!sourceWidth || !sourceHeight) {
      throw new Error("We could not read that image.");
    }

    const scale = Math.min(
      1,
      maxProfileImageDimension / Math.max(sourceWidth, sourceHeight),
    );
    const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
    const targetHeight = Math.max(1, Math.round(sourceHeight * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("We could not prepare that image.");
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const profileImage = canvas.toDataURL("image/jpeg", 0.86);

    if (getBase64ByteLength(profileImage) > maxStoredProfileImageBytes) {
      throw new Error("Profile image must be 1 MB or smaller.");
    }

    return profileImage;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

const AdminProfilePage = ({
  admin,
  onProfileImageRemove,
  onProfileImageUpdate,
}: AdminProfilePageProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [profileImageError, setProfileImageError] = useState("");
  const [profileImageMessage, setProfileImageMessage] = useState("");

  const handleProfileImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    setIsSavingImage(true);
    setProfileImageError("");
    setProfileImageMessage("");

    try {
      const profileImage = await createProfileImageDataUrl(file);
      const result = await onProfileImageUpdate(profileImage);

      if (!result.success) {
        setProfileImageError(result.message);
        return;
      }

      setProfileImageMessage("Profile image updated.");
    } catch (error) {
      setProfileImageError(
        error instanceof Error
          ? error.message
          : "We could not update your profile image.",
      );
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleProfileImageRemove = async () => {
    setIsSavingImage(true);
    setProfileImageError("");
    setProfileImageMessage("");

    const result = await onProfileImageRemove();

    setIsSavingImage(false);

    if (!result.success) {
      setProfileImageError(result.message);
      return;
    }

    setProfileImageMessage("Profile image removed.");
  };

  return (
    <section className="min-h-[calc(100vh-7rem)] snap-start bg-slate-50 px-6 py-16 text-slate-950 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
              Admin
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Profile
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Manage your Efficient Global administrator account details.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin"
              className="rounded-full border border-primary-200 bg-white px-6 py-3 font-semibold text-primary-200 transition hover:bg-primary-100 hover:text-white"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div
              className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full text-2xl font-bold uppercase ${
                admin.profileImage
                  ? "border border-slate-200 bg-white shadow-sm"
                  : "bg-slate-950 text-white ring-4 ring-primary-200/20"
              }`}
            >
              {admin.profileImage ? (
                <img
                  src={admin.profileImage}
                  alt={`${admin.name} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                getAdminInitials(admin)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {admin.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{admin.email}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-200 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm shadow-primary-200/20 transition hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSavingImage}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isSavingImage ? <LoadingSpinner /> : <UploadIcon />}
                  {isSavingImage
                    ? "Saving"
                    : admin.profileImage
                      ? "Change photo"
                      : "Upload photo"}
                </button>

                {admin.profileImage ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSavingImage}
                    onClick={handleProfileImageRemove}
                  >
                    <TrashIcon />
                    Remove
                  </button>
                ) : null}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept={profileImageAcceptValue}
                className="sr-only"
                onChange={handleProfileImageChange}
              />

              {profileImageError ? (
                <p
                  role="alert"
                  className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {profileImageError}
                </p>
              ) : null}

              {profileImageMessage ? (
                <p
                  role="status"
                  className="mt-3 rounded-xl border border-primary-200/30 bg-primary-200/10 px-4 py-3 text-sm font-medium text-primary-300"
                >
                  {profileImageMessage}
                </p>
              ) : null}
            </div>
          </div>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Role
              </dt>
              <dd className="mt-2 font-semibold capitalize text-slate-800">
                {formatRole(admin.role)}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Status
              </dt>
              <dd className="mt-2 font-semibold text-slate-800">
                {formatStatus(admin.status)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default AdminProfilePage;
