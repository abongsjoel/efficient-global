import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./formFieldStyles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "inverse" | "link" | "dangerLink";
}

const Button = ({
  children,
  className,
  size = "md",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60";
  const sizeStyles = {
    sm: "gap-1.5 rounded-md px-1 py-1 text-xs",
    md: "gap-2 rounded px-6 py-3",
  };
  const variantStyles = {
    dangerLink:
      "text-red-700 hover:text-red-800 focus-visible:ring-red-200 disabled:hover:text-red-700",
    inverse:
      "border border-primary-200 bg-white text-primary-200 hover:bg-primary-100 hover:text-white focus-visible:ring-primary-200/30",
    link: "text-primary-200 hover:text-primary-300 focus-visible:ring-primary-200/20 disabled:hover:text-primary-200",
    primary:
      "bg-primary-200 text-white hover:bg-primary-100 focus-visible:ring-primary-200/30",
  };

  return (
    <button
      type={type}
      className={cx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
