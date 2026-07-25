import type { Admin } from "../utils/adminAuth";

type AdminPageProps = {
  admin?: Admin;
};

const AdminPage = ({ admin }: AdminPageProps) => (
  <section className="min-h-[calc(100vh-7rem)] snap-start bg-slate-50 px-6 py-16 text-slate-950 lg:px-10">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
            Admin
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Admin
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            This area is reserved for Efficient Global administrators.
          </p>
          {admin ? (
            <p className="mt-3 text-sm text-slate-500">
              Signed in as {admin.name} ({admin.role.replace(/_/g, " ")}).
            </p>
          ) : null}
        </div>
      </div>
    </div>
  </section>
);

export default AdminPage;
