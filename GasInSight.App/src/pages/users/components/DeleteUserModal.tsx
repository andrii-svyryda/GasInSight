import { memo, FC } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { User } from "../../../types/user";
import { userApi } from "../../../store/api/userApi";

interface DeleteUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

const DeleteUserModal: FC<DeleteUserModalProps> = ({ open, user, onClose }) => {
  const [deleteUser, { isLoading }] = userApi.useDeleteUserMutation();

  const handleConfirm = async () => {
    if (user) {
      await deleteUser(user.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete user {user?.username}? This action
          cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" disabled={isLoading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(DeleteUserModal);
