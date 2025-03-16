import { Box, CircularProgress } from "@mui/material";
import { ResponsiveContainer } from "recharts";
import moment from "moment";
import { sensorApi } from "../../../store/api/sensorApi";
import { Sensor } from "../../../types/sensor";
import { SensorChart } from "../../sensor/components/SensorChart";

interface SensorCardChartProps {
  sensor: Sensor;
}

export const SensorCardChart = ({ sensor }: SensorCardChartProps) => {
  const { data: records, isLoading } = sensorApi.useGetSensorRecordsQuery(
    {
      sensorId: sensor.id,
      startDate: moment().subtract(6, "hour").format("YYYY-MM-DDTHH:mm:ss"),
      freq: sensor.expectedFreq,
      aggregation: "mean",
    },
    { skip: !sensor.id }
  );

  if (isLoading) {
    return (
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
    );
  }

  return (
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
  );
};
