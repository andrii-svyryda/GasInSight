import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { sensorApi } from "../../store/api/sensorApi";
import { DateRangePicker } from "./components/DateRangePicker";
import { SensorChart } from "./components/SensorChart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment";

export const SensorPage = () => {
  const { facilityId, sensorId } = useParams<{
    facilityId: string;
    sensorId: string;
  }>();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(() => {
    const yesterday = moment().subtract(1, "days");
    return yesterday.format("YYYY-MM-DDTHH:mm:ss");
  });
  const [endDate, setEndDate] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<string>("15T");

  const { data: sensor, isLoading: isSensorLoading } =
    sensorApi.useGetSensorByIdQuery(
      { facilityId: facilityId as string, sensorId: sensorId as string },
      { skip: !facilityId || !sensorId }
    );

  useEffect(() => {
    if (sensor?.expectedFreq) {
      setFrequency(sensor.expectedFreq);
    }
  }, [sensor]);

  const { data: records, isLoading: isRecordsLoading } =
    sensorApi.useGetSensorRecordsQuery(
      {
        sensorId: sensorId as string,
        startDate,
        endDate,
        freq: frequency,
      },
      { skip: !sensorId }
    );

  const handleBack = () => {
    navigate(-1);
  };

  const isLoading = isSensorLoading;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!sensor) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Sensor not found.</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Facility
        </Button>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#4caf50";
      case "maintenance":
        return "#ff9800";
      case "fault":
        return "#f44336";
      case "inactive":
        return "#9e9e9e";
      default:
        return "#2196f3";
    }
  };

  const getSensorTypeColor = (type: string) => {
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
        return "#2196f3";
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">{sensor.name}</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1">
            <strong>Type:</strong>{" "}
            <span
              style={{
                color: getSensorTypeColor(sensor.type),
                fontWeight: "bold",
              }}
            >
              {sensor.type}
            </span>
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: getStatusColor(sensor.status),
                fontWeight: "bold",
              }}
            >
              {sensor.status}
            </span>
          </Typography>
          <Typography variant="body1">
            <strong>Installed:</strong>{" "}
            {new Date(sensor.installedAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            <strong>Expected Frequency:</strong> {sensor.expectedFreq || "1H"}
          </Typography>
        </Grid>
        {sensor.location && (
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Location:</strong> {sensor.location.latitude},{" "}
              {sensor.location.longitude}
            </Typography>
            {sensor.location.address && (
              <Typography variant="body1">
                <strong>Address:</strong>{" "}
                <span style={{ color: "#673ab7", fontWeight: "bold" }}>
                  {sensor.location.address}
                </span>
              </Typography>
            )}
          </Grid>
        )}
      </Grid>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Sensor Data
      </Typography>

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        frequency={frequency}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onFrequencyChange={setFrequency}
        expectedFreq={sensor?.expectedFreq}
      />

      <SensorChart
        records={records || []}
        isLoading={isRecordsLoading}
        sensorType={sensor.type}
      />
    </Box>
  );
};
