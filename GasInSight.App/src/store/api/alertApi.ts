import { baseApi } from "./baseApi";
import { Alert } from "../../types/alert";

export const alertApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlertsByFacilityId: builder.query<Alert[], string>({
      query: (facilityId) => ({
        url: `/alerts/facility/${facilityId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Alerts" as const, id })),
              { type: "Alerts", id: "LIST" },
            ]
          : [{ type: "Alerts", id: "LIST" }],
    }),
    
    getRecentAlerts: builder.query<Alert[], void>({
      query: () => ({
        url: "/alerts/recent",
        method: "GET",
      }),
      providesTags: [{ type: "Alerts", id: "RECENT" }],
    }),

    getAllAlerts: builder.query<Alert[], void>({
      query: () => ({
        url: "/alerts",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Alerts" as const, id })),
              { type: "Alerts", id: "ALL" },
            ]
          : [{ type: "Alerts", id: "ALL" }],
    }),
  }),
});

export const { 
  useGetAlertsByFacilityIdQuery, 
  useGetRecentAlertsQuery,
  useGetAllAlertsQuery
} = alertApi;
