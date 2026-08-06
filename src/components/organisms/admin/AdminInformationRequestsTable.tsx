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

const getTimestamp = (value: string) => {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
};

const informationRequestColumns: Array<TableColumn<AdminInformationRequest>> = [
  {
    key: "submitted",
    header: "Submitted",
    cellClassName: "whitespace-nowrap text-slate-600",
    filter: {
      type: "dateRange",
      value: (request) => request.submittedAt,
    },
    render: (request) => formatDateTime(request.submittedAt),
    sortValue: (request) => getTimestamp(request.submittedAt),
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
    filter: {
      placeholder: "Search name, email, or phone",
      type: "text",
      value: (request) => `${request.name} ${request.email} ${request.phone}`,
    },
    sortValue: (request) => `${request.name} ${request.email} ${request.phone}`,
  },
  {
    key: "organization",
    header: "Organization",
    cellClassName: "max-w-[190px] break-words text-slate-700",
    filter: {
      placeholder: "Search organization",
      type: "text",
      value: (request) => request.organization,
    },
    render: (request) => (
      <span title={request.organization}>{request.organization || "-"}</span>
    ),
    sortValue: (request) => request.organization,
  },
  {
    key: "message",
    header: "Message",
    cellClassName: "max-w-[360px] break-words text-slate-700",
    filter: {
      placeholder: "Search message",
      type: "text",
      value: (request) => request.message,
    },
    render: (request) => <TruncatedHoverText text={request.message} />,
    sortValue: (request) => request.message,
  },
  {
    key: "source",
    header: "Source",
    cellClassName: "font-medium text-slate-700",
    filter: {
      type: "select",
      value: (request) => request.source,
    },
    render: (request) => request.source,
    sortValue: (request) => request.source,
  },
  {
    key: "status",
    header: "Status",
    filter: {
      type: "select",
      value: (request) => request.status,
    },
    render: (request) => <StatusBadge status={request.status} />,
    sortValue: (request) => request.status,
  },
  {
    key: "email",
    header: "Email",
    filter: {
      label: "Email status",
      type: "select",
      value: (request) => request.emailNotification.status,
    },
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
    sortValue: (request) => request.emailNotification.status,
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
      searchPlaceholder="Search information requests..."
      searchValue={(request) => [
        request.submittedAt,
        request.source,
        request.name,
        request.email,
        request.phone,
        request.organization,
        request.message,
        request.status,
        request.emailNotification.status,
        request.emailNotification.errorMessage,
      ]}
      subtitle={`${informationRequests.length} total`}
      title="Information Requests"
    />
  );
};

export default AdminInformationRequestsTable;
