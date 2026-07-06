import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import {
  cx,
  formControlStyles,
  formErrorControlStyles,
  formErrorMessageStyles,
  formLabelStyles,
  renderRequiredLabel,
} from "./formFieldStyles";

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  labelClassName?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
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
    ref,
  ) {
    const generatedId = useId();
    const textAreaId = id ?? generatedId;
    const errorId = error ? `${textAreaId}-error` : undefined;
    const describedBy = cx(ariaDescribedBy, errorId) || undefined;

    return (
      <label className={cx(formLabelStyles, labelClassName)}>
        {renderRequiredLabel(label, required)}
        <textarea
          ref={ref}
          id={textAreaId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : ariaInvalid}
          required={required}
          className={cx(
            "mt-2",
            formControlStyles,
            error && formErrorControlStyles,
            className,
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
  }
);

export default TextArea;
