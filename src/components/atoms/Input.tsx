import { forwardRef, useId, type InputHTMLAttributes } from "react";
import {
  cx,
  formControlStyles,
  formErrorControlStyles,
  formErrorMessageStyles,
  formLabelStyles,
  renderRequiredLabel,
} from "./formFieldStyles";

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
    required,
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
      {renderRequiredLabel(label, required)}
      <input
        ref={ref}
        id={inputId}
        aria-describedby={describedBy}
        aria-invalid={error ? true : ariaInvalid}
        required={required}
        className={cx(
          "mt-2",
          formControlStyles,
          error && formErrorControlStyles,
          className
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className={formErrorMessageStyles}>
          {error}
        </p>
      ) : null}
    </label>
  );
});

export default Input;
