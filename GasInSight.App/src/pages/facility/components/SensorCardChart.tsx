import { Box, CircularProgress } from "@mui/material";
import { ResponsiveContainer } from "recharts";
import moment from "moment";
import { sensorApi } from "../../../store/api/sensorApi";
import { Sensor } from "../../../types/sensor";
import { SensorChart } from "../../sensor/components/SensorChart";
import { useMemo } from "react";

interface SensorCardChartProps {
  sensor: Sensor;
}

export const SensorCardChart = ({ sensor }: SensorCardChartProps) => {
  const queryParams = useMemo(() => ({
    sensorId: sensor.id,
    startDate: moment().subtract(1, "hour").format("YYYY-MM-DDTHH:mm:ss"),
    freq: sensor.expectedFreq,
    aggregation: "mean" as const,
  }), [sensor.id, sensor.expectedFreq]);

  const { data: records, isLoading } = sensorApi.useGetSensorRecordsQuery(
    queryParams,
    { skip: !sensor.id }
  );

  const loadingContent = useMemo(() => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <CircularProgress />
    </Box>
  ), []);

  const chartContent = useMemo(() => (
    <Box sx={{ width: "100%", mt: 1 }}>
      <ResponsiveContainer height={200} width="100%">
        <SensorChart
          records={records ?? []}
          isLoading={isLoading}
          sensorType={sensor.type}
          isLiveMode={true}
          sensorId={sensor.id}
          height={200}
        />
      </ResponsiveContainer>
    </Box>
  ), [records, isLoading, sensor.type, sensor.id]);

  return isLoading ? loadingContent : chartContent;
}
