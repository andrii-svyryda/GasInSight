import React, { useEffect, useState, useRef, useCallback } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Alert as AlertType } from "../types/alert";

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export const AlertsListener: React.FC = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "info",
  });
  const webSocketRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleClose = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const connectWebSocket = useCallback(() => {
    if (!token) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL?.replace("http", "ws") || "ws://localhost:8000"}/ws/notifications?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      if (event.data) {
        try {
          const data = JSON.parse(event.data);

          console.log(data);

          if (data.type === "alert") {
            const alert = data as AlertType;
            // Play alert sound
            if (audioRef.current) {
              audioRef.current.play().catch(err => {
                console.error("Error playing alert sound:", err);
              });
            }
            
            setNotification({
              open: true,
              message: alert.message,
              severity: "warning",
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      // Attempt to reconnect after a delay
      setTimeout(() => {
        connectWebSocket();
      }, 5000);
    };

    webSocketRef.current = ws;
  }, [token]);

  useEffect(() => {
    if (token) {
      connectWebSocket();
    }

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [token, connectWebSocket]);

  return (
    <>
      <audio ref={audioRef} src="/alert-sound.mp3" preload="auto" />
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AlertsListener;
