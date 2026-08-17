import {
  formatDateTime,
  formatDateTimeParts,
} from "../../../utils/adminDisplay";
import type { TableRenderContext } from "./tableTypes";

type TableDateTimeCellProps = {
  highlightSearchText: TableRenderContext["highlightSearchText"];
  value: string;
};

const TableDateTimeCell = ({
  highlightSearchText,
  value,
}: TableDateTimeCellProps) => {
  const parts = formatDateTimeParts(value);

  if (!parts) {
    return <>{highlightSearchText(formatDateTime(value))}</>;
  }

  return (
    <>
      <span className="block">{highlightSearchText(parts.date)}</span>
      <span className="mt-0.5 block text-xs text-slate-500">
        @ {highlightSearchText(parts.time)}
      </span>
    </>
  );
};

export default TableDateTimeCell;
