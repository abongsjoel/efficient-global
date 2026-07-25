import { createContext } from "react";
import type { Admin } from "../utils/adminAuth";

export type AdminAuthContextValue = {
  admin: Admin | null;
  isCheckingSession: boolean;
  loginAdminSession: (admin: Admin) => void;
  logoutAdminSession: () => Promise<void>;
};

export const AdminAuthContext = createContext<
  AdminAuthContextValue | undefined
>(undefined);
