import type { Admin } from "../../../utils/adminAuth";
import { formatAdminRole } from "../../../utils/adminDisplay";

type AdminDashboardSummaryProps = {
  admin?: Admin;
};

type AdminSummaryCard = {
  description: string;
  label: string;
  value: string;
  valueClassName?: string;
};

const AdminDashboardSummary = ({ admin }: AdminDashboardSummaryProps) => {
  const summaryCards: AdminSummaryCard[] = [
    {
      description:
        "Request review tools can live here when submissions are stored.",
      label: "Requests",
      value: "0",
    },
    {
      description: "Access level for the current admin session.",
      label: "Role",
      value: formatAdminRole(admin?.role),
      valueClassName: "capitalize",
    },
    {
      description: "Account standing for dashboard access.",
      label: "Status",
      value: admin?.status || "Active",
      valueClassName: "capitalize",
    },
  ];

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {summaryCards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5"
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
