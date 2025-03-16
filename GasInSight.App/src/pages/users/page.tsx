import { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { userApi } from "../../store/api/userApi";
import { User } from "../../types/user";
import AddIcon from "@mui/icons-material/Add";
import DeleteUserModal from "./components/DeleteUserModal";
import EditUserModal from "./components/EditUserModal";
import AddUserModal from "./components/AddUserModal";
import PermissionsModal from "./components/PermissionsModal";
import UsersTable from "./components/UsersTable";

export const UsersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isFetching, error } = userApi.useGetUsersQuery({
    page: page + 1,
    pageSize: rowsPerPage,
  });

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
    setEditDialogOpen(true);
  };

  const handlePermissionsClick = (user: User) => {
    setSelectedUser(user);
    setPermissionsDialogOpen(true);
  };

  const handleAddUserClick = () => {
    setAddUserDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleClosePermissionsDialog = () => {
    setPermissionsDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCloseAddUserDialog = () => {
    setAddUserDialogOpen(false);
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

      <UsersTable
        users={data?.users || []}
        total={data?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onPermissionsClick={handlePermissionsClick}
      />

      <DeleteUserModal
        open={deleteDialogOpen}
        user={selectedUser}
        onClose={handleCloseDeleteDialog}
      />

      <EditUserModal
        open={editDialogOpen}
        user={selectedUser}
        onClose={handleCloseEditDialog}
      />

      <AddUserModal
        open={addUserDialogOpen}
        onClose={handleCloseAddUserDialog}
      />

      <PermissionsModal
        open={permissionsDialogOpen}
        user={selectedUser}
        onClose={handleClosePermissionsDialog}
      />
    </Box>
  );
};
