import Button from "../../atoms/Button";
import { CloseIcon } from "../../icons";
import type { ActiveFilterSummary } from "./tableTypes";

type TableActiveControlsProps = {
  activeFilterSummaries: ActiveFilterSummary[];
  filteredRowCount: number;
  hasActiveFilters: boolean;
  hasActiveSearch: boolean;
  onClearAll: () => void;
  onClearFilter: (columnKey: string) => void;
  onClearSearch: () => void;
  rowsCount: number;
  searchQuery: string;
};

const TableActiveControls = ({
  activeFilterSummaries,
  filteredRowCount,
  hasActiveFilters,
  hasActiveSearch,
  onClearAll,
  onClearFilter,
  onClearSearch,
  rowsCount,
  searchQuery,
}: TableActiveControlsProps) =>
  hasActiveFilters || hasActiveSearch ? (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
        Showing {filteredRowCount} of {rowsCount}
      </span>
      {hasActiveSearch ? (
        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary-200/30 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
          <span className="truncate">
            <span className="font-semibold text-slate-900">Search:</span>{" "}
            {searchQuery.trim()}
          </span>
          <Button
            aria-label="Remove search"
            className="rounded-full p-0.5 text-slate-400 hover:text-red-600"
            size="sm"
            type="button"
            variant="link"
            onClick={onClearSearch}
          >
            <CloseIcon className="h-3 w-3" />
          </Button>
        </span>
      ) : null}
      {activeFilterSummaries.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary-200/30 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
        >
          <span className="truncate">
            <span className="font-semibold text-slate-900">
              {filter.label}:
            </span>{" "}
            {filter.valueLabel}
          </span>
          <Button
            aria-label={`Remove ${filter.label} filter`}
            className="rounded-full p-0.5 text-slate-400 hover:text-red-600"
            size="sm"
            type="button"
            variant="link"
            onClick={() => onClearFilter(filter.key)}
          >
            <CloseIcon className="h-3 w-3" />
          </Button>
        </span>
      ))}
      <Button
        className="px-2 py-1 text-xs"
        size="sm"
        type="button"
        variant="link"
        onClick={onClearAll}
      >
        Clear all
      </Button>
    </div>
  ) : null;

export default TableActiveControls;
