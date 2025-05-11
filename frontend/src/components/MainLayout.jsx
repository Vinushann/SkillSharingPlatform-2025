import React, { useState, useCallback } from "react";
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
  InputAdornment,
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import NoteTaking from "../pages/NoteTaking";
import FloatingChatButton from "../components/GeminiChat/FloatingChatButton";
import GeminiChatWindow from "../components/GeminiChat/GeminiChatWindow";
import {
  generateLearningPlan,
  sendGeminiMessage,
} from "../services/geminiService";

const MainLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNoteTaking, setShowNoteTaking] = useState(false);
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

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
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
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton>
              <NotificationsIcon sx={{ color: "#3f51b5" }} />
            </IconButton>
            <IconButton onClick={() => setShowNoteTaking((prev) => !prev)}>
              <NoteAddIcon sx={{ color: "green" }} />
            </IconButton>
            <Avatar
              sx={{
                bgcolor: "#3f51b5",
                cursor: "pointer",
                width: 36,
                height: 36,
              }}
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
          </Box>
        </Toolbar>
      </AppBar>

      <Box>{showNoteTaking ? <NoteTaking /> : <Outlet />}</Box>

      <FloatingChatButton onClick={() => setShowChatWindow((prev) => !prev)} />
      {showChatWindow && (
        <GeminiChatWindow
          onClose={() => setShowChatWindow(false)}
          messages={chatMessages}
          onSend={handleChatSend}
          isLoading={isChatLoading}
        />
      )}
    </Box>
  );
};

export default MainLayout;