import { Box, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { facilityApi } from "../../store/api/facilityApi";
import { FacilityMap } from "./components/FacilityMap";

export const MapPage = () => {
  const {
    data: facilities,
    isLoading,
    error,
  } = facilityApi.useGetFacilitiesQuery();
  const [mapHeight, setMapHeight] = useState("calc(100vh - 64px)");

  useEffect(() => {
    const updateMapHeight = () => {
      setMapHeight("calc(100vh - 64px)");
    };

    window.addEventListener("resize", updateMapHeight);
    updateMapHeight();

    return () => {
      window.removeEventListener("resize", updateMapHeight);
    };
  }, []);

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

  return (
    <Box
      sx={{
        height: mapHeight,
        width: "100%",
        m: 0,
        p: 0,
        position: "relative",
      }}
    >
      {facilities && <FacilityMap facilities={facilities} fullscreen />}
    </Box>
  );
};
