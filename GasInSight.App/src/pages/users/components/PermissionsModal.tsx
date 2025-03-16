import { memo, FC, useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { PermissionType, User } from "../../../types/user";
import { userApi } from "../../../store/api/userApi";
import { useGetFacilitiesQuery } from "../../../store/api/facilityApi";
import DeleteIcon from "@mui/icons-material/Delete";

interface PermissionsModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

const PermissionsModal: FC<PermissionsModalProps> = ({
  open,
  user,
  onClose,
}) => {
  const [selectedFacility, setSelectedFacility] = useState("");
  const [selectedPermissionType, setSelectedPermissionType] = useState<
    PermissionType | undefined
  >(undefined);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: facilities, isFetching: facilitiesLoading } =
    useGetFacilitiesQuery(undefined, {
      skip: !user,
    });

  const { data: userPermissions, isFetching: permissionsLoading } =
    userApi.useGetUserPermissionsQuery(user?.id || 0, {
      skip: !user,
      refetchOnMountOrArgChange: true,
    });

  const [createPermission, { isLoading: isCreatingPermission }] =
    userApi.useCreatePermissionMutation();
  const [deletePermission, { isLoading: isDeletingPermission }] =
    userApi.useDeletePermissionMutation();

  useEffect(() => {
    if (!open) {
      setSelectedFacility("");
      setSelectedPermissionType(undefined);
      setPage(0);
    }
  }, [open]);

  const handleFacilityChange = (e: SelectChangeEvent) => {
    setSelectedFacility(e.target.value as string);
  };

  const handlePermissionTypeChange = (e: SelectChangeEvent) => {
    setSelectedPermissionType(e.target.value as PermissionType);
  };

  const handleConfirm = async () => {
    if (user && selectedFacility) {
      await createPermission({
        userId: user.id,
        facilityId: selectedFacility,
        permissionType: selectedPermissionType!,
      });
      setSelectedFacility("");
      setSelectedPermissionType(undefined);
    }
  };

  const handleDeletePermission = async (permissionId: number) => {
    await deletePermission({ permissionId, userId: user?.id || 0 });
  };

  const getFacilityName = (facilityId: string) => {
    if (!facilities) return facilityId;
    const facility = facilities.find((f) => f.id === facilityId);
    return facility ? facility.name : facilityId;
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isLoading =
    facilitiesLoading ||
    permissionsLoading ||
    isCreatingPermission ||
    isDeletingPermission;

  const displayedPermissions = userPermissions
    ? userPermissions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
    : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Adjust Permissions for {user?.username}</DialogTitle>
      <DialogContent>
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
        <>
          {userPermissions && userPermissions.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Current Permissions
              </Typography>
              <Paper sx={{ width: "100%", mb: 3 }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Facility</TableCell>
                        <TableCell>Permission Type</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedPermissions.map((permission) => (
                        <TableRow key={permission.id} hover>
                          <TableCell>
                            {getFacilityName(permission.facilityId)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={permission.permissionType}
                              color={
                                permission.permissionType ===
                                PermissionType.Edit
                                  ? "primary"
                                  : "default"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              edge="end"
                              aria-label="delete"
                              onClick={() =>
                                handleDeletePermission(permission.id)
                              }
                              disabled={isDeletingPermission}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={userPermissions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </>
          )}
          <Divider sx={{ my: 2 }} />
          <DialogContentText sx={{ mb: 2 }}>
            Grant or override access to facility
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="facility-select-label">Facility</InputLabel>
            <Select
              labelId="facility-select-label"
              value={selectedFacility}
              label="Facility"
              onChange={handleFacilityChange}
            >
              {facilities?.map((facility) => (
                <MenuItem key={facility.id} value={facility.id}>
                  {facility.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="permission-type-select-label">
              Permission Type
            </InputLabel>
            <Select
              labelId="permission-type-select-label"
              value={selectedPermissionType}
              label="Permission Type"
              onChange={handlePermissionTypeChange}
            >
              <MenuItem value={PermissionType.View}>View</MenuItem>
              <MenuItem value={PermissionType.Edit}>Edit</MenuItem>
            </Select>
          </FormControl>
        </>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          disabled={!selectedFacility || !selectedPermissionType}
          loading={isCreatingPermission}
        >
          Grant Access
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(PermissionsModal);
