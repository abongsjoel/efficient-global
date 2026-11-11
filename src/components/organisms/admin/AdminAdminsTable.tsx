import StatusBadge from "../../atoms/StatusBadge";
import CopyButton from "../../molecules/CopyButton";
import Table, { type TableColumn } from "../../molecules/Table";
import TableDateTimeCell from "../../molecules/table/TableDateTimeCell";
import Tooltip from "../../molecules/Tooltip";
import {
  type AdminListItem,
  useGetAdminsQuery,
} from "../../../services/adminApi";
import {
  formatAdminRole,
  formatDateTime,
  formatShortId,
} from "../../../utils/adminDisplay";
import { getRtkQueryErrorMessage } from "../../../utils/rtkQueryErrors";

const getTimestamp = (value: string) => {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
};

const adminColumns: Array<TableColumn<AdminListItem>> = [
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

const AdminAdminsTable = () => {
  const { data: admins = [], error, isLoading } = useGetAdminsQuery();

  return (
    <Table
      columnVisibilityStorageKey="efficient_global_admins_table_columns_v1"
      columns={adminColumns}
      emptyMessage="No admins found."
      errorMessage={getRtkQueryErrorMessage(
        error,
        "We could not load admins right now.",
      )}
      getRowKey={(admin) => admin.id}
      isLoading={isLoading}
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
  );
};

export default AdminAdminsTable;
