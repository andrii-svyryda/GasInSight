import { Box, CircularProgress, Typography } from "@mui/material";
import { ResponsiveContainer } from "recharts";
import moment from "moment";
import { sensorApi } from "../../../store/api/sensorApi";
import { Sensor } from "../../../types/sensor";
import { memo, useMemo } from "react";
import SensorChart from "../../sensor/components/SensorChart";
import { getSensorValidLabel } from "../../../constants/sensorType";

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

  const { data: recordsData, isFetching: isLoading } =
    sensorApi.useGetSensorRecordsQuery(queryParams, { skip: !sensor.id });

  return isLoading || !sensor.id ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "220px",
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Box sx={{ width: "100%", mt: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          height: "20px",
          gap: 1,
          mb: 0.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {getSensorValidLabel(sensor.type)}
        </Typography>
        <div style={{ flexGrow: 1 }} />
        {recordsData?.analytics.min && (
          <Typography variant="body2">
            Min: {recordsData.analytics.min.toFixed(2)}
          </Typography>
        )}
        {recordsData?.analytics.max && (
          <Typography variant="body2">
            Max: {recordsData.analytics.max.toFixed(2)}
          </Typography>
        )}
        {recordsData?.analytics.mean && (
          <Typography variant="body2">
            Mean: {recordsData.analytics.mean.toFixed(2)}
          </Typography>
        )}
      </Box>
      <ResponsiveContainer height={200} width="100%">
        <SensorChart
          records={recordsData?.records ?? []}
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
