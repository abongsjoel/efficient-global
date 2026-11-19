import { cx } from "../../atoms/formFieldStyles";
import Tooltip from "../../molecules/Tooltip";
import { UserCheckIcon, UserXIcon } from "../../icons";
import { adminStatuses } from "../../../constants/admin";

type AdminStatusToggleButtonProps = {
  /** Disables the button and is shown as its tooltip. */
  disabledReason?: string;
  isUpdating: boolean;
  name: string;
  onToggle: () => void;
  status: string;
};

const statusButtonClassName =
  "inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition-colors focus:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50";

// Used in the admin table rows and the admin details modal.
const AdminStatusToggleButton = ({
  disabledReason,
  isUpdating,
  name,
  onToggle,
  status,
}: AdminStatusToggleButtonProps) => {
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
    // The disabled button ignores the pointer, so the tooltip wrapper still
    // gets hover and can explain why.
    <Tooltip
      className={isDisabled ? "cursor-not-allowed" : undefined}
      label={tooltipLabel}
    >
      <button
        aria-label={`${actionLabel} ${name}`}
        className={cx(
          statusButtonClassName,
          isActive
            ? "hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-200/60"
            : "hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 focus-visible:ring-emerald-200/60",
        )}
        disabled={isDisabled}
        type="button"
        onClick={onToggle}
      >
        <StatusIcon className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
  );
};

export default AdminStatusToggleButton;
