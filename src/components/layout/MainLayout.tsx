import { Outlet } from "react-router-dom";
import Header from "../molecules/Header";
import Footer from "../organisms/Footer";

const MainLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
