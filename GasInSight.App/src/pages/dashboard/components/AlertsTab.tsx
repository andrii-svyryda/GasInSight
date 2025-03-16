import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import { alertApi } from "../../../store/api/alertApi";
import { Alert as AlertType } from "../../../types/alert";
import moment from "moment";
import { getSensorDisplayName } from "../../../constants/sensorType";
import { useNavigate } from "react-router-dom";

const AlertItem = ({ alert }: { alert: AlertType }) => {
  const navigate = useNavigate();

  const navigateToSensor = () => {
    if (alert.facility?.id && alert.sensor?.id) {
      navigate(
        `/dashboard/facilities/${alert.facility.id}/sensors/${alert.sensor.id}`
      );
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderLeft: `4px solid #f44336`,
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
            <Typography variant="caption" color="text.secondary">
              {getSensorDisplayName(alert.sensor.type)} sensor in{" "}
              {alert.facility?.name}
            </Typography>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary">
          {moment.utc(alert.createdAt).local().format("MMM D, YYYY HH:mm")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">{alert.message}</Typography>
        {alert.facility?.id && alert.sensor?.id && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={navigateToSensor}
            >
              Diagnose Sensor
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export const AlertsTab = () => {
  const {
    data: allAlerts,
    isLoading: alertsLoading,
    error: alertsError,
  } = alertApi.useGetRecentAlertsQuery(undefined);

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
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </Box>
  );
};
