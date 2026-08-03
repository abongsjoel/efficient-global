import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { apiBaseUrl } from "../utils/api";
import {
  clearAdminSessionToken,
  getStoredAdminSessionToken,
} from "../utils/adminSessionToken";

export type AdminInformationRequest = {
  id: string;
  source: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  message: string;
  status: string;
  emailNotification: {
    status: string;
    resendEmailId?: string;
    errorMessage?: string;
    updatedAt?: string;
  };
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
};

type AdminInformationRequestsResponse = {
  informationRequests?: AdminInformationRequest[];
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${apiBaseUrl}/api/admin`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getStoredAdminSessionToken();

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const adminBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    clearAdminSessionToken();
  }

  return result;
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: adminBaseQuery,
  tagTypes: ["InformationRequests"],
  endpoints: (builder) => ({
    getInformationRequests: builder.query<AdminInformationRequest[], void>({
      query: () => "/information-requests",
      transformResponse: (response: AdminInformationRequestsResponse) =>
        response.informationRequests || [],
      providesTags: (result) =>
        result
          ? [
              { type: "InformationRequests", id: "LIST" },
              ...result.map(({ id }) => ({
                type: "InformationRequests" as const,
                id,
              })),
            ]
          : [{ type: "InformationRequests", id: "LIST" }],
    }),
  }),
});

export const { useGetInformationRequestsQuery } = adminApi;
