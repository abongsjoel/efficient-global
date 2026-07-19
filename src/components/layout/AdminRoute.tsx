import { useState } from "react";
import AdminLoginPage from "../../pages/AdminLoginPage";
import AdminPage from "../../pages/AdminPage";
import { isAdminAuthenticated, logoutAdmin } from "../../utils/adminAuth";

const AdminRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminAuthenticated);

  if (!isLoggedIn) {
    return <AdminLoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleLogout = () => {
    logoutAdmin();
    setIsLoggedIn(false);
  };

  return <AdminPage onLogout={handleLogout} />;
};

export default AdminRoute;
