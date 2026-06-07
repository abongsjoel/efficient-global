import { Outlet } from "react-router-dom";
import Header from "../molecules/Header";
import Footer from "../organisms/Footer";

const MainLayout = () => (
  <section className="h-screen overflow-hidden">
    <Header />
    <main className="snap-y snap-mandatory h-[calc(100vh-7rem)] overflow-y-scroll scroll-smooth">
      <Outlet />
      <div className="snap-start">
        <Footer />
      </div>
    </main>
  </section>
);

export default MainLayout;
