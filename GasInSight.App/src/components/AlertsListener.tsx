import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Alert as MuiAlert, Stack, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { Alert as AlertType } from "../types/alert";
import { transformSnakeToCamel } from "../utils/caseTransformers";

interface Notification {
  id: string;
  open: boolean;
  message: string;
  severity: "error" | "warning" | "info" | "success";
  timestamp: number;
  facilityId?: string;
  sensorId?: string;
}

export const AlertsListener: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();

  const initializeStartedRef = useRef(false);

  const handleClose = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, open: false } : n))
    );
  };

  const connectWebSocket = useCallback(() => {
    if (!token) return;

    const wsUrl = `${
      import.meta.env.VITE_WS_URL ||
      import.meta.env.VITE_API_URL?.replace("http", "ws") ||
      "ws://localhost:8000"
    }/ws/notifications?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data) {
          if (data.type === "alert") {
            const alert = transformSnakeToCamel(data) as AlertType;

            const newNotification: Notification = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              open: true,
              message: alert.message,
              severity: "error",
              timestamp: Date.now(),
              facilityId: alert.facilityId,
              sensorId: alert.sensorId,
            };

            setNotifications((prev) => [...prev, newNotification]);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setTimeout(() => {
        connectWebSocket();
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      ws.close();
    };

    webSocketRef.current = ws;

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [token]);

  useEffect(() => {
    if (token && !initializeStartedRef.current) {
      initializeStartedRef.current = true;
      const cleanup = connectWebSocket();
      return cleanup;
    }
  }, [connectWebSocket]);

  const navigateToSensor = (
    notificationId: string,
    facilityId?: string,
    sensorId?: string
  ) => {
    if (facilityId && sensorId) {
      navigate(`/dashboard/facilities/${facilityId}/sensors/${sensorId}`);
      // Close the notification after navigation
      handleClose(notificationId);
    }
  };

  const activeNotifications = notifications.filter((n) => n.open);

  console.log(activeNotifications);

  return (
    <Stack
      spacing={2}
      sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000 }}
    >
      {activeNotifications.map((notification, _) => (
        <Box key={notification.id} sx={{ mb: 1 }}>
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => handleClose(notification.id)}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {notification.message}
              <Button
                variant="text"
                color="inherit"
                size="small"
                sx={{
                  alignSelf: "flex-end",
                  mt: 1,
                  textTransform: "none",
                  color: "secondary",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
                onClick={() =>
                  notification.facilityId && notification.sensorId
                    ? navigateToSensor(
                        notification.id,
                        notification.facilityId,
                        notification.sensorId
                      )
                    : null
                }
                disabled={!notification.facilityId || !notification.sensorId}
              >
                Diagnose Sensor
              </Button>
            </Box>
          </MuiAlert>
        </Box>
      ))}
    </Stack>
  );
};

export default AlertsListener;
