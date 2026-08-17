import { useEffect, useRef, useState } from "react";
import Button from "../../atoms/Button";
import { cx } from "../../atoms/formFieldStyles";
import { CloseIcon, SearchIcon } from "../../icons";
import {
  TABLE_SEARCH_ATTRIBUTE,
  tableControlButtonClassName,
} from "./tableUtils";

type TableSearchControlProps = {
  hasActiveSearch: boolean;
  inputId: string;
  isCompact: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  value: string;
};

const TableSearchControl = ({
  hasActiveSearch,
  inputId,
  isCompact,
  onChange,
  onClear,
  placeholder,
  value,
}: TableSearchControlProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  // `isCompact` means the toolbar measured that the full field no longer fits
  // on one line. An active search, or one the user deliberately opened, always
  // stays expanded even when that pushes the toolbar onto a second row.
  const isCollapsed = isCompact && !isExpanded && !value;

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  return (
    <div
      {...{ [TABLE_SEARCH_ATTRIBUTE]: "" }}
      className={cx("relative", isCollapsed ? "w-auto" : "w-64 max-w-full")}
    >
      {isCollapsed ? (
        <Button
          aria-controls={inputId}
          aria-expanded={false}
          aria-label="Search table"
          className={tableControlButtonClassName}
          size="sm"
          type="button"
          variant="link"
          onClick={() => setIsExpanded(true)}
        >
          <SearchIcon />
        </Button>
      ) : (
        <label htmlFor={inputId} className="relative block">
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
      )}
    </div>
  );
};

export default TableSearchControl;
