import AdminLoginPage from "../../pages/AdminLoginPage";
import AdminPage from "../../pages/AdminPage";
import { useAdminAuth } from "../../contexts/useAdminAuth";

const AdminRoute = () => {
  const {
    admin,
    isCheckingSession,
    loginAdminSession,
    logoutAdminSession,
  } = useAdminAuth();

  if (isCheckingSession) {
    return (
      <section className="min-h-[calc(100vh-7rem)] snap-start bg-slate-50 px-6 py-16 text-slate-950 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-xl shadow-slate-900/5">
            Checking admin session...
          </div>
        </div>
      </section>
    );
  }

  if (!admin) {
    return <AdminLoginPage onLogin={loginAdminSession} />;
  }

  return <AdminPage admin={admin} onLogout={logoutAdminSession} />;
};

export default AdminRoute;
