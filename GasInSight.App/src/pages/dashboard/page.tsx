import { Box, Typography, CircularProgress } from "@mui/material";
import { DashboardTabs } from "./components/DashboardTabs";
import { useGetDashboardDataQuery } from "../../store/api/dashboardApi";

export const DashboardPage = () => {
  const { isLoading, error } = useGetDashboardDataQuery();

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

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading dashboard data. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <DashboardTabs />
    </Box>
  );
};
