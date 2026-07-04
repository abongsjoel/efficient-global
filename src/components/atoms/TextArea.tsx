import { forwardRef, type TextareaHTMLAttributes } from "react";
import {
  cx,
  formControlStyles,
  formLabelStyles,
  renderRequiredLabel,
} from "./formFieldStyles";

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  labelClassName?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    { label, labelClassName, className, required, ...props },
    ref,
  ) {
    return (
      <label className={cx(formLabelStyles, labelClassName)}>
        {renderRequiredLabel(label, required)}
        <textarea
          ref={ref}
          required={required}
          className={cx("mt-2", formControlStyles, className)}
          {...props}
        />
      </label>
    );
  }
);

export default TextArea;
