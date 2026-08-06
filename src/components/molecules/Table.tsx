import {
  type ChangeEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Button from "../atoms/Button";
import HighlightedText from "../atoms/HighlightedText";
import { cx } from "../atoms/formFieldStyles";
import {
  CloseIcon,
  ColumnsIcon,
  FilterIcon,
  SearchIcon,
  SortIcon,
} from "../icons";

export type TableSortValue =
  | boolean
  | Date
  | null
  | number
  | string
  | undefined;

type SortDirection = "asc" | "desc";

type SortState = {
  columnKey: string;
  direction: SortDirection;
} | null;

type TableFilterType = "dateRange" | "select" | "text";

type TableFilterOption = {
  label: string;
  value: string;
};

type TableDateRangeFilterValue = {
  from?: string;
  to?: string;
};

type TableFilterStateValue = string | TableDateRangeFilterValue;

type TableFilterState = Record<string, TableFilterStateValue | undefined>;

type TableSearchValue = TableSortValue | TableSortValue[];

export type TableRenderContext = {
  highlightSearchText: (value: TableSortValue) => ReactNode;
  searchQuery: string;
};

type TableFilterConfig<Row> = {
  label?: string;
  options?: TableFilterOption[];
  placeholder?: string;
  type: TableFilterType;
  value: (row: Row) => TableSortValue;
};

export type TableColumn<Row> = {
  cellClassName?: string;
  filter?: TableFilterConfig<Row>;
  header: ReactNode;
  headerClassName?: string;
  isHideable?: boolean;
  isSortable?: boolean;
  key: string;
  label?: string;
  render: (row: Row, context: TableRenderContext) => ReactNode;
  sortValue?: (row: Row) => TableSortValue;
};

type TableProps<Row> = {
  className?: string;
  columns: Array<TableColumn<Row>>;
  columnVisibilityStorageKey?: string;
  emptyMessage?: string;
  errorMessage?: string;
  getRowKey: (row: Row, index: number) => string;
  isLoading?: boolean;
  loadingMessage?: string;
  minWidthClassName?: string;
  rows: Row[];
  searchPlaceholder?: string;
  searchValue?: (row: Row) => TableSearchValue;
  subtitle?: ReactNode;
  title?: ReactNode;
};

const getColumnLabel = <Row,>(column: TableColumn<Row>) => {
  if (column.label) {
    return column.label;
  }

  return typeof column.header === "string" ? column.header : column.key;
};

const getStoredHiddenColumnKeys = (storageKey: string | undefined) => {
  if (!storageKey || typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  } catch {
    return [];
  }
};

const sortValueCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

const tableControlButtonClassName =
  "rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:border-primary-200 hover:bg-slate-50 hover:text-primary-200";

const filterControlClassName =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-200/20";

const hasColumnFilter = <Row,>(
  column: TableColumn<Row>,
): column is TableColumn<Row> & { filter: TableFilterConfig<Row> } =>
  Boolean(column.filter);

const isColumnSortable = <Row,>(column: TableColumn<Row>) =>
  column.isSortable !== false && typeof column.sortValue === "function";

const formatFilterOptionLabel = (value: string) =>
  (value || "Unknown")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const normalizeSortValue = (value: TableSortValue) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    const timestamp = value.getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
};

const compareSortValues = (
  firstValue: TableSortValue,
  secondValue: TableSortValue,
) => {
  const firstComparableValue = normalizeSortValue(firstValue);
  const secondComparableValue = normalizeSortValue(secondValue);

  if (firstComparableValue === null && secondComparableValue === null) {
    return 0;
  }

  if (firstComparableValue === null) {
    return 1;
  }

  if (secondComparableValue === null) {
    return -1;
  }

  if (
    typeof firstComparableValue === "number" &&
    typeof secondComparableValue === "number"
  ) {
    return firstComparableValue - secondComparableValue;
  }

  return sortValueCollator.compare(
    String(firstComparableValue),
    String(secondComparableValue),
  );
};

const getFilterStringValue = (value: TableSortValue) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString();
  }

  return String(value).trim();
};

const normalizeFilterText = (value: TableSortValue) =>
  getFilterStringValue(value).toLowerCase();

const getSearchStringValue = (value: TableSearchValue) =>
  (Array.isArray(value) ? value : [value])
    .map(getFilterStringValue)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const getDefaultSearchStringValue = <Row,>(
  row: Row,
  columns: Array<TableColumn<Row>>,
) =>
  columns
    .flatMap((column) => [
      column.filter?.value(row),
      column.sortValue?.(row),
    ])
    .filter(
      (value): value is Exclude<TableSortValue, null | undefined> =>
        value !== null && value !== undefined,
    )
    .map(getFilterStringValue)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const getFilterTimestamp = (value: TableSortValue) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    const timestamp = value.getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }

  const timestamp = new Date(String(value)).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const getDateInputTimestamp = (value: string | undefined, endOfDay = false) => {
  if (!value) {
    return null;
  }

  const timestamp = new Date(
    `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`,
  ).getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
};

const isDateRangeFilterValue = (
  value: TableFilterStateValue | undefined,
): value is TableDateRangeFilterValue =>
  Boolean(value) && typeof value === "object";

const isFilterValueActive = (value: TableFilterStateValue | undefined) => {
  if (!value) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return Boolean(value.from || value.to);
};

const getActiveFilterCount = (filters: TableFilterState) =>
  Object.values(filters).filter(isFilterValueActive).length;

const doesRowMatchFilter = <Row,>(
  row: Row,
  column: TableColumn<Row> & { filter: TableFilterConfig<Row> },
  filterValue: TableFilterStateValue | undefined,
) => {
  if (!isFilterValueActive(filterValue)) {
    return true;
  }

  const rowValue = column.filter.value(row);

  if (column.filter.type === "dateRange") {
    if (!isDateRangeFilterValue(filterValue)) {
      return true;
    }

    const rowTimestamp = getFilterTimestamp(rowValue);

    if (rowTimestamp === null) {
      return false;
    }

    const fromTimestamp = getDateInputTimestamp(filterValue.from);
    const toTimestamp = getDateInputTimestamp(filterValue.to, true);

    return (
      (fromTimestamp === null || rowTimestamp >= fromTimestamp) &&
      (toTimestamp === null || rowTimestamp <= toTimestamp)
    );
  }

  if (typeof filterValue !== "string") {
    return true;
  }

  const normalizedFilterValue = filterValue.trim().toLowerCase();

  if (!normalizedFilterValue) {
    return true;
  }

  if (column.filter.type === "select") {
    return normalizeFilterText(rowValue) === normalizedFilterValue;
  }

  return normalizeFilterText(rowValue).includes(normalizedFilterValue);
};

const Table = <Row,>({
  className,
  columns,
  columnVisibilityStorageKey,
  emptyMessage = "No records found.",
  errorMessage = "",
  getRowKey,
  isLoading = false,
  loadingMessage = "Loading...",
  minWidthClassName = "min-w-full",
  rows,
  searchPlaceholder = "Search table...",
  searchValue,
  subtitle,
  title,
}: TableProps<Row>) => {
  const columnControlsId = useId();
  const columnControlsRef = useRef<HTMLDivElement>(null);
  const filterControlsId = useId();
  const filterControlsRef = useRef<HTMLDivElement>(null);
  const searchInputId = useId();
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>(() =>
    getStoredHiddenColumnKeys(columnVisibilityStorageKey),
  );
  const [filters, setFilters] = useState<TableFilterState>({});
  const [isColumnPanelOpen, setIsColumnPanelOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortState, setSortState] = useState<SortState>(null);
  const hiddenColumnKeySet = useMemo(
    () => new Set(hiddenColumnKeys),
    [hiddenColumnKeys],
  );
  const hideableColumns = useMemo(
    () => columns.filter((column) => column.isHideable !== false),
    [columns],
  );
  const visibleColumns = useMemo(() => {
    const nextVisibleColumns = columns.filter(
      (column) =>
        column.isHideable === false || !hiddenColumnKeySet.has(column.key),
    );

    return nextVisibleColumns.length > 0 ? nextVisibleColumns : columns;
  }, [columns, hiddenColumnKeySet]);
  const sortableColumnByKey = useMemo(
    () =>
      new Map(
        columns.filter(isColumnSortable).map((column) => [column.key, column]),
      ),
    [columns],
  );
  const filterableColumns = useMemo(
    () => columns.filter(hasColumnFilter),
    [columns],
  );
  const filterableColumnByKey = useMemo(
    () => new Map(filterableColumns.map((column) => [column.key, column])),
    [filterableColumns],
  );
  const activeFilterCount = useMemo(
    () => getActiveFilterCount(filters),
    [filters],
  );
  const hasActiveFilters = activeFilterCount > 0;
  const trimmedSearchQuery = searchQuery.trim();
  const normalizedSearchQuery = trimmedSearchQuery.toLowerCase();
  const hasActiveSearch = normalizedSearchQuery.length > 0;
  const shouldShowSearchControl =
    Boolean(searchValue) ||
    columns.some((column) => column.filter || column.sortValue);
  const renderContext = useMemo<TableRenderContext>(
    () => ({
      highlightSearchText: (value) => (
        <HighlightedText
          query={trimmedSearchQuery}
          text={getFilterStringValue(value)}
        />
      ),
      searchQuery: trimmedSearchQuery,
    }),
    [trimmedSearchQuery],
  );
  const searchedRows = useMemo(() => {
    if (!hasActiveSearch) {
      return rows;
    }

    return rows.filter((row) => {
      const rowSearchValue = searchValue
        ? getSearchStringValue(searchValue(row))
        : getDefaultSearchStringValue(row, columns);

      return rowSearchValue.includes(normalizedSearchQuery);
    });
  }, [columns, hasActiveSearch, normalizedSearchQuery, rows, searchValue]);
  const filteredRows = useMemo(() => {
    if (!hasActiveFilters) {
      return searchedRows;
    }

    return searchedRows.filter((row) =>
      Object.entries(filters).every(([columnKey, filterValue]) => {
        const column = filterableColumnByKey.get(columnKey);

        return column ? doesRowMatchFilter(row, column, filterValue) : true;
      }),
    );
  }, [filterableColumnByKey, filters, hasActiveFilters, searchedRows]);
  const sortedRows = useMemo(() => {
    if (!isSortingEnabled || !sortState) {
      return filteredRows;
    }

    const sortColumn = sortableColumnByKey.get(sortState.columnKey);

    if (!sortColumn?.sortValue) {
      return filteredRows;
    }

    return filteredRows
      .map((row, index) => ({ index, row }))
      .sort((firstRow, secondRow) => {
        const comparison = compareSortValues(
          sortColumn.sortValue?.(firstRow.row),
          sortColumn.sortValue?.(secondRow.row),
        );

        if (comparison === 0) {
          return firstRow.index - secondRow.index;
        }

        return sortState.direction === "asc" ? comparison : -comparison;
      })
      .map(({ row }) => row);
  }, [filteredRows, isSortingEnabled, sortState, sortableColumnByKey]);
  const hasHeader = Boolean(title || subtitle);
  const shouldShowTable = !isLoading && !errorMessage && filteredRows.length > 0;
  const shouldShowColumnControls = hideableColumns.length > 1;
  const shouldShowFilterControls = filterableColumns.length > 0;
  const shouldShowSortControls = sortableColumnByKey.size > 0;
  const selectFilterOptionsByColumnKey = useMemo(() => {
    const optionsByColumnKey = new Map<string, TableFilterOption[]>();

    filterableColumns.forEach((column) => {
      if (column.filter.type !== "select") {
        return;
      }

      if (column.filter.options) {
        optionsByColumnKey.set(column.key, column.filter.options);
        return;
      }

      const optionsByValue = new Map<string, TableFilterOption>();

      rows.forEach((row) => {
        const rawValue = getFilterStringValue(column.filter.value(row));
        const value = rawValue.toLowerCase();

        if (!value || optionsByValue.has(value)) {
          return;
        }

        optionsByValue.set(value, {
          label: formatFilterOptionLabel(rawValue),
          value,
        });
      });

      optionsByColumnKey.set(
        column.key,
        [...optionsByValue.values()].sort((firstOption, secondOption) =>
          sortValueCollator.compare(firstOption.label, secondOption.label),
        ),
      );
    });

    return optionsByColumnKey;
  }, [filterableColumns, rows]);
  const activeFilterSummaries = useMemo(
    () =>
      filterableColumns
        .map((column) => {
          const filterValue = filters[column.key];

          if (!isFilterValueActive(filterValue)) {
            return null;
          }

          const label = column.filter.label ?? getColumnLabel(column);
          let valueLabel = "";

          if (
            column.filter.type === "dateRange" &&
            isDateRangeFilterValue(filterValue)
          ) {
            if (filterValue.from && filterValue.to) {
              valueLabel = `${filterValue.from} to ${filterValue.to}`;
            } else {
              valueLabel = filterValue.from
                ? `from ${filterValue.from}`
                : `until ${filterValue.to}`;
            }
          } else if (typeof filterValue === "string") {
            const trimmedFilterValue = filterValue.trim();

            if (column.filter.type === "select") {
              valueLabel =
                selectFilterOptionsByColumnKey
                  .get(column.key)
                  ?.find((option) => option.value === trimmedFilterValue)
                  ?.label ?? trimmedFilterValue;
            } else {
              valueLabel = trimmedFilterValue;
            }
          }

          return {
            key: column.key,
            label,
            valueLabel,
          };
        })
        .filter(
          (
            summary,
          ): summary is { key: string; label: string; valueLabel: string } =>
            Boolean(summary),
        ),
    [filterableColumns, filters, selectFilterOptionsByColumnKey],
  );

  useEffect(() => {
    if (!columnVisibilityStorageKey || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      columnVisibilityStorageKey,
      JSON.stringify(hiddenColumnKeys),
    );
  }, [columnVisibilityStorageKey, hiddenColumnKeys]);

  useEffect(() => {
    if (!isColumnPanelOpen && !isFilterPanelOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) {
        return;
      }

      if (
        isColumnPanelOpen &&
        !columnControlsRef.current?.contains(event.target)
      ) {
        setIsColumnPanelOpen(false);
      }

      if (
        isFilterPanelOpen &&
        !filterControlsRef.current?.contains(event.target)
      ) {
        setIsFilterPanelOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsColumnPanelOpen(false);
        setIsFilterPanelOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isColumnPanelOpen, isFilterPanelOpen]);

  const updateFilter = (
    columnKey: string,
    filterValue: TableFilterStateValue | undefined,
  ) => {
    setFilters((currentFilters) => {
      const nextFilters = { ...currentFilters };

      if (isFilterValueActive(filterValue)) {
        nextFilters[columnKey] = filterValue;
      } else {
        delete nextFilters[columnKey];
      }

      return nextFilters;
    });
  };

  const updateTextFilter = (
    columnKey: string,
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    updateFilter(columnKey, event.currentTarget.value);
  };

  const updateDateRangeFilter = (
    columnKey: string,
    field: keyof TableDateRangeFilterValue,
    value: string,
  ) => {
    setFilters((currentFilters) => {
      const currentFilterValue = currentFilters[columnKey];
      const currentDateRangeFilter = isDateRangeFilterValue(currentFilterValue)
        ? currentFilterValue
        : {};
      const nextDateRangeFilter = {
        ...currentDateRangeFilter,
        [field]: value,
      };
      const nextFilters = { ...currentFilters };

      if (isFilterValueActive(nextDateRangeFilter)) {
        nextFilters[columnKey] = nextDateRangeFilter;
      } else {
        delete nextFilters[columnKey];
      }

      return nextFilters;
    });
  };

  const clearFilter = (columnKey: string) => {
    setFilters((currentFilters) => {
      const nextFilters = { ...currentFilters };
      delete nextFilters[columnKey];
      return nextFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearSearchAndFilters = () => {
    setSearchQuery("");
    setFilters({});
  };

  const renderFilterControl = (
    column: TableColumn<Row> & { filter: TableFilterConfig<Row> },
  ) => {
    const label = column.filter.label ?? getColumnLabel(column);
    const filterId = `${filterControlsId}-${column.key}`;
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
                  updateDateRangeFilter(
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
                  updateDateRangeFilter(
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
            onChange={(event) => updateTextFilter(column.key, event)}
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
          onChange={(event) => updateTextFilter(column.key, event)}
        />
      </label>
    );
  };

  const toggleColumnVisibility = (columnKey: string) => {
    if (
      sortState?.columnKey === columnKey &&
      !hiddenColumnKeySet.has(columnKey)
    ) {
      setSortState(null);
    }

    setHiddenColumnKeys((currentHiddenColumnKeys) => {
      if (currentHiddenColumnKeys.includes(columnKey)) {
        return currentHiddenColumnKeys.filter((key) => key !== columnKey);
      }

      const visibleHideableColumnCount = hideableColumns.filter(
        (column) => !currentHiddenColumnKeys.includes(column.key),
      ).length;

      if (visibleHideableColumnCount <= 1) {
        return currentHiddenColumnKeys;
      }

      return [...currentHiddenColumnKeys, columnKey];
    });
  };

  const toggleColumnSort = (columnKey: string) => {
    setSortState((currentSortState) => {
      if (currentSortState?.columnKey !== columnKey) {
        return { columnKey, direction: "asc" };
      }

      if (currentSortState.direction === "asc") {
        return { columnKey, direction: "desc" };
      }

      return null;
    });
  };

  const toggleSorting = () => {
    if (isSortingEnabled) {
      setSortState(null);
    }

    setIsSortingEnabled((currentValue) => !currentValue);
  };

  const renderColumnHeader = (column: TableColumn<Row>) => {
    const isSortable = isSortingEnabled && isColumnSortable(column);
    const sortDirection =
      sortState?.columnKey === column.key ? sortState.direction : undefined;
    const ariaSortValue = isSortable
      ? sortDirection === "asc"
        ? "ascending"
        : sortDirection === "desc"
          ? "descending"
          : "none"
      : undefined;

    return (
      <th
        key={column.key}
        aria-sort={ariaSortValue}
        className={cx("px-4 py-3 font-semibold", column.headerClassName)}
      >
        {isSortable ? (
          <button
            aria-label={`Sort by ${getColumnLabel(column)}`}
            className={cx(
              "inline-flex items-center gap-1.5 rounded text-left font-semibold transition hover:text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-200/30",
              sortDirection ? "text-primary-200" : undefined,
            )}
            type="button"
            onClick={() => toggleColumnSort(column.key)}
          >
            <span>{column.header}</span>
            <SortIcon direction={sortDirection} />
          </button>
        ) : (
          column.header
        )}
      </th>
    );
  };

  return (
    <section
      className={cx(
        "overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5",
        className,
      )}
    >
      {hasHeader ? (
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-lg font-bold text-slate-950">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            ) : null}
          </div>
          {shouldShowColumnControls ||
          shouldShowFilterControls ||
          shouldShowSearchControl ||
          shouldShowSortControls ? (
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {shouldShowSearchControl ? (
                <label
                  htmlFor={searchInputId}
                  className="relative w-full sm:w-64"
                >
                  <span className="sr-only">Search table</span>
                  <span className="pointer-events-none absolute left-3 top-1/2 text-slate-400 -translate-y-1/2">
                    <SearchIcon />
                  </span>
                  <input
                    id={searchInputId}
                    className="h-9 w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-primary-200 focus:border-primary-200 focus:ring-4 focus:ring-primary-200/20"
                    placeholder={searchPlaceholder}
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                  />
                  {hasActiveSearch ? (
                    <Button
                      aria-label="Clear table search"
                      className="absolute right-2 top-1/2 rounded-full p-1 text-slate-400 -translate-y-1/2 hover:text-red-600"
                      size="sm"
                      type="button"
                      variant="link"
                      onClick={clearSearch}
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </Button>
                  ) : null}
                </label>
              ) : null}

              {shouldShowFilterControls ? (
                <div ref={filterControlsRef} className="relative shrink-0">
                  <Button
                    aria-controls={filterControlsId}
                    aria-expanded={isFilterPanelOpen}
                    aria-pressed={hasActiveFilters}
                    className={cx(
                      tableControlButtonClassName,
                      (hasActiveFilters || isFilterPanelOpen) &&
                        "!border-primary-200 !bg-primary-200 !text-white hover:!bg-primary-300 hover:!text-white",
                    )}
                    size="sm"
                    type="button"
                    variant="link"
                    onClick={() => {
                      setIsColumnPanelOpen(false);
                      setIsFilterPanelOpen((currentValue) => !currentValue);
                    }}
                  >
                    <FilterIcon />
                    {hasActiveFilters
                      ? `Filters (${activeFilterCount})`
                      : "Filters"}
                  </Button>

                  {isFilterPanelOpen ? (
                    <div
                      id={filterControlsId}
                      className="absolute right-0 z-50 mt-2 max-h-[28rem] w-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/15"
                    >
                      <div className="space-y-4">
                        {filterableColumns.map(renderFilterControl)}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs text-slate-500">
                          {filteredRows.length} of {rows.length} shown
                        </span>
                        <Button
                          className="px-2 py-1 text-xs"
                          disabled={!hasActiveFilters}
                          size="sm"
                          type="button"
                          variant="link"
                          onClick={clearFilters}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {shouldShowSortControls ? (
                <Button
                  aria-pressed={isSortingEnabled}
                  className={cx(
                    tableControlButtonClassName,
                    isSortingEnabled &&
                      "!border-primary-200 !bg-primary-200 !text-white hover:!bg-primary-300 hover:!text-white",
                  )}
                  size="sm"
                  type="button"
                  variant="link"
                  onClick={toggleSorting}
                >
                  <SortIcon />
                  Sort
                </Button>
              ) : null}

              {shouldShowColumnControls ? (
                <div ref={columnControlsRef} className="relative shrink-0">
                  <Button
                    aria-controls={columnControlsId}
                    aria-expanded={isColumnPanelOpen}
                    className={tableControlButtonClassName}
                    size="sm"
                    type="button"
                    variant="link"
                    onClick={() => {
                      setIsFilterPanelOpen(false);
                      setIsColumnPanelOpen((currentValue) => !currentValue);
                    }}
                  >
                    <ColumnsIcon />
                    Columns
                  </Button>

                  {isColumnPanelOpen ? (
                    <div
                      id={columnControlsId}
                      className="absolute right-0 z-50 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/15"
                    >
                      <div className="space-y-1">
                        {hideableColumns.map((column) => {
                          const isColumnVisible = !hiddenColumnKeySet.has(
                            column.key,
                          );
                          const visibleHideableColumnCount =
                            hideableColumns.filter(
                              (hideableColumn) =>
                                !hiddenColumnKeySet.has(hideableColumn.key),
                            ).length;
                          const isLastVisibleColumn =
                            isColumnVisible && visibleHideableColumnCount <= 1;

                          return (
                            <label
                              key={column.key}
                              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <input
                                checked={isColumnVisible}
                                className="h-4 w-4 rounded border-slate-300 text-primary-200 accent-primary-200"
                                disabled={isLastVisibleColumn}
                                type="checkbox"
                                onChange={() =>
                                  toggleColumnVisibility(column.key)
                                }
                              />
                              <span className="min-w-0 flex-1 truncate">
                                {getColumnLabel(column)}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      <div className="mt-2 border-t border-slate-100 pt-2">
                        <Button
                          className="px-2 py-1 text-xs"
                          size="sm"
                          type="button"
                          variant="link"
                          onClick={() => setHiddenColumnKeys([])}
                        >
                          Reset columns
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {hasActiveFilters || hasActiveSearch ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Showing {filteredRows.length} of {rows.length}
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
                onClick={clearSearch}
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
                onClick={() => clearFilter(filter.key)}
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
            onClick={clearSearchAndFilters}
          >
            Clear all
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="px-5 py-8 text-sm text-slate-500">{loadingMessage}</p>
      ) : null}

      {!isLoading && errorMessage ? (
        <p
          role="alert"
          className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && !errorMessage && filteredRows.length === 0 ? (
        <p className="px-5 py-8 text-sm text-slate-500">
          {(hasActiveFilters || hasActiveSearch) && rows.length > 0
            ? "No records match the active search or filters."
            : emptyMessage}
        </p>
      ) : null}

      {shouldShowTable ? (
        <div className="overflow-x-auto rounded-b-xl">
          <table
            className={cx(
              minWidthClassName,
              "divide-y divide-slate-100 text-left text-sm",
            )}
          >
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>{visibleColumns.map(renderColumnHeader)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRows.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  className="align-top transition-colors hover:bg-slate-50/70"
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={cx("px-4 py-4", column.cellClassName)}
                    >
                      {column.render(row, renderContext)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
};

export default Table;
