import { createContext } from "react";
import type { Admin, AdminProfileImageResult } from "../utils/adminAuth";

export type AdminAuthContextValue = {
  admin: Admin | null;
  isCheckingSession: boolean;
  loginAdminSession: (admin: Admin) => void;
  logoutAdminSession: () => Promise<void>;
  removeAdminProfileImageSession: () => Promise<AdminProfileImageResult>;
  updateAdminProfileImageSession: (
    profileImage: string,
  ) => Promise<AdminProfileImageResult>;
};

export const AdminAuthContext = createContext<
  AdminAuthContextValue | undefined
>(undefined);
