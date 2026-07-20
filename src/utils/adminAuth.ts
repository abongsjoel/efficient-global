const adminSessionStorageKey = "efficient-global-admin-session";

type AdminLoginCredentials = {
  username: string;
  password: string;
};

type AdminLoginResult = {
  success: boolean;
  message?: string;
};

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
  if (!username.trim() || !password.trim()) {
    return {
      success: false,
      message: "Enter a username and password.",
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
