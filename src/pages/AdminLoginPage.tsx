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

const AdminLoginPage = ({ onLogin }: AdminLoginPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
              type="password"
              autoComplete="current-password"
              value={password}
              error={errors.password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
                clearFieldError("password");
              }}
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
