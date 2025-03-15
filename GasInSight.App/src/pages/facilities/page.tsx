import { Box, Typography, CircularProgress } from "@mui/material";
import { useGetFacilitiesQuery } from "../../store/api/facilityApi";
import { FacilitiesTable } from "./components/FacilitiesTable";

export const FacilitiesPage = () => {
  const { data: facilities, isLoading, error } = useGetFacilitiesQuery();

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
        <Typography color="error">
          Error loading facilities. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Facilities
      </Typography>
      {facilities && <FacilitiesTable facilities={facilities} />}
    </Box>
  );
};
