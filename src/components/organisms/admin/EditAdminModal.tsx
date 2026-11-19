import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Button from "../../atoms/Button";
import Dropdown from "../../atoms/Dropdown";
import Input from "../../atoms/Input";
import { CloseIcon } from "../../icons";
import { adminRoleOptions } from "./adminFormOptions";
import {
  type AdminListItem,
  useLazyCheckAdminEmailAvailabilityQuery,
} from "../../../services/adminApi";
import { scrollToFirstErrorField } from "../../../utils/formFocus";
import {
  type AdminDetailsFieldErrors,
  type AdminDetailsFields,
  validateAdminDetailsFields,
} from "../../../utils/formValidation";
import {
  preventBlurOnMouseDown,
  useFormBlurValidation,
} from "../../../utils/useFormBlurValidation";

export type EditAdminSubmitResult =
  | { success: true }
  | {
      success: false;
      errors?: AdminDetailsFieldErrors;
      message?: string;
    };

type EditAdminModalProps = {
  admin: AdminListItem;
  /** The admin is editing their own account, whose role they can't change. */
  isCurrentAdmin: boolean;
  onClose: () => void;
  onSubmit: (fields: AdminDetailsFields) => Promise<EditAdminSubmitResult>;
};

// The role always holds a valid choice, so it's only checked on submit.
const blurValidatedFields = ["name", "email"] as const;

const fieldOrder: Array<keyof AdminDetailsFields> = ["name", "email", "role"];

const duplicateEmailMessage = "An admin with this email already exists.";

const normalizeName = (name: string) => name.trim().replace(/\s+/g, " ");

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const EditAdminModal = ({
  admin,
  isCurrentAdmin,
  onClose,
  onSubmit,
}: EditAdminModalProps) => {
  const titleId = useId();
  const roleHintId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  // The email as typed right now, so a slow availability answer for an email
  // the user has since changed can be ignored.
  const latestEmailRef = useRef(admin.email);
  const [checkEmailAvailability] = useLazyCheckAdminEmailAvailabilityQuery();
  // Starts from the admin as they were when the modal opened, so a background
  // refresh of the list can't overwrite what's being typed.
  const [fields, setFields] = useState<AdminDetailsFields>(() => ({
    email: admin.email,
    name: admin.name,
    role: admin.role,
  }));
  const [errors, setErrors] = useState<AdminDetailsFieldErrors>({});
  const { formProps: blurValidationProps } = useFormBlurValidation({
    fields: blurValidatedFields,
    setErrors,
    validate: () => validateAdminDetailsFields(fields),
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEmailUnchanged =
    normalizeEmail(fields.email) === normalizeEmail(admin.email);
  const hasChanges =
    normalizeName(fields.name) !== admin.name ||
    !isEmailUnchanged ||
    fields.role !== admin.role;
  // Something changed, every field passes the local checks, and nothing is
  // flagged, including an email the server reported as taken.
  const canSave =
    hasChanges &&
    Object.keys(validateAdminDetailsFields(fields)).length === 0 &&
    Object.keys(errors).length === 0;

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  const handleFieldChange = (
    field: keyof AdminDetailsFields,
    value: string,
  ) => {
    if (field === "email") {
      latestEmailRef.current = value;
    }

    setFields((currentFields) => ({ ...currentFields, [field]: value }));
    setFormError("");
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  // Flags a taken email before submit. Skipped while the email is still the
  // admin's own, which the check would otherwise report as taken.
  const handleEmailBlur = async () => {
    const email = fields.email.trim();

    if (
      !email ||
      isEmailUnchanged ||
      validateAdminDetailsFields(fields).email
    ) {
      return;
    }

    // `true` reuses a cached answer, so leaving the field again doesn't refetch.
    const result = await checkEmailAvailability(email, true);

    if (latestEmailRef.current.trim() !== email) {
      return;
    }

    // A failed check is ignored here; submitting still checks on the server.
    if (result.data && !result.data.available) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        email: result.data?.message || duplicateEmailMessage,
      }));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const focusFirstError = (
    form: HTMLFormElement,
    nextErrors: AdminDetailsFieldErrors,
  ) => {
    scrollToFirstErrorField(
      form,
      fieldOrder.filter((fieldName) => nextErrors[fieldName]),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const validationErrors = validateAdminDetailsFields(fields);

    setErrors(validationErrors);
    setFormError("");

    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(form, validationErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit({
      email: fields.email.trim(),
      name: normalizeName(fields.name),
      role: fields.role,
    });
    setIsSubmitting(false);

    if (result.success) {
      return;
    }

    const nextErrors = result.errors || {};
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(form, nextErrors);
      return;
    }

    setFormError(result.message || "We could not update this admin right now.");
  };

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6 py-10"
      onClick={handleClose}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          preventBlurOnMouseDown(event);
        }
      }}
      role="dialog"
    >
      <div
        className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h3
              id={titleId}
              className="text-lg font-bold tracking-tight text-slate-950"
            >
              Edit admin
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {isCurrentAdmin
                ? "Update your name or email."
                : `Update ${admin.name}'s name, email, or role.`}
            </p>
          </div>
          <button
            aria-label="Close edit admin"
            className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/30 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="button"
            onClick={handleClose}
            onMouseDown={preventBlurOnMouseDown}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form
          {...blurValidationProps}
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid flex-1 gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
            <Input
              ref={nameInputRef}
              label="Name"
              name="name"
              type="text"
              autoComplete="off"
              value={fields.name}
              error={errors.name}
              maxLength={80}
              onChange={(event) =>
                handleFieldChange("name", event.currentTarget.value)
              }
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="off"
              value={fields.email}
              error={errors.email}
              onBlur={handleEmailBlur}
              onChange={(event) =>
                handleFieldChange("email", event.currentTarget.value)
              }
              required
            />

            <div>
              <Dropdown
                aria-describedby={isCurrentAdmin ? roleHintId : undefined}
                label="Role"
                name="role"
                options={adminRoleOptions}
                value={fields.role}
                error={errors.role}
                disabled={isCurrentAdmin}
                onChange={(event) =>
                  handleFieldChange("role", event.currentTarget.value)
                }
                required
              />
              {/* Mirrors the backend, which keeps at least one super admin by
                  never letting anyone change their own role. */}
              {isCurrentAdmin ? (
                <p id={roleHintId} className="mt-2 text-xs text-slate-500">
                  You can't change your own role.
                </p>
              ) : null}
            </div>

            {formError ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2"
              >
                {formError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
            <Button
              disabled={isSubmitting}
              type="button"
              variant="inverse"
              onClick={handleClose}
              onMouseDown={preventBlurOnMouseDown}
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting || !canSave} type="submit">
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;
