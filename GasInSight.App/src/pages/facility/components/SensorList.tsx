import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Pagination,
} from "@mui/material";
import { SensorStatus } from "../../../types/sensor";
import { useNavigate } from "react-router-dom";
import { sensorApi } from "../../../store/api/sensorApi";
import { memo, useMemo, useState } from "react";
import SensorCardChart from "./SensorCardChart";
import { useGetColorsQuery } from "../../../store/api/dashboardApi";
import { getSensorDisplayName } from "../../../constants/sensorType";

interface SensorListProps {
  facilityId: string;
}

const SensorList = ({ facilityId }: SensorListProps) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const sensorsPerPage = 4;
  const { data: colors } = useGetColorsQuery();

  const { data: sensors, isLoading: isSensorsLoading } =
    sensorApi.useGetSensorsByFacilityIdQuery(facilityId, { skip: !facilityId });

  const handleViewDetails = (sensorId: string) => {
    navigate(`/dashboard/facilities/${facilityId}/sensors/${sensorId}`);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getStatusColor = (status: SensorStatus) => {
    switch (status) {
      case SensorStatus.Active:
        return "#4caf50";
      case SensorStatus.Inactive:
        return "#9e9e9e";
      case SensorStatus.Maintenance:
        return "#ff9800";
      case SensorStatus.Fault:
        return "#f44336";
      default:
        return "#9e9e9e";
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

  const pageCount = useMemo(
    () => Math.ceil((sensors?.length ?? 0) / sensorsPerPage),
    [sensors, sensorsPerPage]
  );

  const displayedSensors = useMemo(() => {
    if (!sensors) return [];

    const startIndex = (page - 1) * sensorsPerPage;

    return sensors.slice(startIndex, startIndex + sensorsPerPage);
  }, [sensors, page]);

  if (!displayedSensors || isSensorsLoading) {
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

  return (
    <Box sx={{ overflow: "auto", pr: 2 }}>
      <Grid container spacing={2}>
        {displayedSensors.map((sensor) => (
          <Grid item xs={12} sm={6} md={6} key={sensor.id}>
            <Card
              sx={{
                cursor: "pointer",
                border: "none",
                borderLeft: `6px solid ${getStatusColor(sensor.status)}`,
                height: "100%",
              }}
              onClick={() => handleViewDetails(sensor.id)}
            >
              <CardContent>
                <Box display="flex" alignItems="start" mb={1} gap={0.7}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: getTypeColor(sensor.type),
                    }}
                  >
                    {getSensorDisplayName(sensor.type)}
                  </Typography>
                  <Typography variant="body1" component="div">
                    Sensor
                  </Typography>
                  <div style={{ flexGrow: 1 }}></div>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: getStatusColor(sensor.status),
                        fontWeight: "bold",
                      }}
                    >
                      Status: {sensor.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Installed:{" "}
                      {new Date(sensor.installedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <SensorCardChart sensor={sensor} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default memo(SensorList);
