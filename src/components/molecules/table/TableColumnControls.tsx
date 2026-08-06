import type { RefObject } from "react";
import Button from "../../atoms/Button";
import { ColumnsIcon } from "../../icons";
import type { TableColumn } from "./tableTypes";
import { getColumnLabel, tableControlButtonClassName } from "./tableUtils";

type TableColumnControlsProps<Row> = {
  containerRef: RefObject<HTMLDivElement | null>;
  hiddenColumnKeySet: Set<string>;
  isOpen: boolean;
  onResetColumns: () => void;
  onToggle: () => void;
  onToggleColumnVisibility: (columnKey: string) => void;
  panelId: string;
  tableColumns: Array<TableColumn<Row>>;
};

const TableColumnControls = <Row,>({
  containerRef,
  hiddenColumnKeySet,
  isOpen,
  onResetColumns,
  onToggle,
  onToggleColumnVisibility,
  panelId,
  tableColumns,
}: TableColumnControlsProps<Row>) => (
  <div ref={containerRef} className="relative shrink-0">
    <Button
      aria-controls={panelId}
      aria-expanded={isOpen}
      className={tableControlButtonClassName}
      size="sm"
      type="button"
      variant="link"
      onClick={onToggle}
    >
      <ColumnsIcon />
      Columns
    </Button>

    {isOpen ? (
      <div
        id={panelId}
        className="absolute right-0 z-50 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/15"
      >
        <div className="space-y-1">
          {tableColumns.map((column) => {
            const isColumnVisible = !hiddenColumnKeySet.has(column.key);
            const visibleHideableColumnCount = tableColumns.filter(
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
                  onChange={() => onToggleColumnVisibility(column.key)}
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
            onClick={onResetColumns}
          >
            Reset columns
          </Button>
        </div>
      </div>
    ) : null}
  </div>
);

export default TableColumnControls;
