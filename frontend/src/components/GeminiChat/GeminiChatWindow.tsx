import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { sendGeminiMessage } from "./geminiService"; // Assume this is an API service function

// Define the Message interface for type safety
interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

// Define props interface for the component
interface GeminiChatWindowProps {
  onClose: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const GeminiChatWindow: React.FC<GeminiChatWindowProps> = ({
  onClose,
  isLoading,
  setIsLoading,
}) => {
  // State for user input and chat messages
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Ref for scrolling to the bottom of the message list
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message to the Gemini AI
  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMsg: Message = {
      role: "user",
      parts: [{ text: input }],
    };

    // Add user message to the chat and clear input
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the API to get the AI response
      const replyText = await sendGeminiMessage([...messages, userMsg]);
      const botReply: Message = {
        role: "model",
        parts: [{ text: replyText }],
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      // Handle API errors gracefully
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "❌ Gemini failed to respond." }],
        },
      ]);
    } finally {
      setIsLoading(false);
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
      {/* Header */}
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
        <IconButton
          onClick={onClose}
          sx={{ color: "white" }}
          aria-label="Close chat"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Message Area */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, bgcolor: "#f5f5f5" }}>
        {messages.map((msg, idx) => (
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
              <Typography variant="body2">{msg.parts[0].text}</Typography>
            </Box>
          </Box>
        ))}
        {isLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{ p: 1.5, borderTop: "1px solid #ddd", display: "flex", gap: 1 }}
      >
        <TextField
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          size="small"
          aria-label="Chat input"
        />
        <IconButton
          onClick={handleSend}
          sx={{
            backgroundColor: "#3f51b5",
            color: "#fff",
            borderRadius: 1,
            px: 2,
            "&:hover": { backgroundColor: "#303f9f" },
          }}
          aria-label="Send message"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default GeminiChatWindow;