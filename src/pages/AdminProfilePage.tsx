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
import PasswordVisibilityButton from "../components/atoms/PasswordVisibilityButton";
import { CheckIcon, EditIcon, TrashIcon, UploadIcon } from "../components/icons";
import ProfileImageCropModal from "../components/molecules/ProfileImageCropModal";
import Toast from "../components/molecules/Toast";
import type {
  Admin,
  AdminPasswordFieldErrors,
  AdminPasswordUpdateResult,
  AdminProfileImageResult,
  AdminProfileUpdateResult,
} from "../utils/adminAuth";
import { scrollToFirstErrorField } from "../utils/formFocus";

type AdminProfilePageProps = {
  admin: Admin;
  onProfileImageRemove: () => Promise<AdminProfileImageResult>;
  onProfileImageUpdate: (
    profileImage: string,
  ) => Promise<AdminProfileImageResult>;
  onPasswordUpdate: (passwords: {
    confirmPassword: string;
    currentPassword: string;
    newPassword: string;
  }) => Promise<AdminPasswordUpdateResult>;
  onProfileUpdate: (profile: {
    name: string;
  }) => Promise<AdminProfileUpdateResult>;
};

type PendingProfileImageCrop = {
  imageUrl: string;
};

type ProfileImageOperation = "remove" | "save" | null;
type ProfileOperation = "displayName" | "password" | null;

type PasswordFields = {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
};

type PasswordVisibilityFields = Record<keyof PasswordFields, boolean>;

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
const minAdminPasswordLength = 8;
const maxAdminPasswordLength = 72;
const adminPasswordRequirementMessage =
  "Password must include a lowercase letter, uppercase letter, number, and special character.";
const initialPasswordFields: PasswordFields = {
  confirmPassword: "",
  currentPassword: "",
  newPassword: "",
};
const initialPasswordVisibility: PasswordVisibilityFields = {
  confirmPassword: false,
  currentPassword: false,
  newPassword: false,
};
const passwordFieldOrder: Array<keyof PasswordFields> = [
  "currentPassword",
  "newPassword",
  "confirmPassword",
];

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

const normalizeDisplayName = (name: string) => name.trim().replace(/\s+/g, " ");

const getPasswordRequirementStatuses = (password: string) => [
  {
    label: `${minAdminPasswordLength}-${maxAdminPasswordLength} characters`,
    isMet:
      password.length >= minAdminPasswordLength &&
      password.length <= maxAdminPasswordLength,
  },
  {
    label: "Lowercase letter",
    isMet: /[a-z]/.test(password),
  },
  {
    label: "Uppercase letter",
    isMet: /[A-Z]/.test(password),
  },
  {
    label: "Number",
    isMet: /[0-9]/.test(password),
  },
  {
    label: "Special character",
    isMet: /[^A-Za-z0-9\s]/.test(password),
  },
];

const validatePasswordFields = ({
  confirmPassword,
  currentPassword,
  newPassword,
}: PasswordFields) => {
  const errors: AdminPasswordFieldErrors = {};

  if (!currentPassword.trim()) {
    errors.currentPassword = "Enter your current password.";
  }

  if (!newPassword.trim()) {
    errors.newPassword = "Enter a new password.";
  } else if (newPassword.length < minAdminPasswordLength) {
    errors.newPassword = `Password must be at least ${minAdminPasswordLength} characters.`;
  } else if (newPassword.length > maxAdminPasswordLength) {
    errors.newPassword = `Password must be ${maxAdminPasswordLength} characters or fewer.`;
  } else if (
    !/[a-z]/.test(newPassword) ||
    !/[A-Z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword) ||
    !/[^A-Za-z0-9\s]/.test(newPassword)
  ) {
    errors.newPassword = adminPasswordRequirementMessage;
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = "Confirm your new password.";
  } else if (newPassword && confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
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
  onPasswordUpdate,
  onProfileUpdate,
}: AdminProfilePageProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [displayNameDraft, setDisplayNameDraft] = useState(admin.name);
  const [displayNameError, setDisplayNameError] = useState("");
  const [passwordFields, setPasswordFields] =
    useState<PasswordFields>(initialPasswordFields);
  const [passwordErrors, setPasswordErrors] =
    useState<AdminPasswordFieldErrors>({});
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibilityFields>(initialPasswordVisibility);
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
  const isSavingPassword = profileOperation === "password";
  const isSavingProfileChange =
    isSavingDisplayName || isSavingPassword || isProcessingProfileImage;
  const hasDisplayNameChanges =
    normalizeDisplayName(displayNameDraft) !== admin.name;
  const hasPasswordChanges = Object.values(passwordFields).some(Boolean);
  const passwordRequirementStatuses = getPasswordRequirementStatuses(
    passwordFields.newPassword,
  );
  const shouldShowPasswordRequirements =
    passwordFields.newPassword.length > 0 &&
    passwordRequirementStatuses.some((requirement) => !requirement.isMet);

  useEffect(() => {
    if (!pendingProfileImageCrop) {
      return;
    }

    return () => URL.revokeObjectURL(pendingProfileImageCrop.imageUrl);
  }, [pendingProfileImageCrop]);

  const resetPasswordFields = () => {
    setPasswordFields(initialPasswordFields);
    setPasswordErrors({});
    setPasswordVisibility(initialPasswordVisibility);
  };

  const clearPasswordError = (field: keyof PasswordFields) => {
    setPasswordErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handlePasswordFieldChange = (
    field: keyof PasswordFields,
    value: string,
  ) => {
    setPasswordFields((currentFields) => ({
      ...currentFields,
      [field]: value,
    }));
    clearPasswordError(field);
  };

  const togglePasswordVisibility = (field: keyof PasswordFields) => {
    setPasswordVisibility((currentVisibility) => ({
      ...currentVisibility,
      [field]: !currentVisibility[field],
    }));
  };

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
    resetPasswordFields();
    setProfileImageError("");
    setIsEditingProfile(true);
  };

  const handleDisplayNameCancel = () => {
    if (isSavingProfileChange) {
      return;
    }

    setDisplayNameDraft(admin.name);
    setDisplayNameError("");
  };

  const handleProfileEditDone = () => {
    if (isSavingProfileChange) {
      return;
    }

    if (hasDisplayNameChanges) {
      setDisplayNameError("Save or cancel this display name change first.");
      return;
    }

    if (hasPasswordChanges) {
      setPasswordErrors({
        currentPassword: "Save or clear this password change first.",
      });
      return;
    }

    setDisplayNameError("");
    setPasswordErrors({});
    setIsEditingProfile(false);
  };

  const handleDisplayNameSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const nextDisplayName = normalizeDisplayName(displayNameDraft);

    setDisplayNameError("");
    setProfileToastMessage("");

    if (!nextDisplayName) {
      setDisplayNameError("Enter your display name.");
      return;
    }

    if (nextDisplayName === admin.name) {
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
    setProfileToastMessage("Display name updated.");
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const validationErrors = validatePasswordFields(passwordFields);

    setPasswordErrors(validationErrors);
    setProfileToastMessage("");

    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstErrorField(
        form,
        passwordFieldOrder.filter((fieldName) => validationErrors[fieldName]),
      );
      return;
    }

    setProfileOperation("password");
    const result = await onPasswordUpdate(passwordFields);
    setProfileOperation(null);

    if (!result.success) {
      const nextErrors = result.errors || {};
      setPasswordErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        scrollToFirstErrorField(
          form,
          passwordFieldOrder.filter((fieldName) => nextErrors[fieldName]),
        );
      }

      if (Object.keys(nextErrors).length === 0) {
        setPasswordErrors({
          currentPassword:
            result.message || "We could not update your password.",
        });
      }

      return;
    }

    resetPasswordFields();
    setProfileToastMessage("Password updated.");
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

  const renderPasswordVisibilityButton = (field: keyof PasswordFields) => (
    <PasswordVisibilityButton
      isVisible={passwordVisibility[field]}
      onClick={() => togglePasswordVisibility(field)}
    />
  );

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

        <div className="mt-10 flex justify-end">
          {isEditingProfile ? (
            <Button
              disabled={isSavingProfileChange}
              size="sm"
              type="button"
              variant="link"
              onClick={handleProfileEditDone}
            >
              Done
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="link"
              onClick={handleProfileEdit}
            >
              <EditIcon />
              Edit
            </Button>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
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
                      disabled={isSavingProfileChange}
                      size="sm"
                      type="submit"
                      variant="link"
                    >
                      {isSavingDisplayName ? <LoadingSpinner /> : null}
                      {isSavingDisplayName ? "Saving" : "Save"}
                    </Button>
                    <Button
                      disabled={isSavingProfileChange}
                      size="sm"
                      type="button"
                      variant="link"
                      onClick={handleDisplayNameCancel}
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

          {isEditingProfile ? (
            <div className="mt-8 border-t border-slate-100 pt-8">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Password
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Update your password by confirming the one you use now.
                </p>

                <form
                  className="mt-5 grid gap-4"
                  onSubmit={handlePasswordSubmit}
                  noValidate
                >
                  <Input
                    label="Current password"
                    name="currentPassword"
                    type={
                      passwordVisibility.currentPassword ? "text" : "password"
                    }
                    autoComplete="current-password"
                    value={passwordFields.currentPassword}
                    error={passwordErrors.currentPassword}
                    onChange={(event) =>
                      handlePasswordFieldChange(
                        "currentPassword",
                        event.currentTarget.value,
                      )
                    }
                    trailingElement={renderPasswordVisibilityButton(
                      "currentPassword",
                    )}
                    required
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Input
                        label="New password"
                        name="newPassword"
                        type={
                          passwordVisibility.newPassword ? "text" : "password"
                        }
                        autoComplete="new-password"
                        value={passwordFields.newPassword}
                        error={passwordErrors.newPassword}
                        minLength={minAdminPasswordLength}
                        maxLength={maxAdminPasswordLength}
                        onChange={(event) =>
                          handlePasswordFieldChange(
                            "newPassword",
                            event.currentTarget.value,
                          )
                        }
                        trailingElement={renderPasswordVisibilityButton(
                          "newPassword",
                        )}
                        required
                      />

                      {shouldShowPasswordRequirements ? (
                        <ul
                          aria-label="New password requirements"
                          aria-live="polite"
                          className="mt-3 grid gap-1.5 text-xs"
                        >
                          {passwordRequirementStatuses.map((requirement) => (
                            <li
                              key={requirement.label}
                              className={`flex items-center gap-2 transition-colors ${
                                requirement.isMet
                                  ? "text-green-700"
                                  : "text-slate-500"
                              }`}
                            >
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                  requirement.isMet
                                    ? "border-green-600 bg-green-600 text-white"
                                    : "border-slate-300 bg-white text-transparent"
                                }`}
                              >
                                <CheckIcon className="h-3 w-3" />
                              </span>
                              <span>{requirement.label}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    <Input
                      label="Confirm password"
                      name="confirmPassword"
                      type={
                        passwordVisibility.confirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      value={passwordFields.confirmPassword}
                      error={passwordErrors.confirmPassword}
                      minLength={minAdminPasswordLength}
                      maxLength={maxAdminPasswordLength}
                      onChange={(event) =>
                        handlePasswordFieldChange(
                          "confirmPassword",
                          event.currentTarget.value,
                        )
                      }
                      trailingElement={renderPasswordVisibilityButton(
                        "confirmPassword",
                      )}
                      required
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      disabled={isSavingProfileChange}
                      size="sm"
                      type="submit"
                      variant="link"
                    >
                      {isSavingPassword ? <LoadingSpinner /> : null}
                      {isSavingPassword ? "Saving" : "Save password"}
                    </Button>
                    <Button
                      disabled={isSavingProfileChange || !hasPasswordChanges}
                      size="sm"
                      type="button"
                      variant="link"
                      onClick={resetPasswordFields}
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
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
