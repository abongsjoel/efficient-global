import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppErrorBoundary from "./components/layout/AppErrorBoundary";
import AdminRoute from "./components/layout/AdminRoute";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/HomePage";
import Contact from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter basename="/logistics">
      <AppErrorBoundary>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<AdminRoute />} />
            <Route
              path="admin/requests"
              element={<AdminRoute view="deliveryRequests" />}
            />
            <Route
              path="admin/delivery-requests"
              element={<AdminRoute view="deliveryRequests" />}
            />
            <Route
              path="admin/information-requests"
              element={<AdminRoute view="informationRequests" />}
            />
            <Route
              path="admin/admins"
              element={<AdminRoute view="admins" />}
            />
            <Route
              path="admin/profile"
              element={<AdminRoute view="profile" />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
