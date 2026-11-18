import { useCallback, useMemo, useState } from "react";
import Button from "../../atoms/Button";
import StatusBadge from "../../atoms/StatusBadge";
import { PlusIcon } from "../../icons";
import ConfirmDialog from "../../molecules/ConfirmDialog";
import CopyButton from "../../molecules/CopyButton";
import Table, { type TableColumn } from "../../molecules/Table";
import TableDateTimeCell from "../../molecules/table/TableDateTimeCell";
import Toast, { type ToastVariant } from "../../molecules/Toast";
import Tooltip from "../../molecules/Tooltip";
import AddAdminModal, { type AddAdminSubmitResult } from "./AddAdminModal";
import AdminRowActions from "./AdminRowActions";
import {
  adminRoles,
  adminStatuses,
  canManageAdminStatus,
  canManageAnyAdminStatus,
} from "../../../constants/admin";
import { useAdminAuth } from "../../../contexts/useAdminAuth";
import {
  type AdminListItem,
  useCreateAdminMutation,
  useGetAdminsQuery,
  useUpdateAdminStatusMutation,
} from "../../../services/adminApi";
import {
  formatAdminRole,
  formatDateTime,
  formatShortId,
} from "../../../utils/adminDisplay";
import type {
  AddAdminFieldErrors,
  AddAdminFields,
} from "../../../utils/formValidation";
import { getRtkQueryErrorMessage } from "../../../utils/rtkQueryErrors";

const getTimestamp = (value: string) => {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
};

const getAdminColumns = (
  currentAdminId?: string,
): Array<TableColumn<AdminListItem>> => [
  {
    key: "id",
    header: "Admin ID",
    cellClassName: "whitespace-nowrap font-mono text-xs text-slate-600",
    isHiddenByDefault: true,
    filter: {
      placeholder: "Search admin ID",
      type: "text",
      value: (admin) => admin.id,
    },
    render: (admin, { highlightSearchText }) => (
      <div className="flex items-center gap-1.5">
        <Tooltip label={admin.id}>
          {highlightSearchText(formatShortId(admin.id))}
        </Tooltip>
        <CopyButton label="Copy admin ID" value={admin.id} />
      </div>
    ),
    sortValue: (admin) => admin.id,
  },
  {
    key: "admin",
    header: "Admin",
    isHideable: false,
    filter: {
      placeholder: "Search name or email",
      type: "text",
      value: (admin) => `${admin.name} ${admin.email}`,
    },
    render: (admin, { highlightSearchText }) => (
      <>
        <p className="font-semibold text-slate-950">
          {highlightSearchText(admin.name)}
          {admin.id === currentAdminId ? (
            <span className="ml-1.5 font-medium text-slate-500">(You)</span>
          ) : null}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {highlightSearchText(admin.email)}
        </p>
      </>
    ),
    sortValue: (admin) => `${admin.name} ${admin.email}`,
  },
  {
    key: "role",
    header: "Role",
    cellClassName: "whitespace-nowrap font-medium capitalize text-slate-700",
    filter: {
      type: "select",
      value: (admin) => formatAdminRole(admin.role),
    },
    render: (admin, { highlightSearchText }) =>
      highlightSearchText(formatAdminRole(admin.role)),
    sortValue: (admin) => admin.role,
  },
  {
    key: "status",
    header: "Status",
    filter: {
      type: "select",
      value: (admin) => admin.status,
    },
    render: (admin, { searchQuery }) => (
      <StatusBadge highlightQuery={searchQuery} status={admin.status} />
    ),
    sortValue: (admin) => admin.status,
  },
  {
    key: "created",
    header: "Created",
    cellClassName: "whitespace-nowrap text-slate-600",
    filter: {
      type: "dateRange",
      value: (admin) => admin.createdAt,
    },
    render: (admin, { highlightSearchText }) => (
      <TableDateTimeCell
        highlightSearchText={highlightSearchText}
        value={admin.createdAt}
      />
    ),
    sortValue: (admin) => getTimestamp(admin.createdAt),
  },
  {
    key: "updated",
    header: "Last Updated",
    cellClassName: "whitespace-nowrap text-slate-600",
    isHiddenByDefault: true,
    filter: {
      type: "dateRange",
      value: (admin) => admin.updatedAt,
    },
    render: (admin, { highlightSearchText }) => (
      <TableDateTimeCell
        highlightSearchText={highlightSearchText}
        value={admin.updatedAt}
      />
    ),
    sortValue: (admin) => getTimestamp(admin.updatedAt),
  },
];

// The backend returns field-level validation errors as `{ errors: {...} }`.
const getFieldErrors = (data: unknown): AddAdminFieldErrors | undefined => {
  if (data && typeof data === "object" && "errors" in data) {
    const errors = data.errors;

    return errors && typeof errors === "object"
      ? (errors as AddAdminFieldErrors)
      : undefined;
  }

  return undefined;
};

const AdminTable = () => {
  const { admin: currentAdmin } = useAdminAuth();
  const { data: admins = [], error, isLoading } = useGetAdminsQuery();
  const currentAdminId = currentAdmin?.id;
  const adminColumns = useMemo(
    () => getAdminColumns(currentAdminId),
    [currentAdminId],
  );
  const [createAdmin] = useCreateAdminMutation();
  const [updateAdminStatus] = useUpdateAdminStatusMutation();
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: ToastVariant;
  } | null>(null);
  const [updatingAdminIds, setUpdatingAdminIds] = useState<string[]>([]);
  // The admin whose status change is waiting for confirmation.
  const [statusChangeAdmin, setStatusChangeAdmin] =
    useState<AdminListItem | null>(null);
  const isDeactivating = statusChangeAdmin?.status === adminStatuses.ACTIVE;
  // Mirrors the backend, which only lets super admins add admins, and lets
  // managers activate or deactivate dispatchers and viewers.
  const canAddAdmins = currentAdmin?.role === adminRoles.SUPER_ADMIN;
  const canManageStatuses = canManageAnyAdminStatus(currentAdmin?.role);
  // Stable, so the toast's auto-dismiss timer isn't restarted by re-renders.
  const dismissToast = useCallback(() => setToast(null), []);
  const closeStatusChangeDialog = useCallback(
    () => setStatusChangeAdmin(null),
    [],
  );

  const handleAddAdmin = async (
    fields: AddAdminFields,
  ): Promise<AddAdminSubmitResult> => {
    const result = await createAdmin(fields);

    if (result.error) {
      return {
        success: false,
        errors:
          "status" in result.error
            ? getFieldErrors(result.error.data)
            : undefined,
        message: getRtkQueryErrorMessage(
          result.error,
          "We could not add this admin right now.",
        ),
      };
    }

    setIsAddAdminOpen(false);
    setToast({
      message: `${fields.name} was added as an admin.`,
      variant: "success",
    });

    return { success: true };
  };

  const getStatusDisabledReason = (admin: AdminListItem) => {
    if (admin.id === currentAdmin?.id) {
      return "You can't change your own status";
    }

    if (!canManageAdminStatus(currentAdmin?.role, admin.role)) {
      return `You can't change a ${formatAdminRole(admin.role)}'s status`;
    }

    return undefined;
  };

  const handleToggleAdminStatus = async (admin: AdminListItem) => {
    const nextStatus =
      admin.status === adminStatuses.ACTIVE
        ? adminStatuses.INACTIVE
        : adminStatuses.ACTIVE;

    setUpdatingAdminIds((currentIds) => [...currentIds, admin.id]);
    const result = await updateAdminStatus({
      id: admin.id,
      status: nextStatus,
    });
    setUpdatingAdminIds((currentIds) =>
      currentIds.filter((id) => id !== admin.id),
    );

    if (result.error) {
      setToast({
        message: getRtkQueryErrorMessage(
          result.error,
          `We could not update ${admin.name}'s status right now.`,
        ),
        variant: "error",
      });
      return;
    }

    setToast({
      message:
        nextStatus === adminStatuses.ACTIVE
          ? `${admin.name} was activated.`
          : `${admin.name} was deactivated and signed out.`,
      variant: "success",
    });
  };

  // The dialog stays open, showing progress, until the request settles. The
  // toast then reports the outcome.
  const handleConfirmStatusChange = async () => {
    if (!statusChangeAdmin) {
      return;
    }

    await handleToggleAdminStatus(statusChangeAdmin);
    setStatusChangeAdmin(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {canAddAdmins ? (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="inverse"
            onClick={() => setIsAddAdminOpen(true)}
          >
            <PlusIcon />
            Add admin
          </Button>
        </div>
      ) : null}

      <Table
        actionsColumn={
          canManageStatuses
            ? {
                header: "Actions",
                render: (admin) => (
                  <AdminRowActions
                    disabledReason={getStatusDisabledReason(admin)}
                    isUpdating={updatingAdminIds.includes(admin.id)}
                    name={admin.name}
                    status={admin.status}
                    onToggleStatus={() => setStatusChangeAdmin(admin)}
                  />
                ),
              }
            : undefined
        }
        columnVisibilityStorageKey="efficient_global_admins_table_columns_v1"
        columns={adminColumns}
        emptyMessage="No admins found."
        errorMessage={getRtkQueryErrorMessage(
          error,
          "We could not load admins right now.",
        )}
        getRowKey={(admin) => admin.id}
        isLoading={isLoading}
        isRowMuted={(admin) => admin.status === adminStatuses.INACTIVE}
        loadingMessage="Loading admins..."
        minWidthClassName="min-w-[720px]"
        rows={admins}
        searchPlaceholder="Search admins..."
        searchValue={(admin) => [
          admin.id,
          admin.name,
          admin.email,
          formatAdminRole(admin.role),
          admin.status,
          formatDateTime(admin.createdAt),
          formatDateTime(admin.updatedAt),
        ]}
        subtitle={`${admins.length} total`}
        title="Admins"
      />

      {isAddAdminOpen ? (
        <AddAdminModal
          onClose={() => setIsAddAdminOpen(false)}
          onSubmit={handleAddAdmin}
        />
      ) : null}

      {statusChangeAdmin ? (
        <ConfirmDialog
          confirmLabel={isDeactivating ? "Deactivate" : "Activate"}
          confirmingLabel={isDeactivating ? "Deactivating..." : "Activating..."}
          isConfirming={updatingAdminIds.includes(statusChangeAdmin.id)}
          title={`${isDeactivating ? "Deactivate" : "Activate"} ${
            statusChangeAdmin.name
          }?`}
          tone={isDeactivating ? "danger" : "primary"}
          onCancel={closeStatusChangeDialog}
          onConfirm={handleConfirmStatusChange}
        >
          {isDeactivating ? (
            <p>
              This signs out{" "}
              <span className="font-semibold text-slate-950">
                {statusChangeAdmin.email}
              </span>{" "}
              right away. They can't log in again until their account is
              reactivated.
            </p>
          ) : (
            <p>
              <span className="font-semibold text-slate-950">
                {statusChangeAdmin.email}
              </span>{" "}
              will be able to log in to the admin dashboard again.
            </p>
          )}
        </ConfirmDialog>
      ) : null}

      {toast ? (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={dismissToast}
        />
      ) : null}
    </div>
  );
};

export default AdminTable;
