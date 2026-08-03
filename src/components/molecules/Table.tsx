import type { ReactNode } from "react";
import { cx } from "../atoms/formFieldStyles";

export type TableColumn<Row> = {
  cellClassName?: string;
  header: ReactNode;
  headerClassName?: string;
  key: string;
  render: (row: Row) => ReactNode;
};

type TableProps<Row> = {
  className?: string;
  columns: Array<TableColumn<Row>>;
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

const Table = <Row,>({
  className,
  columns,
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
  const hasHeader = Boolean(title || subtitle);
  const shouldShowTable = !isLoading && !errorMessage && rows.length > 0;

  return (
    <section
      className={cx(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5",
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
        <div className="overflow-x-auto">
          <table
            className={cx(
              minWidthClassName,
              "divide-y divide-slate-100 text-left text-sm",
            )}
          >
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                {columns.map((column) => (
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
                  {columns.map((column) => (
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
