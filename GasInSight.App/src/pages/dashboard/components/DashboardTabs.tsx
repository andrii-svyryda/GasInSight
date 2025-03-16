import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { useGetDashboardDataQuery } from "../../../store/api/dashboardApi";
import { useState } from "react";
import { FacilityCharts } from "./FacilityCharts";
import { SensorCharts } from "./SensorCharts";
import { FacilityMetrics } from "./FacilityMetrics";
import { SensorMetrics } from "./SensorMetrics";
import { AlertsTab } from "./AlertsTab";

export const DashboardTabs = () => {
  const { data: dashboardData, isLoading, error } = useGetDashboardDataQuery();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !dashboardData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error loading dashboard charts</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="dashboard chart tabs"
        >
          <Tab label="Facilities" />
          <Tab label="Sensors" />
          <Tab label="Alerts" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <FacilityMetrics metrics={dashboardData.metrics} />
          <FacilityCharts chartData={dashboardData.chartData} />
        </>
      )}
      {activeTab === 1 && (
        <>
          <SensorMetrics metrics={dashboardData.metrics} />
          <SensorCharts chartData={dashboardData.chartData} />
        </>
      )}
      {activeTab === 2 && (
        <AlertsTab />
      )}
    </Box>
  );
};
