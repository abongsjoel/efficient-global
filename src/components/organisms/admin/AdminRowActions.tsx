import Button from "../../atoms/Button";
import { EditIcon, TrashIcon } from "../../icons";
import ActionMenu, { type ActionMenuItem } from "../../molecules/ActionMenu";
import Tooltip from "../../molecules/Tooltip";
import AdminStatusToggleButton from "./AdminStatusToggleButton";

// Delete is a placeholder until deleting admins is built, so choosing it only
// closes the menu. Give it an `onSelect` once it exists.
const getMoreActionItems = (onEdit: () => void): ActionMenuItem[] => [
  {
    icon: <EditIcon className="h-3.5 w-3.5" />,
    label: "Edit",
    onSelect: onEdit,
  },
  {
    icon: <TrashIcon className="h-3.5 w-3.5" />,
    label: "Delete",
    tone: "danger",
  },
];

type AdminRowActionsProps = {
  /** Shows the "more actions" menu. Only super admins get it. */
  canUseMoreActions: boolean;
  /** Disables the status button and is shown as its tooltip. */
  disabledReason?: string;
  isUpdating: boolean;
  name: string;
  onEdit: () => void;
  /** Left out when the viewer can't change statuses, which hides the button. */
  onToggleStatus?: () => void;
  onView: () => void;
  status: string;
};

const AdminRowActions = ({
  canUseMoreActions,
  disabledReason,
  isUpdating,
  name,
  onEdit,
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

    {/* Pulled into the row's gap so the borderless dots sit as close to the
        status button as the bordered buttons sit to each other. */}
    {canUseMoreActions ? (
      <ActionMenu
        className="-ml-1"
        items={getMoreActionItems(onEdit)}
        label={`More actions for ${name}`}
      />
    ) : null}
  </div>
);

export default AdminRowActions;
