import { Link } from "react-router-dom";
import Button from "../../atoms/Button";
import { cx } from "../../atoms/formFieldStyles";
import { ChevronLeftIcon } from "../../icons";
import type { Admin } from "../../../utils/adminAuth";
import { formatAdminRole } from "../../../utils/adminDisplay";
import {
  adminPanelItems,
  type AdminPageView,
} from "./adminPageConfig";

type AdminSidebarProps = {
  admin?: Admin;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  view: AdminPageView;
};

const AdminSidebar = ({
  admin,
  isCollapsed,
  onToggleCollapsed,
  view,
}: AdminSidebarProps) => (
  <aside
    className={cx(
      "rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 transition-all duration-300 lg:fixed lg:bottom-0 lg:left-0 lg:top-28 lg:z-40 lg:flex lg:h-[calc(100vh-7rem)] lg:flex-col lg:overflow-y-auto lg:rounded-none lg:border-y-0 lg:border-l-0 lg:shadow-none",
      isCollapsed ? "lg:w-20" : "lg:w-72",
    )}
  >
    <div className="flex items-center justify-between gap-3">
      <div
        className={cx(
          "min-w-0 transition-opacity",
          isCollapsed && "lg:sr-only",
        )}
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
        aria-expanded={!isCollapsed}
        aria-label={
          isCollapsed ? "Expand admin navigation" : "Collapse admin navigation"
        }
        className={cx(
          "h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-white p-0 text-slate-600 hover:border-primary-200 hover:bg-slate-50 hover:text-primary-200",
          isCollapsed && "lg:rotate-180",
        )}
        size="sm"
        type="button"
        variant="link"
        onClick={onToggleCollapsed}
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
        const itemLayoutClassName = isCollapsed
          ? "w-full gap-3 px-3 py-2 lg:mx-auto lg:h-12 lg:w-12 lg:justify-center lg:gap-0 lg:px-0 lg:py-0"
          : "w-full gap-3 px-3 py-2";

        return (
          <Link
            key={item.id}
            to={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cx(
              "flex min-h-12 items-center rounded-xl text-left text-sm font-semibold transition",
              itemLayoutClassName,
              isActive
                ? "bg-primary-200 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-primary-200",
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon />
            <span
              className={cx(
                "min-w-0 transition-opacity",
                isCollapsed && "lg:sr-only",
              )}
            >
              <span className="block truncate">{item.label}</span>
              {item.description ? (
                <span
                  className={cx(
                    "mt-0.5 block truncate text-xs font-normal",
                    isActive ? "text-white/80" : "text-slate-400",
                  )}
                >
                  {item.description}
                </span>
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>

    {admin ? (
      <div
        className={cx(
          "mt-6 border-t border-slate-100 pt-4 transition-opacity",
          isCollapsed && "lg:sr-only",
        )}
      >
        <p className="truncate text-sm font-semibold text-slate-950">
          {admin.name}{" "}
          <span className="text-xs font-medium capitalize text-slate-500">
            ({formatAdminRole(admin.role)})
          </span>
        </p>
        <p className="mt-1 truncate text-xs text-slate-500">{admin.email}</p>
      </div>
    ) : null}
  </aside>
);

export default AdminSidebar;
