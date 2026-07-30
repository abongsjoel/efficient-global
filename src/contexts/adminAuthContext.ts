import { createContext } from "react";
import type {
  Admin,
  AdminPasswordUpdateResult,
  AdminProfileImageResult,
  AdminProfileUpdateResult,
} from "../utils/adminAuth";

export type AdminAuthContextValue = {
  admin: Admin | null;
  isCheckingSession: boolean;
  loginAdminSession: (admin: Admin) => void;
  logoutAdminSession: () => Promise<void>;
  removeAdminProfileImageSession: () => Promise<AdminProfileImageResult>;
  updateAdminPasswordSession: (passwords: {
    confirmPassword: string;
    currentPassword: string;
    newPassword: string;
  }) => Promise<AdminPasswordUpdateResult>;
  updateAdminProfileSession: (profile: {
    name: string;
  }) => Promise<AdminProfileUpdateResult>;
  updateAdminProfileImageSession: (
    profileImage: string,
  ) => Promise<AdminProfileImageResult>;
};

export const AdminAuthContext = createContext<
  AdminAuthContextValue | undefined
>(undefined);
