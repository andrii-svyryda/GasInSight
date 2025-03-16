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
import { SensorRecord, SensorType } from "../../../types/sensor";
import moment from "moment";
import { useState, useEffect, useRef, useMemo } from "react";
import { useGetColorsQuery } from "../../../store/api/dashboardApi";
import {
  getSensorDisplayRange,
  getSensorMeasurements,
} from "../../../constants/sensorType";
import { transformSnakeToCamel } from "../../../utils/caseTransformers";

interface SensorChartProps {
  records: SensorRecord[];
  isLoading: boolean;
  sensorType?: SensorType;
  isLiveMode?: boolean;
  sensorId?: string;
  height?: number;
}

export const SensorChart = ({
  records,
  isLoading,
  sensorType = SensorType.Temperature,
  isLiveMode = true,
  sensorId,
  height = 400,
}: SensorChartProps) => {
  const { data: colors } = useGetColorsQuery();
  const [liveRecords, setLiveRecords] = useState<SensorRecord[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setLiveRecords([]);
  }, [isLoading]);

  useEffect(() => {
    console.log(isLiveMode && sensorId && !isLoading);
    if (isLiveMode && sensorId && !isLoading) {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      if (webSocketRef.current) {
        webSocketRef.current.close();
      }

      const wsUrl = `ws://localhost:8000/ws/sensor-data/${sensorId}?token=${token}`;
      console.log(wsUrl);
      const ws = new WebSocket(wsUrl);
      webSocketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        try {
          const newRecord = transformSnakeToCamel(
            JSON.parse(event.data)
          ) as SensorRecord;

          setLiveRecords((prev) => {
            const updatedRecords = [...prev, newRecord];
            return updatedRecords;
          });
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        if (webSocketRef.current) {
          webSocketRef.current.close();
          webSocketRef.current = null;
        }
      };
    }
  }, [isLiveMode, sensorId, isLoading]);

  const displayRecords = useMemo(() => {
    if (!records?.length && !liveRecords?.length) return [];

    if (isLiveMode) {
      return [...(records ?? []), ...liveRecords];
    }

    return records;
  }, [records, liveRecords, isLiveMode]);

  const chartData = displayRecords.map((record) => {
    try {
      const parsedData = record.data === null ? null : parseFloat(record.data);
      return {
        time: moment
          .utc(record.trackedAt)
          .local()
          .format("YYYY-MM-DD HH:mm:ss"),
        value: parsedData,
        label: `${parsedData} ${getSensorMeasurements(sensorType)}`,
      };
    } catch {
      return {
        time: moment
          .utc(record.trackedAt)
          .local()
          .format("YYYY-MM-DD HH:mm:ss"),
        value: null,
      };
    }
  });

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

  const chartMinMax = useMemo(() => {
    return getSensorDisplayRange(sensorType);
  }, [sensorType]);
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
          <XAxis dataKey="time" />
          <YAxis domain={[chartMinMax[0], chartMinMax[1]]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
