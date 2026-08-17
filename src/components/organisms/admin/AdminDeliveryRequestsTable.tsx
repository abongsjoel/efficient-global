import { useState } from "react";
import StatusBadge from "../../atoms/StatusBadge";
import CopyButton from "../../molecules/CopyButton";
import RequestDetailsModal, {
  type RequestDetailsField,
} from "../../molecules/RequestDetailsModal";
import Table, { type TableColumn } from "../../molecules/Table";
import TableDateTimeCell from "../../molecules/table/TableDateTimeCell";
import Tooltip from "../../molecules/Tooltip";
import TruncatedHoverText from "../../molecules/TruncatedHoverText";
import AdminRequestRowActions from "./AdminRequestRowActions";
import {
  type AdminDeliveryRequest,
  useGetDeliveryRequestsQuery,
} from "../../../services/adminApi";
import { formatDateTime, formatShortId } from "../../../utils/adminDisplay";
import { getRtkQueryErrorMessage } from "../../../utils/rtkQueryErrors";

const getTimestamp = (value: string) => {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
};

const deliveryRequestColumns: Array<TableColumn<AdminDeliveryRequest>> = [
  {
    key: "id",
    header: "Request ID",
    cellClassName: "whitespace-nowrap font-mono text-xs text-slate-600",
    isHideable: false,
    filter: {
      placeholder: "Search request ID",
      type: "text",
      value: (request) => request.id,
    },
    render: (request, { highlightSearchText }) => (
      <div className="flex items-center gap-1.5">
        <CopyButton label="Copy request ID" value={request.id} />
        <Tooltip label={request.id}>
          {highlightSearchText(formatShortId(request.id))}
        </Tooltip>
      </div>
    ),
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
    render: (request, { highlightSearchText }) => (
      <TableDateTimeCell
        highlightSearchText={highlightSearchText}
        value={request.submittedAt}
      />
    ),
    sortValue: (request) => getTimestamp(request.submittedAt),
  },
  {
    key: "requester",
    header: "Requester",
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
    key: "pickup",
    header: "Pickup",
    cellClassName: "max-w-[190px] break-words text-slate-700",
    filter: {
      placeholder: "Search pickup",
      type: "text",
      value: (request) => request.pickup,
    },
    render: (request, { highlightSearchText }) => (
      <span title={request.pickup}>{highlightSearchText(request.pickup)}</span>
    ),
    sortValue: (request) => request.pickup,
  },
  {
    key: "delivery",
    header: "Delivery",
    cellClassName: "max-w-[190px] break-words text-slate-700",
    filter: {
      placeholder: "Search delivery",
      type: "text",
      value: (request) => request.delivery,
    },
    render: (request, { highlightSearchText }) => (
      <span title={request.delivery}>
        {highlightSearchText(request.delivery)}
      </span>
    ),
    sortValue: (request) => request.delivery,
  },
  {
    key: "needed",
    header: "Needed",
    cellClassName: "whitespace-nowrap text-slate-700",
    filter: {
      type: "dateRange",
      value: (request) => request.datetime,
    },
    render: (request, { highlightSearchText }) => (
      <TableDateTimeCell
        highlightSearchText={highlightSearchText}
        value={request.datetime}
      />
    ),
    sortValue: (request) => getTimestamp(request.datetime),
  },
  {
    key: "type",
    header: "Type",
    cellClassName: "font-medium capitalize text-slate-700",
    filter: {
      type: "select",
      value: (request) => request.vehicle,
    },
    render: (request, { highlightSearchText }) =>
      highlightSearchText(request.vehicle),
    sortValue: (request) => request.vehicle,
  },
  {
    key: "rush",
    header: "Rush",
    cellClassName: "font-medium capitalize text-slate-700",
    filter: {
      type: "select",
      value: (request) => request.rush,
    },
    render: (request, { highlightSearchText }) =>
      highlightSearchText(request.rush),
    sortValue: (request) => request.rush,
  },
  {
    key: "instructions",
    header: "Instructions",
    cellClassName: "max-w-[220px] break-words text-slate-600",
    filter: {
      placeholder: "Search instructions",
      type: "text",
      value: (request) => request.instructions,
    },
    render: (request, { searchQuery }) => (
      <TruncatedHoverText
        highlightQuery={searchQuery}
        text={request.instructions}
      />
    ),
    sortValue: (request) => request.instructions,
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

const getDeliveryRequestDetailsFields = (
  request: AdminDeliveryRequest,
): RequestDetailsField[] => [
  { label: "Request ID", value: request.id },
  { label: "Submitted", value: formatDateTime(request.submittedAt) },
  { label: "Needed by", value: formatDateTime(request.datetime) },
  { label: "Requester", value: request.name },
  { label: "Organization contact", value: request.email },
  { label: "Phone", value: request.phone },
  { label: "Request type", value: request.vehicle },
  { label: "Rush", value: request.rush },
  { label: "Source", value: request.source },
  { isWide: true, label: "Pickup", value: request.pickup },
  { isWide: true, label: "Delivery", value: request.delivery },
  { isWide: true, label: "Instructions", value: request.instructions },
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

const AdminDeliveryRequestsTable = () => {
  const {
    data: deliveryRequests = [],
    error,
    isLoading,
  } = useGetDeliveryRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [selectedRequest, setSelectedRequest] =
    useState<AdminDeliveryRequest | null>(null);

  return (
    <>
      <Table
        actionsColumn={{
          header: "Actions",
          render: (request) => (
            <AdminRequestRowActions
              email={request.email}
              emailSubject={`Re: your delivery request (${formatDateTime(
                request.submittedAt,
              )})`}
              name={request.name}
              onView={() => setSelectedRequest(request)}
            />
          ),
        }}
        columnVisibilityStorageKey="efficient_global_delivery_requests_table_columns_v2"
        columns={deliveryRequestColumns}
        emptyMessage="No delivery requests yet."
        errorMessage={getRtkQueryErrorMessage(
          error,
          "We could not load delivery requests right now.",
        )}
        getRowKey={(request) => request.id}
        isLoading={isLoading}
        loadingMessage="Loading delivery requests..."
        minWidthClassName="min-w-[1360px]"
        rows={deliveryRequests}
        searchPlaceholder="Search delivery requests..."
        searchValue={(request) => [
          request.id,
          formatDateTime(request.submittedAt),
          request.source,
          request.pickup,
          request.delivery,
          formatDateTime(request.datetime),
          request.vehicle,
          request.name,
          request.email,
          request.phone,
          request.rush,
          request.instructions,
          request.status,
          request.emailNotification.status,
          request.emailNotification.errorMessage,
        ]}
        subtitle={`${deliveryRequests.length} total`}
        title="Delivery Requests"
      />

      <RequestDetailsModal
        email={selectedRequest?.email}
        emailSubject={
          selectedRequest
            ? `Re: your delivery request (${formatDateTime(
                selectedRequest.submittedAt,
              )})`
            : undefined
        }
        fields={
          selectedRequest
            ? getDeliveryRequestDetailsFields(selectedRequest)
            : []
        }
        isOpen={Boolean(selectedRequest)}
        subtitle={
          selectedRequest
            ? `Submitted ${formatDateTime(selectedRequest.submittedAt)}`
            : undefined
        }
        title={`Delivery request from ${selectedRequest?.name ?? ""}`.trim()}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
};

export default AdminDeliveryRequestsTable;
