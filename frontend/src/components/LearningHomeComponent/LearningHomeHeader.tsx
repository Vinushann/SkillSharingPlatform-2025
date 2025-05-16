import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import CloseIcon from "@mui/icons-material/Close";

import FloatingChatButton from "../GeminiChat/FloatingChatButton";
import GeminiChatWindow from "../GeminiChat/GeminiChatWindow";
import { sendGeminiMessage } from "../GeminiChat/geminiService";

const LearningHomeHeader: React.FC = () => {
  const navigate = useNavigate();

  // 🔹 Gemini Chat states
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // 🔹 Note Dialog state
  const [openNoteDialog, setOpenNoteDialog] = useState(false);

  // 🔹 Gemini Chat send handler
  const handleChatSend = useCallback(
    async (userText: string) => {
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
    <div>
      {/* 🔷 Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 6,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: "#1a237e", mb: 1 }}
          >
            Share Your Learning Journey
          </Typography>
        </Box>

        <Box sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#3949ab", fontStyle: "italic" }}
          >
            Inspire others with your progress and goals.
          </Typography>

          <Button
            onClick={() => navigate("/create")}
            variant="contained"
            size="large"
            color="secondary"
            sx={{
              backgroundColor: "#3f51b5",
              "&:hover": { backgroundColor: "#303f9f" },
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              mt: 2,
            }}
          >
            Start Learning
          </Button>
        </Box>
      </Box>

      {/* 🔹 Floating Gemini Chat Button */}
      <FloatingChatButton onClick={() => setShowChatWindow((prev) => !prev)} />

      {/* 🔹 Gemini Chat Window */}
      {showChatWindow && (
        <GeminiChatWindow
          onClose={() => setShowChatWindow(false)}
          isLoading={isChatLoading}
          setIsLoading={setIsChatLoading}
        />
      )}
    </div>
  );
};

export default LearningHomeHeader;
