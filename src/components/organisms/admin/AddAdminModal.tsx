import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import Button from "../../atoms/Button";
import Dropdown, { type DropdownOption } from "../../atoms/Dropdown";
import Input from "../../atoms/Input";
import PasswordVisibilityButton from "../../atoms/PasswordVisibilityButton";
import { CloseIcon } from "../../icons";
import PasswordRequirements from "../../molecules/PasswordRequirements";
import {
  maxAdminPasswordLength,
  minAdminPasswordLength,
} from "../../../utils/adminPassword";
import { scrollToFirstErrorField } from "../../../utils/formFocus";
import {
  type AddAdminFieldErrors,
  type AddAdminFields,
  validateAddAdminFields,
} from "../../../utils/formValidation";

export type AddAdminSubmitResult =
  | { success: true }
  | {
      success: false;
      errors?: AddAdminFieldErrors;
      message?: string;
    };

type AddAdminModalProps = {
  onClose: () => void;
  onSubmit: (fields: AddAdminFields) => Promise<AddAdminSubmitResult>;
};

type PasswordField = "confirmPassword" | "password";

type BlurValidatedField = "confirmPassword" | "email" | "name" | "password";

// Keeps the focused field from blurring when a dismiss control is pressed, so a
// blur error can't appear, shift the layout, and make the click miss.
const preventBlurOnMouseDown = (event: MouseEvent) => {
  event.preventDefault();
};

// Mirrors the backend roles and statuses in constants/admin.js.
const roleOptions: DropdownOption[] = [
  { label: "Super Admin", value: "super_admin" },
  { label: "Manager", value: "manager" },
  { label: "Dispatcher", value: "dispatcher" },
  { label: "Viewer", value: "viewer" },
];

const statusOptions: DropdownOption[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const initialFields: AddAdminFields = {
  confirmPassword: "",
  email: "",
  name: "",
  password: "",
  role: "viewer",
  status: "active",
};

const fieldOrder: Array<keyof AddAdminFields> = [
  "name",
  "email",
  "role",
  "status",
  "password",
  "confirmPassword",
];

const AddAdminModal = ({ onClose, onSubmit }: AddAdminModalProps) => {
  const titleId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  // Fields the user has typed in. Blur only validates these, so tabbing past an
  // empty field doesn't flag it before the user has had a chance to fill it in.
  const editedFieldsRef = useRef(new Set<keyof AddAdminFields>());
  const [fields, setFields] = useState<AddAdminFields>(initialFields);
  const [errors, setErrors] = useState<AddAdminFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<PasswordField, boolean>
  >({ confirmPassword: false, password: false });

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

  const handleFieldChange = (field: keyof AddAdminFields, value: string) => {
    editedFieldsRef.current.add(field);
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

  const handleFieldBlur =
    (field: BlurValidatedField) => (event: FocusEvent<HTMLInputElement>) => {
      const nextFocusTarget = event.relatedTarget;

      // Focus moved to the field's own show/hide password button.
      if (
        nextFocusTarget instanceof Node &&
        event.currentTarget.parentElement?.contains(nextFocusTarget)
      ) {
        return;
      }

      // A changed password can make an already-typed confirmation stop matching.
      const fieldsToValidate: BlurValidatedField[] =
        field === "password" ? ["password", "confirmPassword"] : [field];
      const editedFieldsToValidate = fieldsToValidate.filter((fieldName) =>
        editedFieldsRef.current.has(fieldName),
      );

      if (editedFieldsToValidate.length === 0) {
        return;
      }

      const validationErrors = validateAddAdminFields(fields);

      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };

        editedFieldsToValidate.forEach((fieldName) => {
          if (validationErrors[fieldName]) {
            nextErrors[fieldName] = validationErrors[fieldName];
          } else {
            delete nextErrors[fieldName];
          }
        });

        return nextErrors;
      });
    };

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((currentVisibility) => ({
      ...currentVisibility,
      [field]: !currentVisibility[field],
    }));
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const focusFirstError = (
    form: HTMLFormElement,
    nextErrors: AddAdminFieldErrors,
  ) => {
    scrollToFirstErrorField(
      form,
      fieldOrder.filter((fieldName) => nextErrors[fieldName]),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const validationErrors = validateAddAdminFields(fields);

    setErrors(validationErrors);
    setFormError("");

    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(form, validationErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit({
      ...fields,
      email: fields.email.trim(),
      name: fields.name.trim().replace(/\s+/g, " "),
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

    setFormError(result.message || "We could not add this admin right now.");
  };

  const renderPasswordVisibilityButton = (field: PasswordField) => (
    <PasswordVisibilityButton
      isVisible={passwordVisibility[field]}
      onClick={() => togglePasswordVisibility(field)}
    />
  );

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
              Add admin
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Create an account and share the password with the new admin.
            </p>
          </div>
          <button
            aria-label="Close add admin"
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
              onBlur={handleFieldBlur("name")}
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
              onBlur={handleFieldBlur("email")}
              onChange={(event) =>
                handleFieldChange("email", event.currentTarget.value)
              }
              required
            />

            <Dropdown
              label="Role"
              name="role"
              options={roleOptions}
              value={fields.role}
              error={errors.role}
              onChange={(event) =>
                handleFieldChange("role", event.currentTarget.value)
              }
              required
            />

            <Dropdown
              label="Status"
              name="status"
              options={statusOptions}
              value={fields.status}
              error={errors.status}
              onChange={(event) =>
                handleFieldChange("status", event.currentTarget.value)
              }
              required
            />

            <div>
              <Input
                label="Password"
                name="password"
                type={passwordVisibility.password ? "text" : "password"}
                autoComplete="new-password"
                value={fields.password}
                error={errors.password}
                minLength={minAdminPasswordLength}
                maxLength={maxAdminPasswordLength}
                onBlur={handleFieldBlur("password")}
                onChange={(event) =>
                  handleFieldChange("password", event.currentTarget.value)
                }
                trailingElement={renderPasswordVisibilityButton("password")}
                required
              />

              <PasswordRequirements
                label="Password requirements"
                password={fields.password}
              />
            </div>

            <Input
              label="Confirm password"
              name="confirmPassword"
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={fields.confirmPassword}
              error={errors.confirmPassword}
              minLength={minAdminPasswordLength}
              maxLength={maxAdminPasswordLength}
              onBlur={handleFieldBlur("confirmPassword")}
              onChange={(event) =>
                handleFieldChange("confirmPassword", event.currentTarget.value)
              }
              trailingElement={renderPasswordVisibilityButton(
                "confirmPassword",
              )}
              required
            />

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
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Adding..." : "Add admin"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
