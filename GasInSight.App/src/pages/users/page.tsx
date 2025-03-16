import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  TextField,
  Typography,
} from "@mui/material";
import { userApi } from "../../store/api/userApi";
import { PermissionType, User, UserRole } from "../../types/user";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SecurityIcon from "@mui/icons-material/Security";
import AddIcon from "@mui/icons-material/Add";
import { useGetFacilitiesQuery } from "../../store/api/facilityApi";

export const UsersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [selectedPermissionType, setSelectedPermissionType] =
    useState<PermissionType>(PermissionType.View);

  const { data: facilities, isFetching: facilitiesLoading } =
    useGetFacilitiesQuery(undefined, {
      skip: !selectedUser,
    });
  const [newUserFormData, setNewUserFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: UserRole.User,
  });
  const [selectedFacility, setSelectedFacility] = useState("");

  const { data, isFetching, error } = userApi.useGetUsersQuery({
    page: page + 1,
    pageSize: rowsPerPage,
  });

  const [deleteUser, { isLoading: isDeletingUser }] =
    userApi.useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] =
    userApi.useUpdateUserMutation();
  const [createUser, { isLoading: isCreatingUser }] =
    userApi.useCreateUserMutation();
  const [createPermission, { isLoading: isCreatingPermission }] =
    userApi.useCreatePermissionMutation();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  const handlePermissionsClick = (user: User) => {
    setSelectedUser(user);
    setPermissionsDialogOpen(true);
  };

  const handleAddUserClick = () => {
    setAddUserDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleEditConfirm = async () => {
    if (selectedUser) {
      await updateUser({
        id: selectedUser.id,
        ...editFormData,
      });
      setEditDialogOpen(false);
      setSelectedUser(null);
    }
  };
  const handlePermissionTypeChange = (e: SelectChangeEvent) => {
    setSelectedPermissionType(e.target.value as PermissionType);
  };

  const handlePermissionsConfirm = async () => {
    if (selectedUser && selectedFacility) {
      await createPermission({
        userId: selectedUser.id,
        facilityId: selectedFacility,
        permissionType: selectedPermissionType,
      });
      setPermissionsDialogOpen(false);
      setSelectedUser(null);
      setSelectedFacility("");
      setSelectedPermissionType(PermissionType.View);
    }
  };

  const handleAddUserConfirm = async () => {
    await createUser(newUserFormData);
    setAddUserDialogOpen(false);
    setNewUserFormData({
      username: "",
      email: "",
      password: "",
      role: UserRole.User,
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setEditFormData((prev) => ({
      ...prev,
      role: e.target.value as string,
    }));
  };

  const handleNewUserRoleChange = (e: SelectChangeEvent) => {
    setNewUserFormData((prev) => ({
      ...prev,
      role: e.target.value as UserRole,
    }));
  };

  const handleFacilityChange = (e: SelectChangeEvent) => {
    setSelectedFacility(e.target.value as string);
  };

  if (isFetching) {
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
          Error loading users. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddUserClick}
        >
          Add User
        </Button>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === UserRole.Admin ? "Administrator" : "User"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(user)}
                      aria-label="edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(user)}
                      aria-label="delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    {user.role === UserRole.User && (
                      <IconButton
                        size="small"
                        onClick={() => handlePermissionsClick(user)}
                        aria-label="permissions"
                      >
                        <SecurityIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={data?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user {selectedUser?.username}? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            loading={isDeletingUser}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="username"
              label="Username"
              fullWidth
              value={editFormData.username}
              onChange={handleEditInputChange}
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={editFormData.email}
              onChange={handleEditInputChange}
            />
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={editFormData.role}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value={UserRole.Admin}>Administrator</MenuItem>
                <MenuItem value={UserRole.User}>User</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditConfirm}
            color="primary"
            loading={isUpdatingUser}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="username"
              label="Username"
              fullWidth
              value={newUserFormData.username}
              onChange={handleNewUserInputChange}
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={newUserFormData.email}
              onChange={handleNewUserInputChange}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={newUserFormData.password}
              onChange={handleNewUserInputChange}
            />
            <FormControl fullWidth>
              <InputLabel id="new-user-role-select-label">Role</InputLabel>
              <Select
                labelId="new-user-role-select-label"
                value={newUserFormData.role}
                label="Role"
                onChange={handleNewUserRoleChange}
              >
                <MenuItem value={UserRole.Admin}>Administrator</MenuItem>
                <MenuItem value={UserRole.User}>User</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddUserConfirm}
            color="primary"
            disabled={
              !newUserFormData.username ||
              !newUserFormData.email ||
              !newUserFormData.password
            }
            loading={isCreatingUser}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={permissionsDialogOpen}
        onClose={() => setPermissionsDialogOpen(false)}
      >
        <DialogTitle>Adjust Permissions</DialogTitle>
        <DialogContent>
          {facilitiesLoading || !facilities ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                Grant facility access to {selectedUser?.username}
              </DialogContentText>
              <FormControl fullWidth>
                <InputLabel id="facility-select-label">Facility</InputLabel>
                <Select
                  labelId="facility-select-label"
                  value={selectedFacility}
                  label="Facility"
                  onChange={handleFacilityChange}
                >
                  {facilities.map((facility) => (
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePermissionsConfirm}
            color="primary"
            disabled={!selectedFacility}
            loading={isCreatingPermission}
          >
            Grant Access
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
