import { baseApi } from "./baseApi";
import {
  Sensor,
  SensorRecord,
  SensorRecordsResponse,
} from "../../types/sensor";
import moment from "moment";

interface GetSensorRecordsParams {
  sensorId: string;
  startDate: string;
  endDate?: string | null;
  freq?: string;
  aggregation?: "min" | "max" | "mean";
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

    getSensorRecords: builder.query<
      SensorRecordsResponse,
      GetSensorRecordsParams
    >({
      query: ({ sensorId, startDate, endDate, freq, aggregation }) => ({
        url: `/sensor-records/${sensorId}`,
        params: {
          start_date: moment(startDate).utc().format("YYYY-MM-DD HH:mm:ss"),
          ...(endDate && { end_date: endDate }),
          ...(freq && { freq }),
          ...(aggregation && { aggregation }),
        },
      }),
      providesTags: (_, __, { sensorId }) => [
        { type: "SensorRecord", id: sensorId },
      ],
      keepUnusedDataFor: 0,
    }),
  }),
});
