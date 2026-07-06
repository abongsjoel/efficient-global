import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./formFieldStyles";

interface FormSubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const FormSubmitButton = ({
  children,
  className,
  type = "submit",
  ...props
}: FormSubmitButtonProps) => (
  <button
    type={type}
    className={cx(
      "inline-flex w-full justify-center rounded-full bg-primary-100 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition duration-200 hover:bg-primary-200 hover:text-white",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export default FormSubmitButton;
