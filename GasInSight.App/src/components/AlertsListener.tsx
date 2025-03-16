import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Snackbar, Alert as MuiAlert, Stack, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { Alert as AlertType } from "../types/alert";

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
        console.log("WebSocket message received:", data);

        if (data) {
          if (data.type === "alert") {
            const alert = data as AlertType;

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

  const cleanupOldNotifications = useCallback(() => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification.timestamp > oneHourAgo || notification.open
      )
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(cleanupOldNotifications, 15 * 60 * 1000); // Clean up every 15 minutes
    return () => clearInterval(interval);
  }, [cleanupOldNotifications]);

  const navigateToSensor = (facilityId?: string, sensorId?: string) => {
    if (facilityId && sensorId) {
      navigate(`/dashboard/facilities/${facilityId}/sensors/${sensorId}`);
      // Close the notification after navigation
      const notificationToClose = notifications.find(
        (n) => n.facilityId === facilityId && n.sensorId === sensorId && n.open
      );
      if (notificationToClose) {
        handleClose(notificationToClose.id);
      }
    }
  };

  // Get active notifications (those that are open)
  const activeNotifications = notifications.filter((n) => n.open);

  return (
    <Stack
      spacing={1}
      sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000 }}
    >
      {activeNotifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          autoHideDuration={null}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{ position: "relative", mt: 1 }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => handleClose(notification.id)}
            severity={notification.severity}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {notification.message}
              {notification.facilityId && notification.sensorId && (
                <Button 
                  variant="text" 
                  color="inherit"
                  size="small"
                  sx={{ 
                    alignSelf: 'flex-end', 
                    mt: 1, 
                    textTransform: 'none',
                    color: 'inherit',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                  onClick={() => navigateToSensor(notification.facilityId, notification.sensorId)}
                >
                  View Sensor
                </Button>
              )}
            </Box>
          </MuiAlert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default AlertsListener;
