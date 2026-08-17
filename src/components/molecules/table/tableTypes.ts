import type { ReactNode } from "react";

export type TableSortValue =
  | boolean
  | Date
  | null
  | number
  | string
  | undefined;

export type SortDirection = "asc" | "desc";

export type SortState = {
  columnKey: string;
  direction: SortDirection;
} | null;

export type TableFilterType = "dateRange" | "select" | "text";

export type TableFilterOption = {
  label: string;
  value: string;
};

export type TableDateRangeFilterValue = {
  from?: string;
  to?: string;
};

export type TableFilterStateValue = string | TableDateRangeFilterValue;

export type TableFilterState = Record<
  string,
  TableFilterStateValue | undefined
>;

export type TableSearchValue = TableSortValue | TableSortValue[];

export type TableRenderContext = {
  highlightSearchText: (value: TableSortValue) => ReactNode;
  searchQuery: string;
};

export type TableFilterConfig<Row> = {
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

export type FilterableTableColumn<Row> = TableColumn<Row> & {
  filter: TableFilterConfig<Row>;
};

/**
 * A trailing column pinned to the right edge of the scroll area. It is not part
 * of `columns`, so it is never sortable, filterable, or hideable.
 */
export type TableActionsColumn<Row> = {
  cellClassName?: string;
  header?: ReactNode;
  headerClassName?: string;
  render: (row: Row, context: TableRenderContext) => ReactNode;
};

export type ActiveFilterSummary = {
  key: string;
  label: string;
  valueLabel: string;
};
