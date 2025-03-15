import { baseApi } from "./baseApi";
import { Sensor, SensorRecord } from "../../types/sensor";

interface GetSensorRecordsParams {
  sensorId: string;
  startDate: string;
  endDate?: string | null;
}

export const sensorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSensorsByFacilityId: builder.query<Sensor[], string>({
      query: (facilityId) => ({
        url: `/sensors`,
        params: { facility_id: facilityId },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Sensor" as const, id })),
              { type: "Sensor", id: "LIST" },
            ]
          : [{ type: "Sensor", id: "LIST" }],
    }),

    getSensorById: builder.query<
      Sensor,
      { facilityId: string; sensorId: string }
    >({
      query: ({ sensorId }) => `/sensors/${sensorId}`,
      providesTags: (_, __, { sensorId }) => [{ type: "Sensor", id: sensorId }],
    }),

    getSensorRecords: builder.query<SensorRecord[], GetSensorRecordsParams>({
      query: ({ sensorId, startDate, endDate }) => ({
        url: `/sensor-records/${sensorId}`,
        params: endDate
          ? {
              start_date: startDate,
              end_date: endDate,
            }
          : {
              start_date: startDate,
            },
      }),
      providesTags: (_, __, { sensorId }) => [
        { type: "SensorRecord", id: sensorId },
      ],
    }),
  }),
});
