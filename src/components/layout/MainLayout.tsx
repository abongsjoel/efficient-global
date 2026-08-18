import { Outlet, useLocation } from "react-router-dom";
import { AdminAuthProvider } from "../../contexts/AdminAuthProvider";
import Header from "../molecules/Header";
import Footer from "../organisms/Footer";

const MainLayout = () => {
  const { pathname } = useLocation();
  // Admin screens are internal tooling, so they skip the marketing footer.
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <section className="h-screen overflow-hidden">
      <AdminAuthProvider>
        <Header />
        <main className="snap-y snap-mandatory h-[calc(100vh-7rem)] overflow-y-scroll scroll-smooth">
          <Outlet />
          {isAdminRoute ? null : (
            <div className="snap-start">
              <Footer />
            </div>
          )}
        </main>
      </AdminAuthProvider>
    </section>
  );
};

export default MainLayout;
