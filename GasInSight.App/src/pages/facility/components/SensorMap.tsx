import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Box, Button } from '@mui/material';
import { Sensor, SensorStatus } from '../../../types/sensor';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

interface SensorMapProps {
  sensors: Sensor[];
  facilityId: string;
  facilityLocation: { latitude: number; longitude: number };
  selectedSensorId?: string;
}

export const SensorMap = ({ sensors, facilityId, facilityLocation, selectedSensorId }: SensorMapProps) => {
  const navigate = useNavigate();

  const getSensorIcon = (status: SensorStatus, isSelected: boolean) => {
    let color = 'blue';
    
    switch (status) {
      case SensorStatus.Active:
        color = isSelected ? 'green' : 'green';
        break;
      case SensorStatus.Inactive:
        color = isSelected ? 'grey' : 'grey';
        break;
      case SensorStatus.Maintenance:
        color = isSelected ? 'orange' : 'orange';
        break;
      case SensorStatus.Fault:
        color = isSelected ? 'red' : 'red';
        break;
    }
    
    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  const handleViewDetails = (sensorId: string) => {
    navigate(`/dashboard/facilities/${facilityId}/sensors/${sensorId}`);
  };

  const selectedSensor = sensors.find(s => s.id === selectedSensorId);
  const mapCenter = selectedSensor?.location 
    ? [selectedSensor.location.latitude, selectedSensor.location.longitude] 
    : [facilityLocation.latitude, facilityLocation.longitude];

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
      <MapContainer
        center={[mapCenter[0], mapCenter[1]]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sensors.map((sensor) => (
          sensor.location && (
            <Marker
              key={sensor.id}
              position={[sensor.location.latitude, sensor.location.longitude]}
              icon={getSensorIcon(sensor.status, sensor.id === selectedSensorId)}
            >
              <Popup>
                <div>
                  <h3>{sensor.name}</h3>
                  <p>Type: {sensor.type}</p>
                  <p>Status: {sensor.status}</p>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleViewDetails(sensor.id)}
                  >
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </Box>
  );
}
