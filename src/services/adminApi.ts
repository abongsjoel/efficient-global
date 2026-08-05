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

export type AdminDeliveryRequest = {
  id: string;
  source: string;
  pickup: string;
  delivery: string;
  datetime: string;
  vehicle: string;
  name: string;
  email: string;
  phone: string;
  rush: string;
  instructions: string;
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

type AdminDeliveryRequestsResponse = {
  deliveryRequests?: AdminDeliveryRequest[];
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
  tagTypes: ["DeliveryRequests", "InformationRequests"],
  endpoints: (builder) => ({
    getDeliveryRequests: builder.query<AdminDeliveryRequest[], void>({
      query: () => "/delivery-requests",
      transformResponse: (response: AdminDeliveryRequestsResponse) =>
        response.deliveryRequests || [],
      keepUnusedDataFor: 300,
      providesTags: (result) =>
        result
          ? [
              { type: "DeliveryRequests", id: "LIST" },
              ...result.map(({ id }) => ({
                type: "DeliveryRequests" as const,
                id,
              })),
            ]
          : [{ type: "DeliveryRequests", id: "LIST" }],
    }),
    getInformationRequests: builder.query<AdminInformationRequest[], void>({
      query: () => "/information-requests",
      transformResponse: (response: AdminInformationRequestsResponse) =>
        response.informationRequests || [],
      keepUnusedDataFor: 300,
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

export const {
  useGetDeliveryRequestsQuery,
  useGetInformationRequestsQuery,
} = adminApi;
