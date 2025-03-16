import { Box, Typography, CircularProgress, Paper, Chip } from "@mui/material";
import { alertApi } from "../../../store/api/alertApi";
import { Alert as AlertType } from "../../../types/alert";
import moment from "moment";

const getAlertTypeColor = (type: string) => {
  switch (type) {
    case "GAS_LEAK":
      return "#f44336";
    case "HIGH_PRESSURE":
    case "HIGH_TEMPERATURE":
      return "#ff9800";
    case "LOW_PRESSURE":
    case "LOW_TEMPERATURE":
      return "#2196f3";
    case "SYSTEM":
      return "#9c27b0";
    default:
      return "#757575";
  }
};

const AlertItem = ({ alert }: { alert: AlertType }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderLeft: `4px solid ${getAlertTypeColor(alert.alertType)}`,
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {alert.sensor && (
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Sensor: {alert.sensor.name}
            </Typography>
          )}
          {alert.facility && (
            <Chip 
              size="small" 
              label={alert.facility.name} 
              sx={{ fontSize: "0.7rem" }}
            />
          )}
        </Box>
        <Typography variant="caption" color="text.secondary">
          {moment(alert.createdAt).format("MMM D, YYYY HH:mm")}
        </Typography>
      </Box>
      <Typography variant="body1">{alert.message}</Typography>
    </Paper>
  );
};

export const AlertsTab = () => {
  const { data: allAlerts, isLoading: alertsLoading, error: alertsError } = 
    alertApi.useGetRecentAlertsQuery(undefined);

  if (alertsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (alertsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Failed to load alerts.</Typography>
      </Box>
    );
  }

  if (!allAlerts || allAlerts.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">No alerts found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Alerts
      </Typography>
      {allAlerts.slice(0, 10).map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
        />
      ))}
    </Box>
  );
};
