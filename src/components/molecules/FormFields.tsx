import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

// shared control styling so every field looks and behaves the same
const controlClasses =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition duration-200 hover:border-slate-300 focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-200/20";

// chevron used as the custom select indicator (native arrow is hidden)
const selectChevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")";

const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

type FieldProps = {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export const Field = ({ label, required, className, children }: FieldProps) => (
  <label className={cx("block text-sm font-medium text-slate-700", className)}>
    <span className="flex items-center gap-1">
      {label}
      {required && (
        <span aria-hidden className="text-primary-200">
          *
        </span>
      )}
    </span>
    {children}
  </label>
);

export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={cx(controlClasses, className)} {...props} />
);

export const Textarea = ({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={cx(controlClasses, className)} {...props} />
);

export const Select = ({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cx(
      controlClasses,
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
    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-200 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 shadow-lg shadow-primary-200/30 transition duration-200 hover:-translate-y-0.5 hover:bg-primary-300 hover:shadow-xl hover:shadow-primary-200/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/40"
  >
    {children}
    <span
      aria-hidden
      className="transition-transform duration-200 group-hover:translate-x-1"
    >
      →
    </span>
  </button>
);
