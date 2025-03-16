import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { sensorApi } from "../../store/api/sensorApi";
import { ChartConfiguration } from "./components/ChartConfiguration";
import { SensorDetails } from "./components/SensorDetails";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment";
import {
  getSensorDisplayName,
  getSensorValidLabel,
} from "../../constants/sensorType";
import SensorChart from "./components/SensorChart";
import { useGetFacilityByIdQuery } from "../../store/api/facilityApi";

export const SensorPage = () => {
  const { facilityId, sensorId } = useParams<{
    facilityId: string;
    sensorId: string;
  }>();

  const [startDate, setStartDate] = useState(() => {
    const yesterday = moment().subtract(1, "hours");
    return yesterday.format("YYYY-MM-DDTHH:mm:ss");
  });
  const [endDate, setEndDate] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<string>();
  const [aggregation, setAggregation] = useState<"mean" | "min" | "max">(
    "mean"
  );

  const { data: facility } = useGetFacilityByIdQuery(facilityId as string);

  const handleAggregationChange = (value: "mean" | "min" | "max") => {
    setAggregation(value);
  };

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

  const { data: recordsData, isFetching: isRecordsLoading } =
    sensorApi.useGetSensorRecordsQuery(
      {
        sensorId: sensorId as string,
        startDate,
        endDate,
        freq: frequency,
        aggregation,
      },
      { skip: !sensorId || !frequency }
    );

  const handleBack = () => {
    navigate(`/dashboard/facilities/${facilityId}`);
  };

  const navigate = useNavigate();

  if (isSensorLoading || !frequency) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!sensor) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Sensor not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to facility
      </Button>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {getSensorDisplayName(sensor.type)} sensor in {facility?.name} (
        {sensor.location?.latitude?.toFixed(4)},
        {sensor.location?.longitude.toFixed(4)})
      </Typography>

      <SensorDetails sensor={sensor} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Sensor Data
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {getSensorValidLabel(sensor.type)}
        </Typography>
      </Box>

      <ChartConfiguration
        startDate={startDate}
        endDate={endDate}
        frequency={frequency}
        aggregation={aggregation}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onFrequencyChange={setFrequency}
        onAggregationChange={handleAggregationChange}
        expectedFreq={sensor?.expectedFreq}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 3,
          alignItems: "center",
          height: "20px",
        }}
      >
        {recordsData?.analytics.min && (
          <Typography variant="body1">
            Min: {recordsData.analytics.min.toFixed(2)}
          </Typography>
        )}
        {recordsData?.analytics.max && (
          <Typography variant="body1">
            Max: {recordsData.analytics.max.toFixed(2)}
          </Typography>
        )}
        {recordsData?.analytics.mean && (
          <Typography variant="body1">
            Mean: {recordsData.analytics.mean.toFixed(2)}
          </Typography>
        )}
      </Box>
      <SensorChart
        records={recordsData?.records || []}
        isLoading={isRecordsLoading}
        sensorType={sensor?.type || ""}
        isLiveMode={!endDate}
        sensorId={sensorId}
      />
    </Box>
  );
};
