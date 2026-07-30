import { useState, type FormEvent } from "react";
import FormSubmitButton from "../components/atoms/FormSubmitButton";
import Input from "../components/atoms/Input";
import PasswordVisibilityButton from "../components/atoms/PasswordVisibilityButton";
import { loginAdmin, type Admin } from "../utils/adminAuth";
import { scrollToFirstErrorField } from "../utils/formFocus";
import {
  type AdminLoginFieldErrors,
  validateAdminLoginFields,
} from "../utils/formValidation";

type AdminLoginPageProps = {
  onLogin: (admin: Admin) => void;
};

const adminLoginFieldOrder: Array<keyof AdminLoginFieldErrors> = [
  "identifier",
  "password",
];

const AdminLoginPage = ({ onLogin }: AdminLoginPageProps) => {
  const [identifier, setIdentifier] = useState("");
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<AdminLoginFieldErrors>({});
  const [loginError, setLoginError] = useState("");

  const clearFieldError = (field: keyof AdminLoginFieldErrors) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const validationErrors = validateAdminLoginFields(formData);

    setErrors(validationErrors);
    setLoginError("");

    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstErrorField(
        form,
        adminLoginFieldOrder.filter((fieldName) => validationErrors[fieldName]),
      );
      return;
    }

    setIsSubmitting(true);
    const result = await loginAdmin({ identifier, keepMeLoggedIn, password });
    setIsSubmitting(false);

    if (!result.success) {
      if (result.errors) {
        setErrors(result.errors);
        scrollToFirstErrorField(
          form,
          adminLoginFieldOrder.filter(
            (fieldName) => result.errors?.[fieldName],
          ),
        );
      }

      setLoginError(result.message || "We could not sign you in.");
      return;
    }

    onLogin(result.admin);
  };

  return (
    <section className="min-h-[calc(100vh-7rem)] snap-start bg-slate-50 px-6 py-16 text-slate-950 lg:px-10">
      <div className="mx-auto flex max-w-7xl justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter your admin credentials to continue.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <Input
              label="Username/Email"
              name="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              error={errors.identifier}
              onChange={(event) => {
                setIdentifier(event.currentTarget.value);
                clearFieldError("identifier");
                setLoginError("");
              }}
              required
            />

            <Input
              label="Password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              error={errors.password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
                clearFieldError("password");
                setLoginError("");
              }}
              trailingElement={
                <PasswordVisibilityButton
                  isVisible={isPasswordVisible}
                  onClick={() =>
                    setIsPasswordVisible((currentValue) => !currentValue)
                  }
                />
              }
              required
            />

            <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <input
                type="checkbox"
                checked={keepMeLoggedIn}
                className="h-4 w-4 accent-primary-200"
                onChange={(event) =>
                  setKeepMeLoggedIn(event.currentTarget.checked)
                }
              />
              Keep me logged in
            </label>

            {loginError ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {loginError}
              </p>
            ) : null}

            <FormSubmitButton
              disabled={isSubmitting}
              isLoading={isSubmitting}
              loadingLabel="Signing in"
            >
              Sign in
            </FormSubmitButton>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;
