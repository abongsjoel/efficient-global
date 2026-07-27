const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const apiBaseUrl = (
  configuredApiBaseUrl || "http://localhost:5050"
).replace(/\/$/, "");
