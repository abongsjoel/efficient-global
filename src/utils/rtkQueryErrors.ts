import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const getRtkQueryErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
  fallbackMessage: string,
) => {
  if (!error) {
    return "";
  }

  if ("status" in error) {
    const data = error.data;

    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;

      return typeof message === "string" ? message : fallbackMessage;
    }

    return fallbackMessage;
  }

  return error.message || fallbackMessage;
};
