import StatusBadge from "../../atoms/StatusBadge";
import Table, { type TableColumn } from "../../molecules/Table";
import TruncatedHoverText from "../../molecules/TruncatedHoverText";
import {
  type AdminDeliveryRequest,
  useGetDeliveryRequestsQuery,
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

const deliveryRequestColumns: Array<TableColumn<AdminDeliveryRequest>> = [
  {
    key: "submitted",
    header: "Submitted",
    cellClassName: "whitespace-nowrap text-slate-600",
    render: (request) => formatDateTime(request.submittedAt),
  },
  {
    key: "requester",
    header: "Requester",
    render: (request) => (
      <>
        <p className="font-semibold text-slate-950">{request.name}</p>
        <p className="mt-1 text-xs text-slate-500">{request.email}</p>
        <p className="mt-1 text-xs text-slate-500">{request.phone}</p>
      </>
    ),
  },
  {
    key: "pickup",
    header: "Pickup",
    cellClassName: "max-w-[190px] break-words text-slate-700",
    render: (request) => <span title={request.pickup}>{request.pickup}</span>,
  },
  {
    key: "delivery",
    header: "Delivery",
    cellClassName: "max-w-[190px] break-words text-slate-700",
    render: (request) => (
      <span title={request.delivery}>{request.delivery}</span>
    ),
  },
  {
    key: "needed",
    header: "Needed",
    cellClassName: "whitespace-nowrap text-slate-700",
    render: (request) => formatDateTime(request.datetime),
  },
  {
    key: "type",
    header: "Type",
    cellClassName: "font-medium capitalize text-slate-700",
    render: (request) => request.vehicle,
  },
  {
    key: "rush",
    header: "Rush",
    cellClassName: "font-medium capitalize text-slate-700",
    render: (request) => request.rush,
  },
  {
    key: "instructions",
    header: "Instructions",
    cellClassName: "max-w-[220px] break-words text-slate-600",
    render: (request) => <TruncatedHoverText text={request.instructions} />,
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

const AdminDeliveryRequestsTable = () => {
  const {
    data: deliveryRequests = [],
    error,
    isLoading,
  } = useGetDeliveryRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <Table
      columnVisibilityStorageKey="efficient_global_delivery_requests_table_columns"
      columns={deliveryRequestColumns}
      emptyMessage="No delivery requests yet."
      errorMessage={getRtkQueryErrorMessage(
        error,
        "We could not load delivery requests right now.",
      )}
      getRowKey={(request) => request.id}
      isLoading={isLoading}
      loadingMessage="Loading delivery requests..."
      minWidthClassName="min-w-[1280px]"
      rows={deliveryRequests}
      subtitle={`${deliveryRequests.length} total`}
      title="Delivery Requests"
    />
  );
};

export default AdminDeliveryRequestsTable;
