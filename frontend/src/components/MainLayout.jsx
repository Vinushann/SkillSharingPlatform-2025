import React, { useState, useEffect } from "react";
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
  InputAdornment,
  useMediaQuery,
  Autocomplete,
  TextField,
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import NoteTaking from "../pages/NoteTaking";
import SearchPlanDialog from "../components/SearchPlans/SearchPlanDialog";

const MainLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNoteTaking, setShowNoteTaking] = useState(false);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery("(max-width:768px)");

  const [planTitles, setPlanTitles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlanTitle, setSelectedPlanTitle] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/plans").then((res) => {
      const titles = res.data.map((plan) => plan.mainTitle);
      setPlanTitles(titles);
    });
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNoteTakingToggle = () => {
    setShowNoteTaking(!showNoteTaking);
  };

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton>
                <MenuIcon sx={{ color: "#3f51b5" }} />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: "bold",
                color: "#1a237e",
                textDecoration: "none",
              }}
            >
              SkillShare
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Box sx={{ display: "flex", gap: 4 }}>
                <Typography
                  component={Link}
                  to="/"
                  sx={{
                    textDecoration: "none",
                    color: "#37474f",
                    fontWeight: 500,
                    "&:hover": { color: "#3f51b5" },
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
                    "&:hover": { color: "#3f51b5" },
                  }}
                >
                  Learning
                </Typography>
              </Box>
              <Autocomplete
                freeSolo
                options={planTitles}
                inputValue={searchQuery}
                onInputChange={(e, value) => setSearchQuery(value)}
                onChange={(event, value) => {
                  setSelectedPlanTitle(value);
                  setDialogOpen(true);
                }}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Search plans or users..."
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#3f51b5" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton>
              <NotificationsIcon sx={{ color: "#3f51b5" }} />
            </IconButton>

            <IconButton onClick={handleNoteTakingToggle}>
              <NoteAddIcon sx={{ color: "green" }} />
            </IconButton>

            <Avatar
              sx={{
                bgcolor: "#3f51b5",
                cursor: "pointer",
                width: 36,
                height: 36,
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

            {!isMobile && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#3f51b5",
                  "&:hover": { backgroundColor: "#303f9f" },
                  borderRadius: 2,
                  px: 3,
                  fontWeight: "bold",
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box>{showNoteTaking ? <NoteTaking /> : <Outlet />}</Box>

      <SearchPlanDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedTitle={selectedPlanTitle}
      />
    </Box>
  );
};

export default MainLayout;
