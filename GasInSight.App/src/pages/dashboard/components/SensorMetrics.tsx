import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { DashboardMetrics } from "../../../store/api/dashboardApi";

interface SensorMetricsProps {
  metrics: DashboardMetrics;
}

export const SensorMetrics = ({ metrics }: SensorMetricsProps) => {
  const sensorMetricCards = [
    {
      title: "Total Sensors",
      value: metrics.totalSensors,
      color: "#2196f3",
    },
    {
      title: "Active Sensors",
      value: metrics.activeSensors,
      color: "#4caf50",
    },
    {
      title: "Inactive Sensors",
      value: metrics.inactiveSensors,
      color: "#f44336",
    },
    ...(metrics.totalFacilities === 1
      ? []
      : [
          {
            title: "Avg Sensors/Facility",
            value: metrics.avgSensorsPerFacility,
            color: "#ff9800",
          },
        ]),
  ].filter(Boolean);

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Grid container spacing={2}>
        {sensorMetricCards.map((metric, index) => (
          <Grid
            item
            xs={6}
            sm={6}
            md={metrics.totalFacilities === 1 ? 4 : 3}
            key={index}
          >
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
