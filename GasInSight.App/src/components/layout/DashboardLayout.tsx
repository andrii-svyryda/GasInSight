import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Header } from "./Header";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/user";
import PeopleIcon from "@mui/icons-material/People";
import MapIcon from "@mui/icons-material/Map";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";

const drawerWidth = 240;

export const DashboardLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === UserRole.Admin;
  const isMapPage = location.pathname === "/dashboard/map";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      onClick: () => {
        navigate("/dashboard");
        if (isMobile) setMobileOpen(false);
      },
      path: "/dashboard",
      visible: true,
    },
    {
      text: "Facilities",
      icon: <BusinessIcon />,
      onClick: () => {
        navigate("/dashboard/facilities");
        if (isMobile) setMobileOpen(false);
      },
      path: "/dashboard/facilities",
      visible: true,
    },
    {
      text: "Map",
      icon: <MapIcon />,
      onClick: () => {
        navigate("/dashboard/map");
        if (isMobile) setMobileOpen(false);
      },
      path: "/dashboard/map",
      visible: true,
    },
    {
      text: "Users",
      icon: <PeopleIcon />,
      onClick: () => {
        navigate("/dashboard/users");
        if (isMobile) setMobileOpen(false);
      },
      path: "/dashboard/users",
      visible: isAdmin,
    },
  ];

  const isPathActive = (path: string) => {
    if (path === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        (location.pathname.startsWith("/dashboard/facilities") &&
          !location.pathname.includes("/users") &&
          !location.pathname.includes("/facilities"))
      );
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems
            .filter((item) => item.visible)
            .map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={item.onClick}
                  selected={isPathActive(item.path)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.light,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                      },
                    },
                    "&.Mui-selected .MuiListItemIcon-root, &.Mui-selected .MuiListItemText-primary":
                      {
                        color: theme.palette.primary.contrastText,
                      },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Header>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Header>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMapPage ? 0 : 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
