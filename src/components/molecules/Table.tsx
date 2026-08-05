import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Button from "../atoms/Button";
import { cx } from "../atoms/formFieldStyles";
import { ColumnsIcon } from "../icons";

export type TableColumn<Row> = {
  cellClassName?: string;
  header: ReactNode;
  headerClassName?: string;
  isHideable?: boolean;
  key: string;
  label?: string;
  render: (row: Row) => ReactNode;
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
      ? parsedValue.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
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
  subtitle,
  title,
}: TableProps<Row>) => {
  const columnControlsId = useId();
  const columnControlsRef = useRef<HTMLDivElement>(null);
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>(() =>
    getStoredHiddenColumnKeys(columnVisibilityStorageKey),
  );
  const [isColumnPanelOpen, setIsColumnPanelOpen] = useState(false);
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
  const hasHeader = Boolean(title || subtitle);
  const shouldShowTable = !isLoading && !errorMessage && rows.length > 0;
  const shouldShowColumnControls = hideableColumns.length > 1;

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
    if (!isColumnPanelOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !columnControlsRef.current?.contains(event.target)
      ) {
        setIsColumnPanelOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsColumnPanelOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isColumnPanelOpen]);

  const toggleColumnVisibility = (columnKey: string) => {
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
          {shouldShowColumnControls ? (
            <div ref={columnControlsRef} className="relative shrink-0">
              <Button
                aria-controls={columnControlsId}
                aria-expanded={isColumnPanelOpen}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:border-primary-200 hover:bg-slate-50 hover:text-primary-200"
                size="sm"
                type="button"
                variant="link"
                onClick={() =>
                  setIsColumnPanelOpen((currentValue) => !currentValue)
                }
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
                      const visibleHideableColumnCount = hideableColumns.filter(
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
                            onChange={() => toggleColumnVisibility(column.key)}
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

      {!isLoading && !errorMessage && rows.length === 0 ? (
        <p className="px-5 py-8 text-sm text-slate-500">{emptyMessage}</p>
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
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className={cx(
                      "px-4 py-3 font-semibold",
                      column.headerClassName,
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  className="align-top transition-colors hover:bg-slate-50/70"
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={cx("px-4 py-4", column.cellClassName)}
                    >
                      {column.render(row)}
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
