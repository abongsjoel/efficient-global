import StatusBadge from "../../atoms/StatusBadge";
import Table, { type TableColumn } from "../../molecules/Table";
import TruncatedHoverText from "../../molecules/TruncatedHoverText";
import {
  type AdminInformationRequest,
  useGetInformationRequestsQuery,
} from "../../../services/adminApi";
import { getRtkQueryErrorMessage } from "../../../utils/rtkQueryErrors";

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDateTime = (value: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : dateTimeFormatter.format(date);
};

const informationRequestColumns: Array<TableColumn<AdminInformationRequest>> = [
  {
    key: "submitted",
    header: "Submitted",
    cellClassName: "whitespace-nowrap text-slate-600",
    render: (request) => formatDateTime(request.submittedAt),
  },
  {
    key: "contact",
    header: "Contact",
    render: (request) => (
      <>
        <p className="font-semibold text-slate-950">{request.name}</p>
        <p className="mt-1 text-xs text-slate-500">{request.email}</p>
        <p className="mt-1 text-xs text-slate-500">{request.phone}</p>
      </>
    ),
  },
  {
    key: "organization",
    header: "Organization",
    cellClassName: "max-w-[190px] break-words text-slate-700",
    render: (request) => (
      <span title={request.organization}>{request.organization || "-"}</span>
    ),
  },
  {
    key: "message",
    header: "Message",
    cellClassName: "max-w-[360px] break-words text-slate-700",
    render: (request) => <TruncatedHoverText text={request.message} />,
  },
  {
    key: "source",
    header: "Source",
    cellClassName: "font-medium text-slate-700",
    render: (request) => request.source,
  },
  {
    key: "status",
    header: "Status",
    render: (request) => <StatusBadge status={request.status} />,
  },
  {
    key: "email",
    header: "Email",
    render: (request) => (
      <>
        <StatusBadge status={request.emailNotification.status} />
        {request.emailNotification.errorMessage ? (
          <p className="mt-2 max-w-[220px] text-xs text-red-600">
            {request.emailNotification.errorMessage}
          </p>
        ) : null}
      </>
    ),
  },
];

const AdminInformationRequestsTable = () => {
  const {
    data: informationRequests = [],
    error,
    isLoading,
  } = useGetInformationRequestsQuery();

  return (
    <Table
      columnVisibilityStorageKey="efficient_global_information_requests_table_columns"
      columns={informationRequestColumns}
      emptyMessage="No information requests yet."
      errorMessage={getRtkQueryErrorMessage(
        error,
        "We could not load information requests right now.",
      )}
      getRowKey={(request) => request.id}
      isLoading={isLoading}
      loadingMessage="Loading information requests..."
      minWidthClassName="min-w-[1080px]"
      rows={informationRequests}
      subtitle={`${informationRequests.length} total`}
      title="Information Requests"
    />
  );
};

export default AdminInformationRequestsTable;
