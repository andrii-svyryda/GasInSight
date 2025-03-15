import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { DashboardMetrics } from "../../../store/api/dashboardApi";

interface FacilityMetricsProps {
  metrics: DashboardMetrics;
}

export const FacilityMetrics = ({ metrics }: FacilityMetricsProps) => {
  const facilityMetricCards = [
    {
      title: "Total Facilities",
      value: metrics.totalFacilities,
      color: "#1976d2",
    },
    {
      title: "Active Facilities",
      value: metrics.activeFacilities,
      color: "#4caf50",
    },
    {
      title: "Maintenance",
      value: metrics.maintenanceFacilities,
      color: "#ff9800",
    },
    {
      title: "Offline",
      value: metrics.offlineFacilities,
      color: "#f44336",
    },
    {
      title: "Facility Types",
      value: metrics.facilityTypes,
      color: "#9c27b0",
    },
  ];

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Grid container spacing={2}>
        {facilityMetricCards.map((metric, index) => (
          <Grid item xs={6} sm={4} md={2.4} key={index}>
            <Card
              sx={{
                height: "100%",
                borderTop: `4px solid ${metric.color}`,
                boxShadow: 2,
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  {metric.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
