const adminSessionStorageKey = "efficient-global-admin-session";

const configuredAdminUsername =
  import.meta.env.VITE_ADMIN_USERNAME?.trim() || "admin";
const configuredAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "";

type AdminLoginCredentials = {
  username: string;
  password: string;
};

type AdminLoginResult = {
  success: boolean;
  message?: string;
};

export const isAdminLoginConfigured = () =>
  Boolean(configuredAdminPassword.trim());

export const isAdminAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(adminSessionStorageKey) === "true";
};

export const loginAdmin = ({
  username,
  password,
}: AdminLoginCredentials): AdminLoginResult => {
  if (!isAdminLoginConfigured()) {
    return {
      success: false,
      message:
        "Admin login is not configured. Add admin credentials to the frontend environment.",
    };
  }

  const isValidLogin =
    username.trim() === configuredAdminUsername &&
    password === configuredAdminPassword;

  if (!isValidLogin) {
    return {
      success: false,
      message: "Enter a valid admin username and password.",
    };
  }

  window.localStorage.setItem(adminSessionStorageKey, "true");
  return { success: true };
};

export const logoutAdmin = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(adminSessionStorageKey);
};
