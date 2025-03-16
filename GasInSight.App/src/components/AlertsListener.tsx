import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Snackbar, Alert as MuiAlert, Stack } from "@mui/material";
import { RootState } from "../store";
import { Alert as AlertType } from "../types/alert";

interface Notification {
  id: string;
  open: boolean;
  message: string;
  severity: "error" | "warning" | "info" | "success";
  timestamp: number;
}

export const AlertsListener: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);

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
            {notification.message}
          </MuiAlert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default AlertsListener;
