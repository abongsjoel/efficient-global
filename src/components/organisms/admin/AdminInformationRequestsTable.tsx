import { useState } from "react";
import StatusBadge from "../../atoms/StatusBadge";
import RequestDetailsModal, {
  type RequestDetailsField,
} from "../../molecules/RequestDetailsModal";
import Table, { type TableColumn } from "../../molecules/Table";
import TruncatedHoverText from "../../molecules/TruncatedHoverText";
import AdminRequestRowActions from "./AdminRequestRowActions";
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
    key: "id",
    header: "Request ID",
    cellClassName: "whitespace-nowrap font-mono text-xs text-slate-600",
    filter: {
      placeholder: "Search request ID",
      type: "text",
      value: (request) => request.id,
    },
    render: (request, { highlightSearchText }) =>
      highlightSearchText(request.id),
    sortValue: (request) => request.id,
  },
  {
    key: "submitted",
    header: "Submitted",
    cellClassName: "whitespace-nowrap text-slate-600",
    filter: {
      type: "dateRange",
      value: (request) => request.submittedAt,
    },
    render: (request, { highlightSearchText }) =>
      highlightSearchText(formatDateTime(request.submittedAt)),
    sortValue: (request) => getTimestamp(request.submittedAt),
  },
  {
    key: "contact",
    header: "Contact",
    render: (request, { highlightSearchText }) => (
      <>
        <p className="font-semibold text-slate-950">
          {highlightSearchText(request.name)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {highlightSearchText(request.email)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {highlightSearchText(request.phone)}
        </p>
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
    render: (request, { highlightSearchText }) => (
      <span title={request.organization}>
        {highlightSearchText(request.organization || "-")}
      </span>
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
    render: (request, { searchQuery }) => (
      <TruncatedHoverText highlightQuery={searchQuery} text={request.message} />
    ),
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
    render: (request, { highlightSearchText }) =>
      highlightSearchText(request.source),
    sortValue: (request) => request.source,
  },
  {
    key: "status",
    header: "Status",
    isHiddenByDefault: true,
    filter: {
      type: "select",
      value: (request) => request.status,
    },
    render: (request, { searchQuery }) => (
      <StatusBadge highlightQuery={searchQuery} status={request.status} />
    ),
    sortValue: (request) => request.status,
  },
  {
    key: "email",
    header: "Email",
    isHiddenByDefault: true,
    filter: {
      label: "Email status",
      type: "select",
      value: (request) => request.emailNotification.status,
    },
    render: (request, { highlightSearchText, searchQuery }) => {
      const errorMessage = request.emailNotification.errorMessage;

      return (
        <>
          <StatusBadge
            highlightQuery={searchQuery}
            status={request.emailNotification.status}
          />
          {errorMessage ? (
            <p className="mt-2 max-w-[220px] text-xs text-red-600">
              {highlightSearchText(errorMessage)}
            </p>
          ) : null}
        </>
      );
    },
    sortValue: (request) => request.emailNotification.status,
  },
];

const getInformationRequestDetailsFields = (
  request: AdminInformationRequest,
): RequestDetailsField[] => [
  { label: "Request ID", value: request.id },
  { label: "Submitted", value: formatDateTime(request.submittedAt) },
  { label: "Source", value: request.source },
  { label: "Contact", value: request.name },
  { label: "Email", value: request.email },
  { label: "Phone", value: request.phone },
  { label: "Organization", value: request.organization },
  { isWide: true, label: "Message", value: request.message },
  {
    label: "Status",
    value: <StatusBadge status={request.status} />,
  },
  {
    label: "Email notification",
    value: (
      <>
        <StatusBadge status={request.emailNotification.status} />
        {request.emailNotification.errorMessage ? (
          <p className="mt-2 text-xs text-red-600">
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
  const [selectedRequest, setSelectedRequest] =
    useState<AdminInformationRequest | null>(null);

  return (
    <>
      <Table
        actionsColumn={{
          header: "Actions",
          render: (request) => (
            <AdminRequestRowActions
              email={request.email}
              emailSubject="Re: your inquiry to Efficient Global"
              name={request.name}
              onView={() => setSelectedRequest(request)}
            />
          ),
        }}
        columnVisibilityStorageKey="efficient_global_information_requests_table_columns_v2"
        columns={informationRequestColumns}
        emptyMessage="No information requests yet."
        errorMessage={getRtkQueryErrorMessage(
          error,
          "We could not load information requests right now.",
        )}
        getRowKey={(request) => request.id}
        isLoading={isLoading}
        loadingMessage="Loading information requests..."
        minWidthClassName="min-w-[1280px]"
        rows={informationRequests}
        searchPlaceholder="Search information requests..."
        searchValue={(request) => [
          request.id,
          formatDateTime(request.submittedAt),
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

      <RequestDetailsModal
        email={selectedRequest?.email}
        emailSubject="Re: your inquiry to Efficient Global"
        fields={
          selectedRequest
            ? getInformationRequestDetailsFields(selectedRequest)
            : []
        }
        isOpen={Boolean(selectedRequest)}
        subtitle={
          selectedRequest
            ? `Submitted ${formatDateTime(selectedRequest.submittedAt)}`
            : undefined
        }
        title={`Information request from ${selectedRequest?.name ?? ""}`.trim()}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
};

export default AdminInformationRequestsTable;
