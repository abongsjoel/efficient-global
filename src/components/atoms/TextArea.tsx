import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cx, formControlStyles, formLabelStyles } from "./formFieldStyles";

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  labelClassName?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, labelClassName, className, ...props }, ref) {
    return (
      <label className={cx(formLabelStyles, labelClassName)}>
        {label}
        <textarea
          ref={ref}
          className={cx("mt-2", formControlStyles, className)}
          {...props}
        />
      </label>
    );
  }
);

export default TextArea;
