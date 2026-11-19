import Button from "../../atoms/Button";
import Tooltip from "../../molecules/Tooltip";
import AdminStatusToggleButton from "./AdminStatusToggleButton";

type AdminRowActionsProps = {
  /** Disables the status button and is shown as its tooltip. */
  disabledReason?: string;
  isUpdating: boolean;
  name: string;
  /** Left out when the viewer can't change statuses, which hides the button. */
  onToggleStatus?: () => void;
  onView: () => void;
  status: string;
};

const AdminRowActions = ({
  disabledReason,
  isUpdating,
  name,
  onToggleStatus,
  onView,
  status,
}: AdminRowActionsProps) => (
  <div className="flex items-center justify-end gap-1.5">
    <Tooltip label="View admin details">
      <Button
        aria-label={`View details for ${name}`}
        className="rounded-full border border-slate-200 px-2.5 py-1.5 hover:border-primary-200"
        size="sm"
        variant="link"
        onClick={onView}
      >
        View
      </Button>
    </Tooltip>

    {onToggleStatus ? (
      <AdminStatusToggleButton
        disabledReason={disabledReason}
        isUpdating={isUpdating}
        name={name}
        status={status}
        onToggle={onToggleStatus}
      />
    ) : null}
  </div>
);

export default AdminRowActions;
