import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import ProfileImageCropModal from "../components/molecules/ProfileImageCropModal";
import Toast from "../components/molecules/Toast";
import type {
  Admin,
  AdminProfileImageResult,
  AdminProfileUpdateResult,
} from "../utils/adminAuth";

type AdminProfilePageProps = {
  admin: Admin;
  onProfileImageRemove: () => Promise<AdminProfileImageResult>;
  onProfileImageUpdate: (
    profileImage: string,
  ) => Promise<AdminProfileImageResult>;
  onProfileUpdate: (profile: {
    name: string;
  }) => Promise<AdminProfileUpdateResult>;
};

type PendingProfileImageCrop = {
  imageUrl: string;
};

type ProfileImageOperation = "remove" | "save" | null;
type ProfileOperation = "displayName" | null;

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

const EditIcon = () => (
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
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
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

const AdminProfilePage = ({
  admin,
  onProfileImageRemove,
  onProfileImageUpdate,
  onProfileUpdate,
}: AdminProfilePageProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [displayNameDraft, setDisplayNameDraft] = useState(admin.name);
  const [displayNameError, setDisplayNameError] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileImageOperation, setProfileImageOperation] =
    useState<ProfileImageOperation>(null);
  const [profileOperation, setProfileOperation] =
    useState<ProfileOperation>(null);
  const [pendingProfileImageCrop, setPendingProfileImageCrop] =
    useState<PendingProfileImageCrop | null>(null);
  const [profileImageError, setProfileImageError] = useState("");
  const [profileToastMessage, setProfileToastMessage] = useState("");
  const isProcessingProfileImage = Boolean(profileImageOperation);
  const isRemovingProfileImage = profileImageOperation === "remove";
  const isSavingProfileImage = profileImageOperation === "save";
  const isSavingDisplayName = profileOperation === "displayName";

  useEffect(() => {
    if (!pendingProfileImageCrop) {
      return;
    }

    return () => URL.revokeObjectURL(pendingProfileImageCrop.imageUrl);
  }, [pendingProfileImageCrop]);

  const handleProfileImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    setProfileImageError("");
    setProfileToastMessage("");

    const validationMessage = validateProfileImageFile(file);

    if (validationMessage) {
      setProfileImageError(validationMessage);
      return;
    }

    setPendingProfileImageCrop({
      imageUrl: URL.createObjectURL(file),
    });
  };

  const handleProfileEdit = () => {
    setDisplayNameDraft(admin.name);
    setDisplayNameError("");
    setIsEditingProfile(true);
  };

  const handleProfileEditCancel = () => {
    if (isSavingDisplayName) {
      return;
    }

    setDisplayNameDraft(admin.name);
    setDisplayNameError("");
    setIsEditingProfile(false);
  };

  const handleDisplayNameSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const nextDisplayName = displayNameDraft.trim().replace(/\s+/g, " ");

    setDisplayNameError("");
    setProfileToastMessage("");

    if (!nextDisplayName) {
      setDisplayNameError("Enter your display name.");
      return;
    }

    if (nextDisplayName === admin.name) {
      setIsEditingProfile(false);
      setDisplayNameDraft(admin.name);
      return;
    }

    setProfileOperation("displayName");
    const result = await onProfileUpdate({ name: nextDisplayName });
    setProfileOperation(null);

    if (!result.success) {
      setDisplayNameError(
        result.errors?.name ||
          result.message ||
          "We could not update your display name.",
      );
      return;
    }

    setDisplayNameDraft(result.admin.name);
    setIsEditingProfile(false);
    setProfileToastMessage("Display name updated.");
  };

  const handleProfileImageCropCancel = () => {
    if (!isProcessingProfileImage) {
      setPendingProfileImageCrop(null);
    }
  };

  const handleProfileImageCrop = async (profileImage: string) => {
    setProfileImageOperation("save");
    setProfileImageError("");
    setProfileToastMessage("");

    if (getBase64ByteLength(profileImage) > maxStoredProfileImageBytes) {
      setProfileImageOperation(null);
      setPendingProfileImageCrop(null);
      setProfileImageError("Profile image must be 1 MB or smaller.");
      return;
    }

    const result = await onProfileImageUpdate(profileImage);

    setProfileImageOperation(null);
    setPendingProfileImageCrop(null);

    if (!result.success) {
      setProfileImageError(result.message);
      return;
    }

    setProfileToastMessage("Profile image updated.");
  };

  const handleProfileImageRemove = async () => {
    setProfileImageOperation("remove");
    setProfileImageError("");
    setProfileToastMessage("");

    const result = await onProfileImageRemove();

    setProfileImageOperation(null);

    if (!result.success) {
      setProfileImageError(result.message);
      return;
    }

    setProfileToastMessage("Profile image removed.");
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
            {isEditingProfile ? (
              <Button
                disabled={isSavingDisplayName || isProcessingProfileImage}
                type="button"
                variant="inverse"
                onClick={handleProfileEditCancel}
              >
                Cancel edit
              </Button>
            ) : (
              <Button type="button" variant="inverse" onClick={handleProfileEdit}>
                <EditIcon />
                Edit profile
              </Button>
            )}
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
              {isEditingProfile ? (
                <form
                  className="max-w-sm"
                  onSubmit={handleDisplayNameSubmit}
                  noValidate
                >
                  <Input
                    label="Display name"
                    name="displayName"
                    type="text"
                    autoComplete="name"
                    value={displayNameDraft}
                    error={displayNameError}
                    maxLength={80}
                    onChange={(event) => {
                      setDisplayNameDraft(event.currentTarget.value);
                      setDisplayNameError("");
                    }}
                    required
                  />

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Button
                      disabled={isSavingDisplayName}
                      size="sm"
                      type="submit"
                      variant="link"
                    >
                      {isSavingDisplayName ? <LoadingSpinner /> : null}
                      {isSavingDisplayName ? "Saving" : "Save"}
                    </Button>
                    <Button
                      disabled={isSavingDisplayName}
                      size="sm"
                      type="button"
                      variant="link"
                      onClick={handleProfileEditCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{admin.email}</p>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {admin.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{admin.email}</p>
                </>
              )}

              {isEditingProfile ? (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    disabled={isProcessingProfileImage}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isSavingProfileImage ? <LoadingSpinner /> : <UploadIcon />}
                    {isSavingProfileImage
                      ? "Saving"
                      : admin.profileImage
                        ? "Change photo"
                        : "Upload photo"}
                  </Button>

                  {admin.profileImage ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="dangerLink"
                      disabled={isProcessingProfileImage}
                      onClick={handleProfileImageRemove}
                    >
                      {isRemovingProfileImage ? (
                        <LoadingSpinner />
                      ) : (
                        <TrashIcon />
                      )}
                      {isRemovingProfileImage ? "Removing" : "Remove"}
                    </Button>
                  ) : null}
                </div>
              ) : null}

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

      {pendingProfileImageCrop ? (
        <ProfileImageCropModal
          imageUrl={pendingProfileImageCrop.imageUrl}
          isSaving={isProcessingProfileImage}
          onCancel={handleProfileImageCropCancel}
          onCrop={handleProfileImageCrop}
        />
      ) : null}

      {profileToastMessage ? (
        <Toast
          message={profileToastMessage}
          onDismiss={() => setProfileToastMessage("")}
        />
      ) : null}
    </section>
  );
};

export default AdminProfilePage;
