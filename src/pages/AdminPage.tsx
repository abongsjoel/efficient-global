import { useState } from "react";
import { cx } from "../components/atoms/formFieldStyles";
import AdminDashboardSummary from "../components/organisms/admin/AdminDashboardSummary";
import AdminDeliveryRequestsTable from "../components/organisms/admin/AdminDeliveryRequestsTable";
import AdminInformationRequestsTable from "../components/organisms/admin/AdminInformationRequestsTable";
import AdminSidebar from "../components/organisms/admin/AdminSidebar";
import AdminTable from "../components/organisms/admin/AdminTable";
import AdminViewHeader from "../components/organisms/admin/AdminViewHeader";
import {
  adminPageContent,
  type AdminPageView,
} from "../components/organisms/admin/adminPageConfig";
import type { Admin } from "../utils/adminAuth";

type AdminPageProps = {
  admin?: Admin;
  view?: AdminPageView;
};

const AdminPage = ({ admin, view = "dashboard" }: AdminPageProps) => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const currentPage = view === "dashboard" ? adminPageContent[view] : null;

  return (
    <section
      className={cx(
        "min-h-[calc(100vh-7rem)] snap-start bg-slate-50 px-6 py-10 text-slate-950 transition-[padding] duration-300 lg:pr-10",
        isPanelCollapsed ? "lg:pl-28" : "lg:pl-80",
      )}
    >
      <div className="flex flex-col gap-6">
        <AdminSidebar
          admin={admin}
          isCollapsed={isPanelCollapsed}
          view={view}
          onToggleCollapsed={() =>
            setIsPanelCollapsed((currentValue) => !currentValue)
          }
        />

        <main className="min-w-0 flex-1">
          {currentPage ? <AdminViewHeader content={currentPage} /> : null}

          {view === "dashboard" ? <AdminDashboardSummary /> : null}

          {view === "deliveryRequests" ? (
            <AdminDeliveryRequestsTable />
          ) : null}

          {view === "informationRequests" ? (
            <AdminInformationRequestsTable />
          ) : null}

          {view === "admins" ? <AdminTable /> : null}
        </main>
      </div>
    </section>
  );
};

export default AdminPage;
