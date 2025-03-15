import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { Sensor, SensorStatus } from '../../../types/sensor';
import { useNavigate } from 'react-router-dom';

interface SensorListProps {
  sensors: Sensor[];
  facilityId: string;
  onSensorSelect: (sensor: Sensor) => void;
  selectedSensorId?: string;
}

export const SensorList = ({ sensors, facilityId, onSensorSelect, selectedSensorId }: SensorListProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (sensorId: string) => {
    navigate(`/dashboard/facilities/${facilityId}/sensors/${sensorId}`);
  };

  const getStatusColor = (status: SensorStatus) => {
    switch (status) {
      case SensorStatus.Active:
        return '#4caf50';
      case SensorStatus.Inactive:
        return '#9e9e9e';
      case SensorStatus.Maintenance:
        return '#ff9800';
      case SensorStatus.Fault:
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', overflow: 'auto', pr: 2 }}>
      <Grid container spacing={2}>
        {sensors.map((sensor) => (
          <Grid item xs={12} key={sensor.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: selectedSensorId === sensor.id ? '2px solid #1976d2' : 'none',
                borderLeft: `6px solid ${getStatusColor(sensor.status)}`,
              }}
              onClick={() => onSensorSelect(sensor)}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  {sensor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {sensor.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {sensor.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Installed: {new Date(sensor.installedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(sensor.id);
                  }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
