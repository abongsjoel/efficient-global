import { cx } from "../../atoms/formFieldStyles";
import Tooltip from "../../molecules/Tooltip";
import { UserCheckIcon, UserXIcon } from "../../icons";
import { adminStatuses } from "../../../constants/admin";

type AdminRowActionsProps = {
  /** Disables the button and is shown as its tooltip. */
  disabledReason?: string;
  isUpdating: boolean;
  name: string;
  onToggleStatus: () => void;
  status: string;
};

const statusButtonClassName =
  "inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition-colors focus:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50";

const AdminRowActions = ({
  disabledReason,
  isUpdating,
  name,
  onToggleStatus,
  status,
}: AdminRowActionsProps) => {
  const isActive = status === adminStatuses.ACTIVE;
  const isDisabled = Boolean(disabledReason) || isUpdating;
  const actionLabel = isActive ? "Deactivate" : "Activate";
  const tooltipLabel = disabledReason
    ? disabledReason
    : isUpdating
      ? "Updating..."
      : actionLabel;
  const StatusIcon = isActive ? UserXIcon : UserCheckIcon;

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* The disabled button ignores the pointer, so the tooltip wrapper still
          gets hover and can explain why. */}
      <Tooltip
        className={isDisabled ? "cursor-not-allowed" : undefined}
        label={tooltipLabel}
      >
        <button
          aria-label={`${isActive ? "Deactivate" : "Activate"} ${name}`}
          className={cx(
            statusButtonClassName,
            isActive
              ? "hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-200/60"
              : "hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 focus-visible:ring-emerald-200/60",
          )}
          disabled={isDisabled}
          type="button"
          onClick={onToggleStatus}
        >
          <StatusIcon className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
    </div>
  );
};

export default AdminRowActions;
