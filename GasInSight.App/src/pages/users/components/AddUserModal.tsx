import { memo, FC, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { UserRole } from "../../../types/user";
import { userApi } from "../../../store/api/userApi";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

const AddUserModal: FC<AddUserModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: UserRole.User,
  });

  const [createUser, { isLoading }] = userApi.useCreateUserMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value as UserRole,
    }));
  };

  const handleConfirm = async () => {
    await createUser(formData);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: UserRole.User,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            name="username"
            label="Username"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleInputChange}
          />
          <FormControl fullWidth>
            <InputLabel id="new-user-role-select-label">Role</InputLabel>
            <Select
              labelId="new-user-role-select-label"
              value={formData.role}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          disabled={
            !formData.username ||
            !formData.email ||
            !formData.password ||
            isLoading
          }
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(AddUserModal);
