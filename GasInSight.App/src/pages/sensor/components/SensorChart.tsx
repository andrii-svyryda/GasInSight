import { Box, CircularProgress } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { SensorRecord, SensorType } from "../../../types/sensor";
import moment from "moment";
import { memo, useMemo } from "react";
import { useGetColorsQuery } from "../../../store/api/dashboardApi";
import {
  getSensorDisplayRange,
  getSensorMeasurements,
  getSensorValidRange,
} from "../../../constants/sensorType";
import { useSensorWebSocket } from "../../../hooks/useSensorWebSocket";

interface SensorChartProps {
  records: SensorRecord[];
  isLoading: boolean;
  sensorType?: SensorType;
  isLiveMode?: boolean;
  sensorId?: string;
  height?: number;
}

const SensorChart = ({
  records,
  isLoading,
  sensorType = SensorType.Temperature,
  isLiveMode = true,
  sensorId,
  height = 400,
}: SensorChartProps) => {
  const { data: colors } = useGetColorsQuery();
  const { liveRecords } = useSensorWebSocket({
    sensorId,
    isLiveMode,
    isLoading,
  });

  const displayRecords = useMemo(() => {
    if (!records?.length && !liveRecords?.length) return [];

    if (isLiveMode) {
      return [...(records ?? []), ...liveRecords];
    }

    return records;
  }, [records, liveRecords, isLiveMode]);

  const chartMinMaxDisplay = useMemo(() => {
    return getSensorDisplayRange(sensorType);
  }, [sensorType]);

  const chartMinMaxValid = useMemo(() => {
    return getSensorValidRange(sensorType);
  }, [sensorType]);

  const chartData = useMemo(() => {
    return displayRecords.map((record) => {
      try {
        const originalParsedData = parseFloat(record.data);
        let parsedData = originalParsedData;
        if (parsedData < chartMinMaxDisplay[0]) {
          parsedData = chartMinMaxDisplay[0];
        }
        if (parsedData > chartMinMaxDisplay[1]) {
          parsedData = chartMinMaxDisplay[1];
        }
        return {
          time: moment
            .utc(record.trackedAt)
            .local()
            .format("YYYY-MM-DD HH:mm:ss"),
          value: parsedData,
          label: isNaN(parsedData)
            ? `No data available`
            : `${originalParsedData} ${getSensorMeasurements(sensorType)}`,
        };
      } catch {
        return {
          time: moment
            .utc(record.trackedAt)
            .local()
            .format("YYYY-MM-DD HH:mm:ss"),
          value: null,
          label: `No data available`,
        };
      }
    });
  }, [displayRecords, sensorType]);

  const getChartColor = (type: string) => {
    if (colors?.sensorTypes) {
      const colorKey = Object.keys(colors.sensorTypes).find(
        (key) => key.toLowerCase() === type.toLowerCase()
      );
      if (colorKey) {
        return colors.sensorTypes[colorKey];
      }
    }

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
    <Box sx={{ width: "100%", height, position: "relative" }}>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[chartMinMaxDisplay[0], chartMinMaxDisplay[1]]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(_, __, props) => {
              return props.payload.label;
            }}
            contentStyle={{ fontSize: 12 }}
          />
          <ReferenceLine
            y={chartMinMaxValid[0]}
            stroke="red"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={chartMinMaxValid[1]}
            stroke="red"
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
            name={sensorType}
            fill={`url(#color${sensorType})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default memo(SensorChart);
