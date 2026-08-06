import Button from "../../atoms/Button";
import { CloseIcon, SearchIcon } from "../../icons";

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
}: TableSearchControlProps) => (
  <label htmlFor={inputId} className="relative w-full sm:w-64">
    <span className="sr-only">Search table</span>
    <span className="pointer-events-none absolute left-3 top-1/2 text-slate-400 -translate-y-1/2">
      <SearchIcon />
    </span>
    <input
      id={inputId}
      className="table-search-input h-9 w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-primary-200 focus:border-primary-200 focus:ring-4 focus:ring-primary-200/20"
      placeholder={placeholder}
      type="search"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
    {hasActiveSearch ? (
      <Button
        aria-label="Clear table search"
        className="absolute right-2 top-1/2 rounded-full p-1 text-slate-400 -translate-y-1/2 hover:text-red-600"
        size="sm"
        type="button"
        variant="link"
        onClick={onClear}
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </Button>
    ) : null}
  </label>
);

export default TableSearchControl;
