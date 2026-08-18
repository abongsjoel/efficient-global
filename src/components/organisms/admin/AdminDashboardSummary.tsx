import {
  useGetDeliveryRequestsQuery,
  useGetInformationRequestsQuery,
} from "../../../services/adminApi";
type AdminSummaryCard = {
  description: string;
  label: string;
  value: string;
  valueClassName?: string;
};

const loadingValue = "...";
const unavailableValue = "-";

const getCountValue = ({
  count,
  hasError,
  isLoading,
}: {
  count: number;
  hasError: boolean;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return loadingValue;
  }

  if (hasError) {
    return unavailableValue;
  }

  return count.toLocaleString();
};

const getCountDescription = ({
  description,
  hasError,
}: {
  description: string;
  hasError: boolean;
}) => (hasError ? "We could not load this count right now." : description);

const AdminDashboardSummary = () => {
  const {
    data: deliveryRequests = [],
    error: deliveryRequestsError,
    isLoading: isLoadingDeliveryRequests,
  } = useGetDeliveryRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const {
    data: informationRequests = [],
    error: informationRequestsError,
    isLoading: isLoadingInformationRequests,
  } = useGetInformationRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const hasDeliveryRequestsError = Boolean(deliveryRequestsError);
  const hasInformationRequestsError = Boolean(informationRequestsError);
  // A total built from one healthy response and one failed one would understate
  // the real figure, so the total is only shown when both requests succeed.
  const hasTotalError = hasDeliveryRequestsError || hasInformationRequestsError;
  const isLoadingTotal =
    isLoadingDeliveryRequests || isLoadingInformationRequests;

  const summaryCards: AdminSummaryCard[] = [
    {
      description: getCountDescription({
        description: "Delivery and information requests received in total.",
        hasError: hasTotalError,
      }),
      label: "Requests",
      value: getCountValue({
        count: deliveryRequests.length + informationRequests.length,
        hasError: hasTotalError,
        isLoading: isLoadingTotal,
      }),
    },
    {
      description: getCountDescription({
        description: "Deliveries requested through the site.",
        hasError: hasDeliveryRequestsError,
      }),
      label: "Delivery Requests",
      value: getCountValue({
        count: deliveryRequests.length,
        hasError: hasDeliveryRequestsError,
        isLoading: isLoadingDeliveryRequests,
      }),
    },
    {
      description: getCountDescription({
        description: "Enquiries submitted through the contact form.",
        hasError: hasInformationRequestsError,
      }),
      label: "Information Requests",
      value: getCountValue({
        count: informationRequests.length,
        hasError: hasInformationRequestsError,
        isLoading: isLoadingInformationRequests,
      }),
    },
  ];

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {summaryCards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-900/10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {card.label}
          </p>
          <p
            className={`mt-3 text-2xl font-bold text-slate-950 ${
              card.valueClassName || ""
            }`}
          >
            {card.value}
          </p>
          <p className="mt-2 text-sm text-slate-500">{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboardSummary;
