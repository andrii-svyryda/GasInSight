import { Box, CircularProgress } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SensorRecord } from "../../../types/sensor";
import moment from "moment";

interface SensorChartProps {
  records: SensorRecord[];
  isLoading: boolean;
  sensorType?: string;
}

export const SensorChart = ({
  records,
  isLoading,
  sensorType = "",
}: SensorChartProps) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const chartData = records.map((record) => {
    console.log(record);
    try {
      const parsedData = record.data === null ? null : parseInt(record.data);
      return {
        time: moment(record.trackedAt).format("YYYY-MM-DD HH:mm:ss"),
        value: parsedData,
      };
    } catch {
      return {
        time: moment(record.trackedAt).format("YYYY-MM-DD HH:mm:ss"),
        value: null,
      };
    }
  });

  const getChartColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "temperature":
        return "#f44336";
      case "pressure":
        return "#2196f3";
      case "flow":
        return "#4caf50";
      case "level":
        return "#ff9800";
      case "gas":
        return "#9c27b0";
      default:
        return "#8884d8";
    }
  };

  const chartColor = getChartColor(sensorType);

  return (
    <Box sx={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
