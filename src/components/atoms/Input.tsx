import { forwardRef, type InputHTMLAttributes } from "react";
import { cx, formControlStyles, formLabelStyles } from "./formFieldStyles";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, labelClassName, className, ...props },
  ref
) {
  return (
    <label className={cx(formLabelStyles, labelClassName)}>
      {label}
      <input
        ref={ref}
        className={cx("mt-2", formControlStyles, className)}
        {...props}
      />
    </label>
  );
});

export default Input;
