import { useCallback, useEffect, useRef, useState } from "react";
import { SensorRecord } from "../types/sensor";
import { transformSnakeToCamel } from "../utils/caseTransformers";

interface UseSensorWebSocketOptions {
  sensorId?: string;
  isLiveMode?: boolean;
  isLoading?: boolean;
}

export const useSensorWebSocket = ({
  sensorId,
  isLiveMode = true,
  isLoading = false,
}: UseSensorWebSocketOptions) => {
  const [liveRecords, setLiveRecords] = useState<SensorRecord[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;

  useEffect(() => {
    if (isLoading) {
      setLiveRecords([]);
    }
  }, [isLoading]);

  const connectWebSocket = useCallback(() => {
    if (!isLiveMode || !sensorId || isLoading) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    console.log("Starting connection");

    if (webSocketRef.current) {
      webSocketRef.current.close();
    }

    const wsUrl = `${
      import.meta.env.VITE_WS_URL ||
      import.meta.env.VITE_API_URL?.replace("http", "ws") ||
      "ws://localhost:8000"
    }/ws/sensor-data/${sensorId}?token=${token}`;
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);
    webSocketRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
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

      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay =
          baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
        console.log(
          `Attempting to reconnect in ${delay}ms (attempt ${
            reconnectAttemptsRef.current + 1
          }/${maxReconnectAttempts})`
        );

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connectWebSocket();
        }, delay);
      } else {
        console.log("Maximum reconnection attempts reached");
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    };
  }, [isLiveMode, sensorId, isLoading]);

  useEffect(() => {
    console.log("useEffect");
  }, []);

  useEffect(() => {
    if (isLiveMode && sensorId && !isLoading) {
      connectWebSocket();

      return () => {
        if (webSocketRef.current) {
          webSocketRef.current.close();
          webSocketRef.current = null;
        }

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };
    }
  }, [isLiveMode, sensorId, isLoading, connectWebSocket]);

  return { liveRecords };
};
