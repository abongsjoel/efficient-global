import {
  cloneElement,
  isValidElement,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

// base control styling (size, shape, typography) shared by every field
const baseControl =
  "mt-2 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition duration-200";

// color/state styles split out so error and normal states never collide
const normalState =
  "border-slate-200 bg-slate-50/70 hover:border-slate-300 focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-200/20";
const errorState =
  "border-red-400 bg-red-50/40 hover:border-red-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/20";

const controlClass = (error?: boolean) =>
  cx(baseControl, error ? errorState : normalState);

// chevron used as the custom select indicator (native arrow is hidden)
const selectChevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")";

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

// controls accept an `error` flag that switches them to the red state
type ControlError = { error?: boolean };

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactElement<ControlError & { name?: string }>;
};

export const Field = ({
  label,
  required,
  error,
  className,
  children,
}: FieldProps) => {
  const name = isValidElement(children) ? children.props.name : undefined;
  const errorId = error && name ? `${name}-error` : undefined;

  // inject the error state (and a11y attrs) into the wrapped control
  const control = isValidElement(children)
    ? cloneElement(children, {
        error: Boolean(error),
        "aria-invalid": Boolean(error),
        "aria-describedby": errorId,
      } as ControlError)
    : children;

  return (
    <label className={cx("block text-sm font-medium text-slate-700", className)}>
      <span className="flex items-center gap-1">
        {label}
        {required && (
          <span aria-hidden className="text-primary-200">
            *
          </span>
        )}
      </span>
      {control}
      {error && (
        <span
          id={errorId}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-sm font-normal text-red-600"
        >
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-5a.9.9 0 00-.9 1l.35 4.5a.55.55 0 001.1 0L10.9 6a.9.9 0 00-.9-1zm0 8a1 1 0 100 2 1 1 0 000-2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}
    </label>
  );
};

export const Input = ({
  className,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & ControlError) => (
  <input className={cx(controlClass(error), className)} {...props} />
);

export const Textarea = ({
  className,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & ControlError) => (
  <textarea className={cx(controlClass(error), className)} {...props} />
);

export const Select = ({
  className,
  error,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & ControlError) => (
  <select
    className={cx(
      controlClass(error),
      "appearance-none bg-[length:1.15rem] bg-[right_0.85rem_center] bg-no-repeat pr-11",
      className,
    )}
    style={{ backgroundImage: selectChevron }}
    {...props}
  />
);

type FormShellProps = {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export const FormShell = ({
  icon,
  eyebrow,
  title,
  description,
  children,
}: FormShellProps) => (
  <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/70">
    <div className="relative border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-6 py-8 sm:px-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-100 via-primary-200 to-primary-100" />
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-200/10 text-2xl">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
    {children}
  </div>
);

export const SubmitButton = ({ children }: { children: ReactNode }) => (
  <button
    type="submit"
    className="group inline-flex w-full items-center justify-center gap-2 rounded-full text-white bg-primary-200 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 shadow-lg shadow-primary-200/30 transition duration-200 hover:-translate-y-0.5 hover:bg-primary-300 hover:shadow-xl hover:shadow-primary-200/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/40"
  >
    {children}
  </button>
);
