import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { logout } from "../../store/slices/authSlice";
import { authApi } from "../../store/api/authApi";
import { ReactNode } from "react";
import gasLogo from "../../assets/icons/gas-logo.svg";

interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = authApi.useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        {children}
        <Box
          component="img"
          src={gasLogo}
          alt="GasInSight Logo"
          sx={{
            width: "36px",
            height: "36px",
            marginRight: "12px",
            filter: "brightness(0) invert(1)",
          }}
        />
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", color: "white" }}
        >
          GasInSight
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
          {isAuthenticated ? (
            <>
              {user && (
                <Typography
                  variant="body2"
                  sx={{ display: "inline-block", mx: 2, fontSize: 18 }}
                >
                  {user.username}
                </Typography>
              )}
              <Button
                variant="contained"
                color="inherit"
                onClick={handleLogout}
                sx={{
                  textTransform: "none",
                  color: "primary.main",
                  bgcolor: "white",
                  fontSize: 16,
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button component={Link} to="/login" sx={{ textTransform: "none" }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
