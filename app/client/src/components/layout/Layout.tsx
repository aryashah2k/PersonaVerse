import React, { useState, ReactNode, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import Logo from "../ui/Logo";
import Footer from "./Footer";
import { useAuth } from "../../hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, profile, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
      auth: true,
    },
    { label: "History", path: "/history", icon: <HistoryIcon />, auth: true },
    { label: "About", path: "/about", icon: <InfoIcon />, auth: false },
    {
      label: "Pricing",
      path: "/pricing",
      icon: <PriceCheckIcon />,
      auth: false,
    },
  ];

  const filteredMenuItems = isAuthenticated
    ? menuItems
    : menuItems.filter((item) => !item.auth);

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo height={40} />
      </Box>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {isAuthenticated && (
        <>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/profile">
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          height: 80,
          display: "flex",
          justifyContent: "center",
          pr: 10,
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Box sx={{ mr: 2, display: { xs: "block", md: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <RouterLink
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Logo height={40} />
            </RouterLink>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {filteredMenuItems.map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.path}
                color="inherit"
                sx={{
                  mx: 1,
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "text.primary",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {isAuthenticated ? (
            <Box sx={{ ml: 2 }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                  src={profile?.profileImage || undefined}
                >
                  {profile?.name?.charAt(0) ||
                    profile?.username?.charAt(0) ||
                    "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={handleProfileMenuClose}
                  component={RouterLink}
                  to="/profile"
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleProfileMenuClose}
                  component={RouterLink}
                  to="/dashboard"
                >
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  Dashboard
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ ml: 2 }}>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                sx={{ mr: 1 }}
              >
                Sign In
              </Button>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                color="primary"
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;
