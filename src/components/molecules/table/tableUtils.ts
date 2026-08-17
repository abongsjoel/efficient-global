import type {
  ActiveFilterSummary,
  FilterableTableColumn,
  TableColumn,
  TableDateRangeFilterValue,
  TableFilterOption,
  TableFilterState,
  TableFilterStateValue,
  TableSearchValue,
  TableSortValue,
} from "./tableTypes";

export const tableControlButtonClassName =
  "rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:border-primary-200 hover:bg-slate-50 hover:text-primary-200";

// The pinned body cells carry a tint just strong enough to lift them off the
// white rows, sitting between slate-50 and slate-100. It has to be opaque — a
// translucent tint would let scrolled columns show through. The header cell
// keeps the header row's own slate-50 instead.
export const stickyActionsCellClassName =
  "sticky right-0 bg-[#f9f9f9] px-4 py-4 text-right align-middle";

export const stickyActionsHeaderClassName =
  "sticky right-0 z-20 bg-slate-50 px-4 py-3 text-right font-semibold";

// Only drawn while columns are still hidden to the right of the pinned cell.
export const stickyActionsShadowClassName =
  "shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.35)]";

export const filterControlClassName =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-200/20";

export const sortValueCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export const getColumnLabel = <Row,>(column: TableColumn<Row>) => {
  if (column.label) {
    return column.label;
  }

  return typeof column.header === "string" ? column.header : column.key;
};

export const getStoredHiddenColumnKeys = (storageKey: string | undefined) => {
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

export const hasColumnFilter = <Row,>(
  column: TableColumn<Row>,
): column is FilterableTableColumn<Row> => Boolean(column.filter);

export const isColumnSortable = <Row,>(column: TableColumn<Row>) =>
  column.isSortable !== false && typeof column.sortValue === "function";

export const formatFilterOptionLabel = (value: string) =>
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

export const compareSortValues = (
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

export const getFilterStringValue = (value: TableSortValue) => {
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

export const getSearchStringValue = (value: TableSearchValue) =>
  (Array.isArray(value) ? value : [value])
    .map(getFilterStringValue)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const getDefaultSearchStringValue = <Row,>(
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

export const isDateRangeFilterValue = (
  value: TableFilterStateValue | undefined,
): value is TableDateRangeFilterValue =>
  Boolean(value) && typeof value === "object";

export const isFilterValueActive = (
  value: TableFilterStateValue | undefined,
) => {
  if (!value) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return Boolean(value.from || value.to);
};

export const getActiveFilterCount = (filters: TableFilterState) =>
  Object.values(filters).filter(isFilterValueActive).length;

export const doesRowMatchFilter = <Row,>(
  row: Row,
  column: FilterableTableColumn<Row>,
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

export const getSelectFilterOptionsByColumnKey = <Row,>(
  filterableColumns: Array<FilterableTableColumn<Row>>,
  rows: Row[],
) => {
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
};

export const getActiveFilterSummaries = <Row,>(
  filterableColumns: Array<FilterableTableColumn<Row>>,
  filters: TableFilterState,
  selectFilterOptionsByColumnKey: Map<string, TableFilterOption[]>,
) =>
  filterableColumns
    .map((column): ActiveFilterSummary | null => {
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
              ?.find((option) => option.value === trimmedFilterValue)?.label ??
            trimmedFilterValue;
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
    .filter((summary): summary is ActiveFilterSummary => Boolean(summary));
