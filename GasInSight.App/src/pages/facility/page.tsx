import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { facilityApi } from "../../store/api/facilityApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { dashboardApi } from "../../store/api/dashboardApi";
import { SensorMetrics } from "../dashboard/components/SensorMetrics";
import { SensorCharts } from "../dashboard/components/SensorCharts";
import { FacilityMap } from "../map/components/FacilityMap";
import React from "react";
import SensorList from "./components/SensorList";

export const FacilityPage = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);

  const { data: facility, isLoading: isFacilityLoading } =
    facilityApi.useGetFacilityByIdQuery(facilityId as string, {
      skip: !facilityId,
    });

  const { data: dashboardData, isLoading: isDashboardLoading } =
    dashboardApi.useGetFacilityDashboardDataQuery(facilityId as string, {
      skip: !facilityId,
    });

  const handleBack = () => {
    navigate("/dashboard/facilities");
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const isLoading = isFacilityLoading || isDashboardLoading;

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

  if (!facility) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Facility not found.</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2, mb: 2 }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4">Facility: {facility.name}</Typography>

          {facility.location?.address && (
            <Typography variant="body1">
              <strong>Address:</strong>{" "}
              <span style={{ color: "#673ab7", fontWeight: "bold" }}>
                {facility.location.address}
              </span>
            </Typography>
          )}

          <Typography variant="body1">
            <strong>Status:</strong>{" "}
            <span
              style={{
                color:
                  facility.status.toLowerCase() === "active"
                    ? "#4caf50"
                    : facility.status.toLowerCase() === "maintenance"
                    ? "#ff9800"
                    : facility.status.toLowerCase() === "offline" ||
                      facility.status.toLowerCase() === "fault"
                    ? "#f44336"
                    : facility.status.toLowerCase() === "inactive"
                    ? "#9e9e9e"
                    : "#2196f3",
                fontWeight: "bold",
              }}
            >
              {facility.status}
            </span>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="facility tabs"
        >
          <Tab label="Dashboard" />
          <Tab label="Map" />
        </Tabs>
      </Box>

      {tabValue === 0 && dashboardData && (
        <>
          <Box sx={{ mb: 3, pt: 2 }}>
            <Typography variant="body1">
              <strong>Type:</strong>{" "}
              <span style={{ color: "#2196f3", fontWeight: "bold" }}>
                {facility.type}
              </span>
            </Typography>
          </Box>
          <SensorMetrics metrics={dashboardData.metrics} />
          <SensorCharts chartData={dashboardData.chartData} />
          {!!facilityId && <SensorList facilityId={facilityId} />}
        </>
      )}

      {tabValue === 1 && facility && facility.location && (
        <Box
          sx={{
            height: "calc(100vh - 303px)",
            width: "calc(100% + 56px)",
            mx: -4,
            mb: -4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <FacilityMap
            facilities={[facility]}
            selectedFacilityId={facility.id}
            fullscreen={true}
          />
        </Box>
      )}
    </Box>
  );
};
