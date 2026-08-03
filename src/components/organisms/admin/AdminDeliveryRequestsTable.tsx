import { useEffect, useState } from "react";
import { cx } from "../../atoms/formFieldStyles";
import {
  getAdminDeliveryRequests,
  type AdminDeliveryRequest,
} from "../../../utils/adminAuth";

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

const formatStatusLabel = (status: string) =>
  (status || "unknown").replace(/_/g, " ");

const getStatusBadgeClassName = (status: string) => {
  switch (status) {
    case "sent":
    case "new":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "failed":
      return "border-red-200 bg-red-50 text-red-700";
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={cx(
      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
      getStatusBadgeClassName(status),
    )}
  >
    {formatStatusLabel(status)}
  </span>
);

const AdminDeliveryRequestsTable = () => {
  const [deliveryRequests, setDeliveryRequests] = useState<
    AdminDeliveryRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDeliveryRequests = async () => {
      const result = await getAdminDeliveryRequests();

      if (!isMounted) {
        return;
      }

      if (!result.success) {
        setErrorMessage(result.message);
        setIsLoading(false);
        return;
      }

      setDeliveryRequests(result.deliveryRequests);
      setErrorMessage("");
      setIsLoading(false);
    };

    loadDeliveryRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5">
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Delivery Requests
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {deliveryRequests.length} total
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="px-5 py-8 text-sm text-slate-500">
          Loading delivery requests...
        </p>
      ) : null}

      {!isLoading && errorMessage ? (
        <p
          role="alert"
          className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && !errorMessage && deliveryRequests.length === 0 ? (
        <p className="px-5 py-8 text-sm text-slate-500">
          No delivery requests yet.
        </p>
      ) : null}

      {!isLoading && !errorMessage && deliveryRequests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-[1280px] divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold">Requester</th>
                <th className="px-4 py-3 font-semibold">Pickup</th>
                <th className="px-4 py-3 font-semibold">Delivery</th>
                <th className="px-4 py-3 font-semibold">Needed</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Rush</th>
                <th className="px-4 py-3 font-semibold">Instructions</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveryRequests.map((request) => (
                <tr
                  key={request.id}
                  className="align-top transition-colors hover:bg-slate-50/70"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {formatDateTime(request.submittedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-950">
                      {request.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {request.email}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {request.phone}
                    </p>
                  </td>
                  <td className="max-w-[190px] break-words px-4 py-4 text-slate-700">
                    <span title={request.pickup}>
                      {request.pickup}
                    </span>
                  </td>
                  <td className="max-w-[190px] break-words px-4 py-4 text-slate-700">
                    <span title={request.delivery}>
                      {request.delivery}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                    {formatDateTime(request.datetime)}
                  </td>
                  <td className="px-4 py-4 font-medium capitalize text-slate-700">
                    {request.vehicle}
                  </td>
                  <td className="px-4 py-4 font-medium capitalize text-slate-700">
                    {request.rush}
                  </td>
                  <td className="max-w-[220px] break-words px-4 py-4 text-slate-600">
                    <span title={request.instructions}>
                      {request.instructions || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={request.emailNotification.status} />
                    {request.emailNotification.errorMessage ? (
                      <p className="mt-2 max-w-[220px] text-xs text-red-600">
                        {request.emailNotification.errorMessage}
                      </p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
};

export default AdminDeliveryRequestsTable;
