import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentAdmin,
  logoutAdmin as requestAdminLogout,
  type Admin,
} from "../utils/adminAuth";
import { AdminAuthContext } from "./adminAuthContext";

type AdminAuthProviderProps = {
  children: ReactNode;
};

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const currentAdmin = await getCurrentAdmin();

      if (isMounted) {
        setAdmin(currentAdmin);
        setIsCheckingSession(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginAdminSession = useCallback((nextAdmin: Admin) => {
    setAdmin(nextAdmin);
  }, []);

  const logoutAdminSession = useCallback(async () => {
    await requestAdminLogout();
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isCheckingSession,
      loginAdminSession,
      logoutAdminSession,
    }),
    [admin, isCheckingSession, loginAdminSession, logoutAdminSession],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
