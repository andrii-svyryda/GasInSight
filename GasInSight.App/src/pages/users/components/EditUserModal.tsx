import { memo, FC, useState, useEffect } from "react";
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
import { User, UserRole } from "../../../types/user";
import { userApi } from "../../../store/api/userApi";

interface EditUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

const EditUserModal: FC<EditUserModalProps> = ({ open, user, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [updateUser, { isLoading }] = userApi.useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

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
      role: e.target.value as string,
    }));
  };

  const handleConfirm = async () => {
    if (user) {
      await updateUser({
        id: user.id,
        ...formData,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>
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
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
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
        <Button onClick={handleConfirm} color="primary" disabled={isLoading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(EditUserModal);
