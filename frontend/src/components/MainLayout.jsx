import React from "react";
import { Outlet, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const MainLayout = () => {
  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Skill Share</Typography>

          <Box sx={{ display: "flex", gap: 4 }}>
            <Typography
              component={Link}
              to="/"
              sx={{ textDecoration: "none", color: "black", fontWeight: 500 }}
            >
              Home
            </Typography>
            <Typography
              component={Link}
              to="/learning"
              sx={{ textDecoration: "none", color: "black", fontWeight: 500 }}
            >
              Learning
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton>
              <NotificationsIcon />
            </IconButton>
            <Button variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;