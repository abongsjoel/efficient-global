const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const apiBaseUrl = (
  configuredApiBaseUrl || "http://127.0.0.1:5050"
).replace(/\/$/, "");
