import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Message {
  role: "user" | "model" | string;
  parts?: { text: string }[];
}

interface GeminiChatWindowProps {
  onClose: () => void;
  messages: Message[];
  onSend: (message: string) => void;
  isLoading: boolean;
}

const GeminiChatWindow: React.FC<GeminiChatWindowProps> = ({
  onClose,
  messages,
  onSend,
  isLoading,
}) => {
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        position: "fixed",
        bottom: 90,
        right: 24,
        width: 320,
        height: 440,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        zIndex: 1500,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#3f51b5",
          color: "#fff",
          p: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight="bold">Gemini Assistant</Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, bgcolor: "#f5f5f5" }}>
        {(messages || []).map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              mb: 1.5,
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <Box
              sx={{
                bgcolor: msg.role === "user" ? "#e3f2fd" : "#ffffff",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "80%",
              }}
            >
              <Typography variant="body2">
                {msg.parts?.[0]?.text || "(no message)"}
              </Typography>
            </Box>
          </Box>
        ))}
        {isLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
      </Box>

      <Box sx={{ p: 1.5, borderTop: "1px solid #ddd" }}>
        <TextField
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          fullWidth
          size="small"
        />
      </Box>
    </Paper>
  );
};

export default GeminiChatWindow;
