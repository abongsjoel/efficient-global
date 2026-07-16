import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppErrorBoundary from "./components/layout/AppErrorBoundary";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/HomePage";
import Contact from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter basename="/logistics">
      <AppErrorBoundary>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
