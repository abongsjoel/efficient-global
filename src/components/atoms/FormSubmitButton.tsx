import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./formFieldStyles";

interface FormSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
}

const FormSubmitButton = ({
  children,
  className,
  isLoading = false,
  loadingLabel = "Sending",
  type = "submit",
  ...props
}: FormSubmitButtonProps) => (
  <button
    type={type}
    className={cx(
      "group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary-200 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 hover:text-white shadow-lg shadow-primary-200/30 transition duration-200 hover:-translate-y-0.5 hover:bg-primary-300 hover:shadow-xl hover:shadow-primary-200/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-primary-200",
      className,
    )}
    {...props}
  >
    {isLoading ? (
      <>
        <span
          aria-hidden="true"
          className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950 group-hover:border-white/30 group-hover:border-t-white"
        />
        <span className="sr-only">{loadingLabel}</span>
      </>
    ) : (
      children
    )}
  </button>
);

export default FormSubmitButton;
