import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  cx,
  formControlStyles,
  formErrorControlStyles,
  formLabelStyles,
  renderErrorMessage,
  renderRequiredLabel,
} from "./formFieldStyles";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  labelClassName?: string;
  suggestions?: string[];
  trailingElement?: ReactNode;
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
    suggestions = [],
    trailingElement,
    onBlur,
    onChange,
    onFocus,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = cx(ariaDescribedBy, errorId) || undefined;
  const suggestionsId = `${inputId}-suggestions`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const hasSuggestions = suggestions.length > 0;
  const filteredSuggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return suggestions;
    }

    return suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(normalizedQuery),
    );
  }, [query, suggestions]);
  const showSuggestions = isSuggestionsOpen && filteredSuggestions.length > 0;

  const assignInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;

    if (typeof ref === "function") {
      ref(node);
      return;
    }

    if (ref) {
      (ref as { current: HTMLInputElement | null }).current = node;
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
    setIsSuggestionsOpen(hasSuggestions);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsSuggestionsOpen(false);
    onBlur?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
    setIsSuggestionsOpen(hasSuggestions);
    onChange?.(event);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    const input = inputRef.current;

    if (input) {
      const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;

      if (valueSetter) {
        valueSetter.call(input, suggestion);
      } else {
        input.value = suggestion;
      }

      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    }

    setQuery(suggestion);
    setIsSuggestionsOpen(false);
  };

  return (
    <div className={cx(formLabelStyles, labelClassName)}>
      <label htmlFor={inputId}>{renderRequiredLabel(label, required)}</label>
      <div className="relative mt-2">
        <input
          ref={assignInputRef}
          id={inputId}
          aria-controls={showSuggestions ? suggestionsId : undefined}
          aria-describedby={describedBy}
          aria-expanded={hasSuggestions ? showSuggestions : undefined}
          aria-haspopup={hasSuggestions ? "listbox" : undefined}
          aria-invalid={error ? true : ariaInvalid}
          required={required}
          className={cx(
            formControlStyles,
            error && formErrorControlStyles,
            trailingElement && "pr-12",
            className
          )}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          {...props}
        />

        {trailingElement ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {trailingElement}
          </div>
        ) : null}

        {showSuggestions ? (
          <div
            id={suggestionsId}
            role="listbox"
            className="absolute left-0 right-0 z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 text-sm text-slate-900 shadow-xl shadow-slate-900/10"
          >
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                role="option"
                tabIndex={-1}
                className="block w-full px-4 py-2.5 text-left transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSuggestionSelect(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {error && errorId ? renderErrorMessage(errorId, error) : null}
    </div>
  );
});

export default Input;
