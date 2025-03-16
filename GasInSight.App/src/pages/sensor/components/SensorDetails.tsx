import { FC } from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import moment from "moment";
import { Sensor } from "../../../types/sensor";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { useGetColorsQuery } from "../../../store/api/dashboardApi";

interface SensorDetailsProps {
  sensor: Sensor;
}

export const SensorDetails: FC<SensorDetailsProps> = ({ sensor }) => {
  const { data: colors } = useGetColorsQuery();

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircleIcon sx={{ color: "success.main" }} />;
      case "inactive":
        return <PauseCircleIcon sx={{ color: "warning.main" }} />;
      case "error":
        return <ErrorIcon sx={{ color: "error.main" }} />;
      default:
        return undefined;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: string) => {
    if (colors?.sensorTypes) {
      const colorKey = Object.keys(colors.sensorTypes).find(
        (key) => key.toLowerCase() === type.toLowerCase()
      );
      if (colorKey) {
        return colors.sensorTypes[colorKey];
      }
    }
    return "#8884d8";
  };

  return (
    <>
      <Grid container spacing={3} sx={{ pb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Type
          </Typography>
          <Chip
            label={sensor.type}
            sx={{
              backgroundColor: getTypeColor(sensor.type),
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Status
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Chip
              icon={getStatusIcon(sensor.status)}
              label={sensor.status}
              color={getStatusColor(sensor.status)}
              size="medium"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarTodayIcon sx={{ mr: 1, fontSize: "small" }} />
              Installed At
            </Box>
          </Typography>
          <Typography variant="h6">
            {moment(sensor.installedAt).format("YYYY-MM-DD")}
          </Typography>
        </Grid>

        {/* <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon sx={{ mr: 1, fontSize: "small" }} />
              Expected Frequency
            </Box>
          </Typography>
          <Typography variant="h6">{sensor.expectedFreq}</Typography>
        </Grid> */}

        {sensor.location && (
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOnIcon sx={{ mr: 1, fontSize: "small" }} />
                Location
              </Box>
            </Typography>
            <Typography variant="h6">
              {sensor.location.address ||
                `${sensor.location.latitude}, ${sensor.location.longitude}`}
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
};
