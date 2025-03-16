import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { alertApi } from "../../../store/api/alertApi";
import { sensorApi } from "../../../store/api/sensorApi";
import {
  Alert as AlertType,
  AlertType as AlertTypeEnum,
} from "../../../types/alert";
import moment from "moment";

const getAlertTypeColor = (type: string) => {
  switch (type) {
    case AlertTypeEnum.GAS_LEAK:
      return "#f44336";
    case AlertTypeEnum.HIGH_PRESSURE:
    case AlertTypeEnum.HIGH_TEMPERATURE:
      return "#ff9800";
    case AlertTypeEnum.LOW_PRESSURE:
    case AlertTypeEnum.LOW_TEMPERATURE:
      return "#2196f3";
    case AlertTypeEnum.SYSTEM:
      return "#9c27b0";
    default:
      return "#757575";
  }
};

const AlertItem = ({
  alert,
  sensorName,
}: {
  alert: AlertType;
  sensorName?: string;
}) => {
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
        {sensorName && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Alert in: {sensorName}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {moment(alert.createdAt).format("MMM D, YYYY HH:mm")}
        </Typography>
      </Box>
      <Typography variant="body1">{alert.message}</Typography>
    </Paper>
  );
};

export const AlertsList = () => {
  const { facilityId } = useParams<{ facilityId: string }>();

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

  const getSensorName = (sensorId: string) => {
    if (!sensors) return undefined;
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor?.name;
  };

  return (
    <Box>
      {alerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          sensorName={getSensorName(alert.sensorId)}
        />
      ))}
    </Box>
  );
};

export default AlertsList;
