import { useEffect, useRef, useState } from "react";
import Button from "../../atoms/Button";
import { cx } from "../../atoms/formFieldStyles";
import { CloseIcon, SearchIcon } from "../../icons";
import { tableControlButtonClassName } from "./tableUtils";

type TableSearchControlProps = {
  hasActiveSearch: boolean;
  inputId: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  value: string;
};

const TableSearchControl = ({
  hasActiveSearch,
  inputId,
  onChange,
  onClear,
  placeholder,
  value,
}: TableSearchControlProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  // Narrow screens collapse the empty field down to its icon to leave room for
  // the other toolbar controls. From `md` up the field is always shown.
  const isCollapsedOnMobile = !isExpanded && !value;

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  return (
    <div
      className={cx(
        "relative lg:w-64",
        isCollapsedOnMobile ? "w-auto" : "w-full",
      )}
    >
      {isCollapsedOnMobile ? (
        <Button
          aria-controls={inputId}
          aria-expanded={false}
          aria-label="Search table"
          className={cx(tableControlButtonClassName, "md:hidden")}
          size="sm"
          type="button"
          variant="link"
          onClick={() => setIsExpanded(true)}
        >
          <SearchIcon />
        </Button>
      ) : null}

      <label
        htmlFor={inputId}
        className={cx(
          "relative block",
          isCollapsedOnMobile && "hidden md:block",
        )}
      >
        <span className="sr-only">Search table</span>
        <span className="pointer-events-none absolute left-3 top-1/2 text-slate-400 -translate-y-1/2">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          id={inputId}
          className="table-search-input h-9 w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-primary-200 focus:border-primary-200 focus:ring-4 focus:ring-primary-200/20"
          placeholder={placeholder}
          type="search"
          value={value}
          onBlur={() => setIsExpanded(false)}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
        {hasActiveSearch ? (
          <Button
            aria-label="Clear table search"
            className="absolute right-2 top-1/2 rounded-full p-1 text-slate-400 -translate-y-1/2 hover:text-red-600"
            size="sm"
            type="button"
            variant="link"
            onClick={() => {
              onClear();
              setIsExpanded(true);
            }}
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </Button>
        ) : null}
      </label>
    </div>
  );
};

export default TableSearchControl;
