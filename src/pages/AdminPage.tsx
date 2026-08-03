import { useState, type ComponentType, type SVGProps } from "react";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import {
  ChevronLeftIcon,
  ClipboardListIcon,
  DashboardIcon,
  MailIcon,
  ProfileIcon,
  UsersIcon,
} from "../components/icons";
import type { Admin } from "../utils/adminAuth";

type AdminPageProps = {
  admin?: Admin;
  view?: AdminPageView;
};

type AdminPageView =
  | "dashboard"
  | "deliveryRequests"
  | "informationRequests"
  | "admins";

type AdminPanelItem = {
  description?: string;
  href?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  id: AdminPageView | "profile";
  label: string;
};

const formatRole = (role = "") => role.replace(/_/g, " ");

const adminPanelItems: AdminPanelItem[] = [
  {
    description: "Dashboard home",
    href: "/admin",
    icon: DashboardIcon,
    id: "dashboard",
    label: "Overview",
  },
  {
    description: "Delivery submissions",
    href: "/admin/delivery-requests",
    icon: ClipboardListIcon,
    id: "deliveryRequests",
    label: "Delivery Requests",
  },
  {
    description: "Information inquiries",
    href: "/admin/information-requests",
    icon: MailIcon,
    id: "informationRequests",
    label: "Information Requests",
  },
  {
    description: "Access management",
    href: "/admin/admins",
    icon: UsersIcon,
    id: "admins",
    label: "Admins",
  },
  {
    description: "Account settings",
    href: "/admin/profile",
    icon: ProfileIcon,
    id: "profile",
    label: "Profile",
  },
];

const pageContent: Record<
  AdminPageView,
  {
    description: string;
    title: string;
  }
> = {
  admins: {
    description: "Admin management tools will live here.",
    title: "Admins",
  },
  dashboard: {
    description: "This area is reserved for Efficient Global administrators.",
    title: "Dashboard",
  },
  deliveryRequests: {
    description: "Delivery request submissions will live here.",
    title: "Delivery Requests",
  },
  informationRequests: {
    description: "Request information submissions will live here.",
    title: "Information Requests",
  },
};

const AdminPage = ({ admin, view = "dashboard" }: AdminPageProps) => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const currentPage = pageContent[view];

  return (
    <section
      className={`min-h-[calc(100vh-7rem)] snap-start bg-slate-50 px-6 py-10 text-slate-950 transition-[padding] duration-300 lg:pr-10 ${
        isPanelCollapsed ? "lg:pl-28" : "lg:pl-80"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          <aside
            className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 transition-all duration-300 lg:fixed lg:bottom-0 lg:left-0 lg:top-28 lg:z-40 lg:flex lg:h-[calc(100vh-7rem)] lg:flex-col lg:overflow-y-auto lg:rounded-none lg:border-y-0 lg:border-l-0 lg:shadow-none ${
              isPanelCollapsed ? "lg:w-20" : "lg:w-72"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div
                className={`min-w-0 transition-opacity ${
                  isPanelCollapsed ? "lg:sr-only" : ""
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
                  Admin
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-950">
                  Workspace
                </p>
              </div>

              <Button
                aria-controls="admin-dashboard-panel"
                aria-expanded={!isPanelCollapsed}
                aria-label={
                  isPanelCollapsed
                    ? "Expand admin navigation"
                    : "Collapse admin navigation"
                }
                className={`h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-white p-0 text-slate-600 hover:border-primary-200 hover:bg-slate-50 hover:text-primary-200 ${
                  isPanelCollapsed ? "lg:rotate-180" : ""
                }`}
                size="sm"
                type="button"
                variant="link"
                onClick={() =>
                  setIsPanelCollapsed((currentValue) => !currentValue)
                }
              >
                <ChevronLeftIcon />
              </Button>
            </div>

            <nav
              id="admin-dashboard-panel"
              aria-label="Admin dashboard"
              className="mt-6 space-y-1 lg:flex-1"
            >
              {adminPanelItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === view;
                const itemContent = (
                  <>
                    <Icon />
                    <span
                      className={`min-w-0 transition-opacity ${
                        isPanelCollapsed ? "lg:sr-only" : ""
                      }`}
                    >
                      <span className="block truncate">{item.label}</span>
                      {item.description ? (
                        <span
                          className={`mt-0.5 block truncate text-xs font-normal ${
                            isActive ? "text-white/80" : "text-slate-400"
                          }`}
                        >
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </>
                );
                const itemLayoutClassName = isPanelCollapsed
                  ? "w-full gap-3 px-3 py-2 lg:mx-auto lg:h-12 lg:w-12 lg:justify-center lg:gap-0 lg:px-0 lg:py-0"
                  : "w-full gap-3 px-3 py-2";
                const itemClassName = `flex min-h-12 items-center rounded-xl text-left text-sm font-semibold transition ${itemLayoutClassName} ${
                  isActive
                    ? "bg-primary-200 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary-200"
                }`;

                return (
                  <Link
                    key={item.label}
                    to={item.href || "/admin"}
                    className={itemClassName}
                    title={isPanelCollapsed ? item.label : undefined}
                  >
                    {itemContent}
                  </Link>
                );
              })}
            </nav>

            {admin ? (
              <div
                className={`mt-6 border-t border-slate-100 pt-4 transition-opacity ${
                  isPanelCollapsed ? "lg:sr-only" : ""
                }`}
              >
                <p className="truncate text-sm font-semibold text-slate-950">
                  {admin.name}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {admin.email}
                </p>
              </div>
            ) : null}
          </aside>

          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
                    Admin
                  </p>
                  <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                    {currentPage.title}
                  </h1>
                  <p className="mt-5 text-base leading-7 text-slate-600">
                    {currentPage.description}
                  </p>
                  {admin && view === "dashboard" ? (
                    <p className="mt-3 text-sm text-slate-500">
                      Signed in as {admin.name} ({formatRole(admin.role)}).
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {view === "dashboard" ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Requests
                  </p>
                  <p className="mt-3 text-2xl font-bold text-slate-950">0</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Request review tools can live here when submissions are stored.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Role
                  </p>
                  <p className="mt-3 text-2xl font-bold capitalize text-slate-950">
                    {formatRole(admin?.role)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Access level for the current admin session.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Status
                  </p>
                  <p className="mt-3 text-2xl font-bold capitalize text-slate-950">
                    {admin?.status || "Active"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Account standing for dashboard access.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
