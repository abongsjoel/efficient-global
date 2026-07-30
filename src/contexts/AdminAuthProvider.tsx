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
  removeAdminProfileImage as requestAdminProfileImageRemoval,
  type Admin,
  updateAdminProfile as requestAdminProfileUpdate,
  updateAdminProfileImage as requestAdminProfileImageUpdate,
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

  const updateAdminProfileSession = useCallback(
    async (profile: { name: string }) => {
      const result = await requestAdminProfileUpdate(profile);

      if (result.success) {
        setAdmin(result.admin);
      }

      return result;
    },
    [],
  );

  const updateAdminProfileImageSession = useCallback(
    async (profileImage: string) => {
      const result = await requestAdminProfileImageUpdate(profileImage);

      if (result.success) {
        setAdmin(result.admin);
      }

      return result;
    },
    [],
  );

  const removeAdminProfileImageSession = useCallback(async () => {
    const result = await requestAdminProfileImageRemoval();

    if (result.success) {
      setAdmin(result.admin);
    }

    return result;
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isCheckingSession,
      loginAdminSession,
      logoutAdminSession,
      removeAdminProfileImageSession,
      updateAdminProfileSession,
      updateAdminProfileImageSession,
    }),
    [
      admin,
      isCheckingSession,
      loginAdminSession,
      logoutAdminSession,
      removeAdminProfileImageSession,
      updateAdminProfileSession,
      updateAdminProfileImageSession,
    ],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
