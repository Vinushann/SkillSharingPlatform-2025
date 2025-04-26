import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  InputAdornment
} from "@mui/material";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

const MainLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e0e0e0"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#1a237e" }}
            component={Link}
            to="/"
            style={{ textDecoration: "none" }}
          >
            Skill Share
          </Typography>

          {/* Navigation Links and Search Bar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Box sx={{ display: "flex", gap: 4 }}>
              <Typography
                component={Link}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: "#37474f",
                  fontWeight: 500,
                  "&:hover": { color: "#3f51b5" }
                }}
              >
                Home
              </Typography>
              <Typography
                component={Link}
                to="/learning"
                sx={{
                  textDecoration: "none",
                  color: "#37474f",
                  fontWeight: 500,
                  "&:hover": { color: "#3f51b5" }
                }}
              >
                Learning
              </Typography>
            </Box>
            <TextField
              variant="outlined"
              placeholder="Search plans or users..."
              size="small"
              sx={{
                width: "300px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f5f7fa",
                  "&:hover": {
                    backgroundColor: "#e8eaf6"
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#3f51b5" }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* User Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton>
              <NotificationsIcon
                sx={{ color: "#3f51b5" }} />
            </IconButton>
            
            <IconButton> 
              <NoteAddIcon sx={{color: "green"}}> </NoteAddIcon>
            </IconButton>
            
            <Avatar
              sx={{
                bgcolor: "#3f51b5",
                cursor: "pointer",
                width: 36,
                height: 36
              }}
              onClick={handleMenuOpen}
            >
              U
            </Avatar>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3f51b5",
                "&:hover": { backgroundColor: "#303f9f" },
                borderRadius: 2,
                px: 3,
                fontWeight: "bold"
              }}
            >
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