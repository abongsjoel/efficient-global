import { Link } from "react-router-dom";
import type { Admin } from "../utils/adminAuth";

type AdminProfilePageProps = {
  admin: Admin;
};

const formatRole = (role: string) => role.replace(/_/g, " ");

const formatStatus = (status: string) => roleStatusLabels[status] || status;

const roleStatusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
};

const AdminProfilePage = ({ admin }: AdminProfilePageProps) => (
  <section className="min-h-[calc(100vh-7rem)] snap-start bg-slate-50 px-6 py-16 text-slate-950 lg:px-10">
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
            Admin
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Profile
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Manage your Efficient Global administrator account details.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin"
            className="rounded-full border border-primary-200 bg-white px-6 py-3 font-semibold text-primary-200 transition hover:bg-primary-100 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-950 text-2xl font-bold uppercase text-white ring-4 ring-primary-200/20">
            {admin.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{admin.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{admin.email}</p>
          </div>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Role
            </dt>
            <dd className="mt-2 font-semibold capitalize text-slate-800">
              {formatRole(admin.role)}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Status
            </dt>
            <dd className="mt-2 font-semibold text-slate-800">
              {formatStatus(admin.status)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
);

export default AdminProfilePage;
