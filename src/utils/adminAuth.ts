import { apiBaseUrl } from "./api";
import type { AdminLoginFieldErrors } from "./formValidation";

export type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export type AdminLoginCredentials = {
  identifier: string;
  keepMeLoggedIn?: boolean;
  password: string;
};

type AdminAuthResponse = {
  admin?: Admin;
  errors?: AdminLoginFieldErrors;
  message?: string;
};

export type AdminLoginResult =
  | {
      success: true;
      admin: Admin;
    }
  | {
      success: false;
      errors?: AdminLoginFieldErrors;
      message: string;
    };

const adminEndpoint = `${apiBaseUrl}/api/admin`;

const parseAdminResponse = async (response: Response) => {
  try {
    return (await response.json()) as AdminAuthResponse;
  } catch {
    return {};
  }
};

const getFallbackErrorMessage = (status: number) =>
  status === 401
    ? "Invalid email or password."
    : "We could not sign you in right now. Please try again.";

export const loginAdmin = async ({
  identifier,
  keepMeLoggedIn = false,
  password,
}: AdminLoginCredentials): Promise<AdminLoginResult> => {
  try {
    const response = await fetch(`${adminEndpoint}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ identifier, keepMeLoggedIn, password }),
    });
    const data = await parseAdminResponse(response);

    if (!response.ok || !data.admin) {
      return {
        success: false,
        errors: data.errors,
        message: data.message || getFallbackErrorMessage(response.status),
      };
    }

    return {
      success: true,
      admin: data.admin,
    };
  } catch {
    return {
      success: false,
      message: "We could not reach the server. Please try again in a moment.",
    };
  }
};

export const getCurrentAdmin = async () => {
  try {
    const response = await fetch(`${adminEndpoint}/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await parseAdminResponse(response);

    return data.admin || null;
  } catch {
    return null;
  }
};

export const logoutAdmin = async () => {
  try {
    await fetch(`${adminEndpoint}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // The local UI should still return to the login screen if logout fails.
  }
};
