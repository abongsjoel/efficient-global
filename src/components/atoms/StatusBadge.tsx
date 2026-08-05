import { cx } from "./formFieldStyles";

type StatusBadgeProps = {
  status: string;
};

const statusBadgeStyles = {
  danger: "border-red-200 bg-red-50 text-red-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
};

const getStatusBadgeTone = (status: string) => {
  switch (status) {
    case "sent":
    case "new":
      return "success";
    case "failed":
      return "danger";
    case "pending":
      return "warning";
    default:
      return "neutral";
  }
};

const formatStatusLabel = (status: string) =>
  (status || "unknown").replace(/_/g, " ");

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const tone = getStatusBadgeTone(status);

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        statusBadgeStyles[tone],
      )}
    >
      {formatStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
