<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useState, useCallback } from "react";
>>>>>>> 86b86cb0e75e9008e40fc248c120e29715e2b719
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
<<<<<<< HEAD
  InputAdornment,
  useMediaQuery,
  Autocomplete,
  TextField,
=======
  TextField,
  InputAdornment,
>>>>>>> 86b86cb0e75e9008e40fc248c120e29715e2b719
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
<<<<<<< HEAD
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import NoteTaking from "../pages/NoteTaking";
import SearchPlanDialog from "../components/SearchPlans/SearchPlanDialog";
=======
import NoteTaking from "../pages/NoteTaking";
import FloatingChatButton from "../components/GeminiChat/FloatingChatButton";
import GeminiChatWindow from "../components/GeminiChat/GeminiChatWindow";
import {
  generateLearningPlan,
  sendGeminiMessage,
} from "../services/geminiService";
>>>>>>> 86b86cb0e75e9008e40fc248c120e29715e2b719

const MainLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNoteTaking, setShowNoteTaking] = useState(false);
<<<<<<< HEAD
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
=======
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSend = useCallback(
    async (userText) => {
      const userMsg = { role: "user", parts: [{ text: userText }] };
      const updated = [...chatMessages, userMsg];
      setChatMessages(updated);

      try {
        setIsChatLoading(true);
        const replyText = await sendGeminiMessage(updated);
        const replyMsg = { role: "model", parts: [{ text: replyText }] };
        setChatMessages((prev) => [...prev, replyMsg]);
      } catch {
        setChatMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: "❌ Gemini failed to respond." }] },
        ]);
      } finally {
        setIsChatLoading(false);
      }
    },
    [chatMessages]
  );
>>>>>>> 86b86cb0e75e9008e40fc248c120e29715e2b719

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
<<<<<<< HEAD
          backgroundColor: "#ffffff",
=======
          backgroundColor: "#fff",
>>>>>>> 86b86cb0e75e9008e40fc248c120e29715e2b719
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
<<<<<<< HEAD
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
=======
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#1a237e" }}
            component={Link}
            to="/"
            style={{ textDecoration: "none" }}
          >
            Skill Share
          </Typography>

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

            <TextField
              variant="outlined"
              placeholder="Search plans or users..."
              size="small"
              sx={{
                width: "300px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f5f7fa",
                  "&:hover": { backgroundColor: "#e8eaf6" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#3f51b5" }} />
                  </InputAdornment>
                ),
              }}
            />
>>>>>>> 86b86cb0e75e9008e40fc248c120e29715e2b719
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
<<<<<<< HEAD

            <IconButton onClick={handleNoteTakingToggle}>
              <NoteAddIcon sx={{ color: "green" }} />
            </IconButton>

=======
            <IconButton onClick={() => setShowNoteTaking((prev) => !prev)}>
              <NoteAddIcon sx={{ color: "green" }} />
            </IconButton>
>>>>>>> 86b86cb0e75e9008e40fc248c120e29715e2b719
            <Avatar
              sx={{
                bgcolor: "#3f51b5",
                cursor: "pointer",
                width: 36,
                height: 36,
              }}
<<<<<<< HEAD
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
=======
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              U
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                View Profile
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
            </Menu>
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
>>>>>>> 86b86cb0e75e9008e40fc248c120e29715e2b719
          </Box>
        </Toolbar>
      </AppBar>

      <Box>{showNoteTaking ? <NoteTaking /> : <Outlet />}</Box>

<<<<<<< HEAD
      <SearchPlanDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedTitle={selectedPlanTitle}
      />
=======
      <FloatingChatButton onClick={() => setShowChatWindow((prev) => !prev)} />
      {showChatWindow && (
        <GeminiChatWindow
          onClose={() => setShowChatWindow(false)}
          messages={chatMessages}
          onSend={handleChatSend}
          isLoading={isChatLoading}
        />
      )}
>>>>>>> 86b86cb0e75e9008e40fc248c120e29715e2b719
    </Box>
  );
};

export default MainLayout;
