import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cx, formControlStyles, formLabelStyles } from "./formFieldStyles";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    labelClassName,
    className,
    id,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = cx(ariaDescribedBy, errorId) || undefined;

  return (
    <label className={cx(formLabelStyles, labelClassName)}>
      {label}
      <input
        ref={ref}
        id={inputId}
        aria-describedby={describedBy}
        aria-invalid={error ? true : ariaInvalid}
        className={cx(
          "mt-2",
          formControlStyles,
          error && "border-red-300 focus:border-red-400 focus:ring-red-200/60",
          className
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </label>
  );
});

export default Input;
