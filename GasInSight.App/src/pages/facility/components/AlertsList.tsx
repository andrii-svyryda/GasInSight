import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { alertApi } from "../../../store/api/alertApi";
import { sensorApi } from "../../../store/api/sensorApi";
import { Alert as AlertType } from "../../../types/alert";
import moment from "moment";
import { getSensorDisplayName } from "../../../constants/sensorType";
import { SensorType } from "../../../types/sensor";
import { useGetColorsQuery } from "../../../store/api/dashboardApi";

const AlertItem = ({
  alert,
  sensorType,
  navigateToSensor,
}: {
  alert: AlertType;
  sensorType?: SensorType;
  navigateToSensor: () => void;
}) => {
  const { data: colors } = useGetColorsQuery();

  const getSensorTypeColor = (type?: SensorType) => {
    if (!type) return "#8884d8"; // Default color when type is undefined

    if (colors?.sensorTypes) {
      const colorKey = Object.keys(colors.sensorTypes).find(
        (key) => key.toLowerCase() === type.toLowerCase()
      );
      if (colorKey) {
        return colors.sensorTypes[colorKey];
      }
    }

    // Fallback colors if API doesn't return colors
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
        {sensorType && (
          <Typography
            variant="body1"
            sx={{
              color: getSensorTypeColor(sensorType),
              fontWeight: "medium",
            }}
          >
            {getSensorDisplayName(sensorType)} sensor
          </Typography>
        )}
        <Typography variant="body1" color="text.secondary">
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
      </Box>
    </Paper>
  );
};

export const AlertsList = () => {
  const { facilityId } = useParams<{ facilityId: string }>();

  const navigate = useNavigate();

  const {
    data: alerts,
    isLoading: alertsLoading,
    error: alertsError,
  } = alertApi.useGetAlertsByFacilityIdQuery(facilityId as string, {
    skip: !facilityId,
  });

  const {
    data: sensors,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = sensorApi.useGetSensorsByFacilityIdQuery(facilityId as string, {
    skip: !facilityId,
  });

  const isLoading = alertsLoading || sensorsLoading;
  const error = alertsError || sensorsError;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Failed to load alerts.</Typography>
      </Box>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">No alerts found.</Typography>
      </Box>
    );
  }

  const getSensorType = (sensorId: string) => {
    if (!sensors) return undefined;
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor?.type;
  };

  const navigateToSensor = (sensorId: string) => {
    if (facilityId && sensorId) {
      navigate(`/dashboard/facilities/${facilityId}/sensors/${sensorId}`);
    }
  };

  return (
    <Box>
      {alerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          sensorType={getSensorType(alert.sensorId)}
          navigateToSensor={() => navigateToSensor(alert.sensorId)}
        />
      ))}
    </Box>
  );
};

export default AlertsList;
