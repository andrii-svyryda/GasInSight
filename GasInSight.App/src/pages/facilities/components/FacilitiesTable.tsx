import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Facility } from "../../../types/facility";
import moment from "moment";

interface FacilitiesTableProps {
  facilities: Facility[];
}

export const FacilitiesTable = ({ facilities }: FacilitiesTableProps) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (facilityId: string) => {
    navigate(`/dashboard/facilities/${facilityId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#4caf50";
      case "maintenance":
        return "#ff9800";
      case "offline":
        return "#f44336";
      default:
        return "#2196f3";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#e8f5e9";
      case "maintenance":
        return "#fff3e0";
      case "offline":
        return "#ffebee";
      default:
        return "#e3f2fd";
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
        <Table stickyHeader aria-label="facilities table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilities.map((facility) => (
              <TableRow hover key={facility.id}>
                <TableCell>{facility.name}</TableCell>
                <TableCell>{facility.type}</TableCell>
                <TableCell>
                  <Chip
                    label={facility.status}
                    sx={{
                      color: getStatusColor(facility.status),
                      backgroundColor: getStatusBgColor(facility.status),
                      fontWeight: "bold",
                    }}
                  />
                </TableCell>
                <TableCell>
                  {facility.location.address ||
                    `${facility.location.latitude.toFixed(
                      4
                    )}, ${facility.location.longitude.toFixed(4)}`}
                </TableCell>
                <TableCell>
                  {moment(facility.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDetails(facility.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={facilities.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
