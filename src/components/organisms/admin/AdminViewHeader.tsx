import type { Admin } from "../../../utils/adminAuth";
import { formatAdminRole } from "../../../utils/adminDisplay";
import type { AdminPageContent } from "./adminPageConfig";

type AdminViewHeaderProps = {
  admin?: Admin;
  content: AdminPageContent;
  showSessionSummary?: boolean;
};

const AdminViewHeader = ({
  admin,
  content,
  showSessionSummary = false,
}: AdminViewHeaderProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
    <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
          Admin
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          {content.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600">
          {content.description}
        </p>
        {admin && showSessionSummary ? (
          <p className="mt-3 text-sm text-slate-500">
            Signed in as {admin.name} ({formatAdminRole(admin.role)}).
          </p>
        ) : null}
      </div>
    </div>
  </div>
);

export default AdminViewHeader;
