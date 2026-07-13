import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import {
  cx,
  formControlStyles,
  formErrorControlStyles,
  formLabelStyles,
  renderErrorMessage,
  renderRequiredLabel,
} from "./formFieldStyles";

export interface DropdownOption {
  label: string;
  value?: string;
  disabled?: boolean;
}

export interface DropdownProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  error?: string;
  labelClassName?: string;
}

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(function Dropdown(
  {
    label,
    options,
    placeholder,
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
  const selectId = id ?? generatedId;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = cx(ariaDescribedBy, errorId) || undefined;

  return (
    <label className={cx(formLabelStyles, labelClassName)}>
      {renderRequiredLabel(label, required)}
      <div className="relative mt-2">
        <select
          ref={ref}
          id={selectId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : ariaInvalid}
          required={required}
          className={cx(
            formControlStyles,
            "appearance-none pr-12",
            placeholder && "invalid:text-slate-400",
            error && formErrorControlStyles,
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled className="text-slate-400">
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => {
            const value = option.value ?? option.label;

            return (
              <option
                key={`${value}-${option.label}`}
                value={value}
                disabled={option.disabled}
                className="text-slate-900"
              >
                {option.label}
              </option>
            );
          })}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
      {error && errorId ? renderErrorMessage(errorId, error) : null}
    </label>
  );
});

export default Dropdown;
