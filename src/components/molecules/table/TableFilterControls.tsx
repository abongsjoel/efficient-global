import type { RefObject } from "react";
import Button from "../../atoms/Button";
import { cx } from "../../atoms/formFieldStyles";
import { FilterIcon } from "../../icons";
import type {
  FilterableTableColumn,
  TableDateRangeFilterValue,
  TableFilterOption,
  TableFilterState,
} from "./tableTypes";
import {
  filterControlClassName,
  getColumnLabel,
  isDateRangeFilterValue,
  tableControlButtonClassName,
} from "./tableUtils";

type TableFilterControlsProps<Row> = {
  activeFilterCount: number;
  containerRef: RefObject<HTMLDivElement | null>;
  filteredRowCount: number;
  filters: TableFilterState;
  hasActiveFilters: boolean;
  isOpen: boolean;
  onClearFilters: () => void;
  onDateRangeFilterChange: (
    columnKey: string,
    field: keyof TableDateRangeFilterValue,
    value: string,
  ) => void;
  onTextFilterChange: (columnKey: string, value: string) => void;
  onToggle: () => void;
  panelId: string;
  rowsCount: number;
  selectFilterOptionsByColumnKey: Map<string, TableFilterOption[]>;
  tableColumns: Array<FilterableTableColumn<Row>>;
};

const TableFilterControls = <Row,>({
  activeFilterCount,
  containerRef,
  filteredRowCount,
  filters,
  hasActiveFilters,
  isOpen,
  onClearFilters,
  onDateRangeFilterChange,
  onTextFilterChange,
  onToggle,
  panelId,
  rowsCount,
  selectFilterOptionsByColumnKey,
  tableColumns,
}: TableFilterControlsProps<Row>) => {
  const renderFilterControl = (column: FilterableTableColumn<Row>) => {
    const label = column.filter.label ?? getColumnLabel(column);
    const filterId = `${panelId}-${column.key}`;
    const filterValue = filters[column.key];

    if (column.filter.type === "dateRange") {
      const dateRangeValue = isDateRangeFilterValue(filterValue)
        ? filterValue
        : {};

      return (
        <div key={column.key}>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            {label}
          </span>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <label className="text-xs font-medium text-slate-500">
              From
              <input
                className={filterControlClassName}
                type="date"
                value={dateRangeValue.from ?? ""}
                onChange={(event) =>
                  onDateRangeFilterChange(
                    column.key,
                    "from",
                    event.currentTarget.value,
                  )
                }
              />
            </label>
            <label className="text-xs font-medium text-slate-500">
              To
              <input
                className={filterControlClassName}
                type="date"
                value={dateRangeValue.to ?? ""}
                onChange={(event) =>
                  onDateRangeFilterChange(
                    column.key,
                    "to",
                    event.currentTarget.value,
                  )
                }
              />
            </label>
          </div>
        </div>
      );
    }

    if (column.filter.type === "select") {
      return (
        <label
          key={column.key}
          htmlFor={filterId}
          className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500"
        >
          {label}
          <select
            id={filterId}
            className={filterControlClassName}
            value={typeof filterValue === "string" ? filterValue : ""}
            onChange={(event) =>
              onTextFilterChange(column.key, event.currentTarget.value)
            }
          >
            <option value="">All</option>
            {(selectFilterOptionsByColumnKey.get(column.key) ?? []).map(
              (option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ),
            )}
          </select>
        </label>
      );
    }

    return (
      <label
        key={column.key}
        htmlFor={filterId}
        className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500"
      >
        {label}
        <input
          id={filterId}
          className={filterControlClassName}
          placeholder={column.filter.placeholder ?? `Search ${label}`}
          type="search"
          value={typeof filterValue === "string" ? filterValue : ""}
          onChange={(event) =>
            onTextFilterChange(column.key, event.currentTarget.value)
          }
        />
      </label>
    );
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <Button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-pressed={hasActiveFilters}
        className={cx(
          tableControlButtonClassName,
          (hasActiveFilters || isOpen) &&
            "!border-primary-200 !bg-primary-200 !text-white hover:!bg-primary-300 hover:!text-white",
        )}
        size="sm"
        type="button"
        variant="link"
        onClick={onToggle}
      >
        <FilterIcon />
        {hasActiveFilters ? `Filters (${activeFilterCount})` : "Filters"}
      </Button>

      {isOpen ? (
        <div
          id={panelId}
          className="absolute right-0 z-50 mt-2 max-h-[28rem] w-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/15"
        >
          <div className="space-y-4">
            {tableColumns.map(renderFilterControl)}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-500">
              {filteredRowCount} of {rowsCount} shown
            </span>
            <Button
              className="px-2 py-1 text-xs"
              disabled={!hasActiveFilters}
              size="sm"
              type="button"
              variant="link"
              onClick={onClearFilters}
            >
              Clear filters
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TableFilterControls;
