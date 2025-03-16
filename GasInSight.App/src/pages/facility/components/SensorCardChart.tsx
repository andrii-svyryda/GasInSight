import { Box, CircularProgress } from "@mui/material";
import { ResponsiveContainer } from "recharts";
import moment from "moment";
import { sensorApi } from "../../../store/api/sensorApi";
import { Sensor } from "../../../types/sensor";
import { memo, useMemo } from "react";
import SensorChart from "../../sensor/components/SensorChart";

interface SensorCardChartProps {
  sensor: Sensor;
}

const SensorCardChart = ({ sensor }: SensorCardChartProps) => {
  const queryParams = useMemo(
    () => ({
      sensorId: sensor.id,
      startDate: moment().subtract(1, "hour").format("YYYY-MM-DDTHH:mm:ss"),
      freq: sensor.expectedFreq,
      aggregation: "mean" as const,
    }),
    [sensor.id, sensor.expectedFreq]
  );

  const { data: records, isFetching: isLoading } =
    sensorApi.useGetSensorRecordsQuery(queryParams, { skip: !sensor.id });

  return isLoading || !sensor.id ? (
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
  ) : (
    <Box sx={{ width: "100%", mt: 1 }}>
      <ResponsiveContainer height={200} width="100%">
        <SensorChart
          records={records ?? []}
          isLoading={false}
          sensorType={sensor.type}
          isLiveMode={true}
          sensorId={sensor.id}
          height={200}
        />
      </ResponsiveContainer>
    </Box>
  );
};

export default memo(SensorCardChart);
