import { cx } from "../../atoms/formFieldStyles";
import { SortIcon } from "../../icons";
import type { SortDirection, TableColumn } from "./tableTypes";
import { getColumnLabel, isColumnSortable } from "./tableUtils";

type TableHeaderCellProps<Row> = {
  column: TableColumn<Row>;
  isSortingEnabled: boolean;
  onToggleSort: (columnKey: string) => void;
  sortDirection?: SortDirection;
};

const TableHeaderCell = <Row,>({
  column,
  isSortingEnabled,
  onToggleSort,
  sortDirection,
}: TableHeaderCellProps<Row>) => {
  const isSortable = isSortingEnabled && isColumnSortable(column);
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
          onClick={() => onToggleSort(column.key)}
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

export default TableHeaderCell;
