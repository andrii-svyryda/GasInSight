import { baseApi } from "./baseApi";

export interface DashboardMetrics {
  totalFacilities: number;
  activeFacilities: number;
  maintenanceFacilities: number;
  offlineFacilities: number;
  facilityTypes: number;
  totalSensors: number;
  activeSensors: number;
  inactiveSensors: number;
  avgSensorsPerFacility: number;
}

export interface StatusMetric {
  name: string;
  value: number;
  color: string;
}

export interface TypeMetric {
  name: string;
  value: number;
  color: string;
}

export interface DashboardChartData {
  statusData: StatusMetric[];
  typeData: TypeMetric[];
  sensorStatusData: StatusMetric[];
  sensorTypeData: TypeMetric[];
}

export interface DashboardData {
  metrics: DashboardMetrics;
  chartData: DashboardChartData;
}

type ColorsResponse = {
  sensorTypes: Record<string, string>;
  sensorStatus: Record<string, string>;
  facilityTypes: Record<string, string>;
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      query: () => ({
        url: "dashboard",
        method: "GET",
      }),
    }),
    getFacilityDashboardData: builder.query<DashboardData, string>({
      query: (facilityId) => ({
        url: `dashboard/facility/${facilityId}`,
        method: "GET",
      }),
    }),
    getColors: builder.query<ColorsResponse, void>({
      query: () => ({
        url: "dashboard/colors",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardDataQuery, useGetFacilityDashboardDataQuery, useGetColorsQuery } = dashboardApi;
