import { useState, type FormEvent } from "react";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import { loginAdmin } from "../utils/adminAuth";
import { scrollToFirstErrorField } from "../utils/formFocus";
import {
  type AdminLoginFieldErrors,
  validateAdminLoginFields,
} from "../utils/formValidation";

type AdminLoginPageProps = {
  onLogin: () => void;
};

const adminLoginFieldOrder: Array<keyof AdminLoginFieldErrors> = [
  "username",
  "password",
];

const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    {isVisible ? (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.58 10.58a2 2 0 002.83 2.83" />
        <path d="M9.88 4.24A10.7 10.7 0 0112 4c5 0 8.5 4 10 8a14 14 0 01-2.09 3.54" />
        <path d="M6.61 6.61A13.1 13.1 0 002 12c1.5 4 5 8 10 8a10.6 10.6 0 005.39-1.48" />
      </>
    ) : (
      <>
        <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const AdminLoginPage = ({ onLogin }: AdminLoginPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const validationErrors = validateAdminLoginFields(formData);

    setErrors(validationErrors);
    setLoginError("");

    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstErrorField(
        form,
        adminLoginFieldOrder.filter(
          (fieldName) => validationErrors[fieldName],
        ),
      );
      return;
    }

    const result = loginAdmin({ username, password });

    if (!result.success) {
      setLoginError(result.message || "We could not sign you in.");
      return;
    }

    onLogin();
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
              label="Username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              error={errors.username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
                clearFieldError("username");
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
              }}
              trailingElement={
                <button
                  type="button"
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={isPasswordVisible}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/20"
                  onClick={() =>
                    setIsPasswordVisible((currentValue) => !currentValue)
                  }
                >
                  <EyeIcon isVisible={isPasswordVisible} />
                </button>
              }
              required
            />

            {loginError ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {loginError}
              </p>
            ) : null}

            <Button type="submit" className="w-full rounded-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;
