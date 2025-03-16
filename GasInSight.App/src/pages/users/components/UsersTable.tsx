import { memo, FC } from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { User, UserRole } from "../../../types/user";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import { authApi } from "../../../store/api/authApi";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setTokens } from "../../../store/slices/authSlice";
import { useAuth } from "../../../hooks/useAuth";

interface UsersTableProps {
  users: User[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditClick: (user: User) => void;
  onDeleteClick: (user: User) => void;
  onPermissionsClick: (user: User) => void;
}

const UsersTable: FC<UsersTableProps> = ({
  users,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEditClick,
  onDeleteClick,
  onPermissionsClick,
}) => {
  const { user: currentUser } = useAuth();
  const dispatch = useAppDispatch();
  const [impersonateUser] = authApi.useImpersonateUserMutation();

  const handleImpersonateClick = async (user: User) => {
    try {
      const result = await impersonateUser(user.id).unwrap();
      dispatch(setTokens(result));
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Failed to impersonate user:", error);
    }
  };

  return (
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
            {users.map((user) => (
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
                  <Tooltip title="Edit user">
                    <IconButton
                      size="small"
                      onClick={() => onEditClick(user)}
                      aria-label="edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {user.id !== currentUser?.id && (
                    <Tooltip title="Impersonate user">
                      <IconButton
                        size="small"
                        onClick={() => handleImpersonateClick(user)}
                        aria-label="impersonate"
                      >
                        <PersonIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {user.role === UserRole.User && (
                    <Tooltip title="Manage permissions">
                      <IconButton
                        size="small"
                        onClick={() => onPermissionsClick(user)}
                        aria-label="permissions"
                      >
                        <SecurityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete user">
                    <IconButton
                      size="small"
                      onClick={() => onDeleteClick(user)}
                      aria-label="delete"
                      color="secondary"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default memo(UsersTable);
