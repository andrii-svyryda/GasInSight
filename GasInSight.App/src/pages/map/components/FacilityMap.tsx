import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
} from "react-leaflet";
import { Icon } from "leaflet";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Facility } from "../../../types/facility";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { sensorApi } from "../../../store/api/sensorApi";
import { Sensor, SensorStatus, SensorType } from "../../../types/sensor";
import moment from "moment";
import { getSensorDisplayName } from "../../../constants/sensorType";

interface FacilityMapProps {
  facilities: Facility[];
  selectedFacilityId?: string;
  fullscreen?: boolean;
}

const FocusOnMarker = ({ facility }: { facility: Facility | null }) => {
  const map = useMap();

  useEffect(() => {
    if (facility) {
      map.flyTo([facility.location.latitude, facility.location.longitude], 15, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [facility, map]);

  return null;
};

export const FacilityMap = ({
  facilities,
  selectedFacilityId,
  fullscreen,
}: FacilityMapProps) => {
  const navigate = useNavigate();
  const [focusedFacility, setFocusedFacility] = useState<Facility | null>(null);
  const [sensors, setSensors] = useState<Sensor[]>([]);

  const { data: facilitySensors } = sensorApi.useGetSensorsByFacilityIdQuery(
    focusedFacility?.id || selectedFacilityId || "",
    { skip: !focusedFacility && !selectedFacilityId }
  );

  useEffect(() => {
    if (facilitySensors) {
      setSensors(facilitySensors);
    }
  }, [facilitySensors]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#4caf50"; // green
      case "maintenance":
        return "#ff9800"; // orange
      case "offline":
      case "fault":
        return "#f44336"; // red
      case "inactive":
        return "#9e9e9e"; // gray
      default:
        return "#2196f3"; // blue
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "temperature":
        return "#f44336"; // red
      case "pressure":
        return "#2196f3"; // blue
      case "flow":
        return "#4caf50"; // green
      case "level":
        return "#ff9800"; // orange
      case "humidity":
        return "#9c27b0"; // purple
      case "gas":
        return "#795548"; // brown
      default:
        return "#9e9e9e"; // gray
    }
  };

  const getMarkerIconByStatus = (status: string, isSelected: boolean) => {
    let color = "blue";

    switch (status.toLowerCase()) {
      case "active":
        color = "green";
        break;
      case "maintenance":
        color = "orange";
        break;
      case "offline":
      case "fault":
        color = "red";
        break;
      case "inactive":
        color = "grey";
        break;
      default:
        color = "blue";
    }

    if (isSelected) {
      color = "violet";
    }

    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  const getSensorIcon = (_: SensorType, status: SensorStatus) => {
    let color = "blue";

    switch (status.toLowerCase()) {
      case "active":
        color = "green";
        break;
      case "maintenance":
        color = "orange";
        break;
      case "fault":
        color = "red";
        break;
      case "inactive":
        color = "grey";
        break;
      default:
        color = "blue";
    }

    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [20, 33], // Smaller than facility markers
      iconAnchor: [10, 33],
      popupAnchor: [1, -34],
      shadowSize: [33, 33],
    });
  };

  const handleViewDetails = (facilityId: string) => {
    navigate(`/dashboard/facilities/${facilityId}`);
  };

  const handleViewSensor = (facilityId: string, sensorId: string) => {
    navigate(`/dashboard/facilities/${facilityId}/sensors/${sensorId}`);
  };

  const handleMarkerClick = (facility: Facility) => {
    setFocusedFacility(facility);
  };

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
    link.integrity =
      "sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==";
    link.crossOrigin = "";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (selectedFacilityId && !focusedFacility) {
      const facility = facilities.find((f) => f.id === selectedFacilityId);
      if (facility) {
        setFocusedFacility(facility);
      }
    }
  }, [facilities, selectedFacilityId, focusedFacility]);

  const mapHeight = fullscreen ? "100%" : "calc(100vh - 120px)";

  return (
    <Box sx={{ height: mapHeight, width: "100%" }}>
      {facilities.length > 0 && (
        <MapContainer
          center={
            focusedFacility
              ? [
                  focusedFacility.location.latitude,
                  focusedFacility.location.longitude,
                ]
              : selectedFacility
              ? [
                  selectedFacility.location.latitude,
                  selectedFacility.location.longitude,
                ]
              : [
                  facilities[0].location.latitude,
                  facilities[0].location.longitude,
                ]
          }
          zoom={focusedFacility ? 15 : selectedFacility ? 13 : 10}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          {facilities.map((facility) => (
            <Marker
              key={facility.id}
              position={[
                facility.location.latitude,
                facility.location.longitude,
              ]}
              icon={getMarkerIconByStatus(
                facility.status,
                facility.id === focusedFacility?.id
              )}
              eventHandlers={{
                click: () => handleMarkerClick(facility),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -30]}
                opacity={0.9}
                permanent
              >
                {facility.name}
              </Tooltip>
              <Popup>
                <div>
                  <h3>{facility.name}</h3>
                  <p>Type: {facility.type}</p>
                  <p>
                    Status:{" "}
                    <span
                      style={{
                        color: getStatusColor(facility.status),
                        fontWeight: "bold",
                      }}
                    >
                      {facility.status}
                    </span>
                  </p>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleViewDetails(facility.id)}
                  >
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}

          {(focusedFacility || selectedFacilityId) &&
            sensors &&
            sensors.map(
              (sensor) =>
                sensor.location && (
                  <Marker
                    key={sensor.id}
                    position={[
                      sensor.location.latitude,
                      sensor.location.longitude,
                    ]}
                    icon={getSensorIcon(sensor.type, sensor.status)}
                  >
                    <Tooltip
                      direction="top"
                      offset={[0, -30]}
                      opacity={0.9}
                      permanent
                    >
                      {getSensorDisplayName(sensor.type)} Sensor
                    </Tooltip>
                    <Popup>
                      <Box gap={0}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: getTypeColor(sensor.type),
                          }}
                        >
                          {getSensorDisplayName(sensor.type)} Sensor
                        </Typography>
                        <Typography variant="body2">
                          Status:{" "}
                          <Box
                            component="span"
                            sx={{
                              color: getStatusColor(sensor.status),
                              fontWeight: "bold",
                            }}
                          >
                            {sensor.status}
                          </Box>
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Installed:{" "}
                          {moment(sensor.installedAt).format("YYYY-MM-DD")}
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleViewSensor(sensor.facilityId, sensor.id)
                          }
                        >
                          View Sensor
                        </Button>
                      </Box>
                    </Popup>
                  </Marker>
                )
            )}

          <FocusOnMarker facility={focusedFacility} />
        </MapContainer>
      )}
    </Box>
  );
};
