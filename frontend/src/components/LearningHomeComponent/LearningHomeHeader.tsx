import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import FloatingChatButton from "../GeminiChat/FloatingChatButton";
import GeminiChatWindow from "../GeminiChat/GeminiChatWindow";
import { sendGeminiMessage } from "../GeminiChat/geminiService";

const LearningHomeHeader: React.FC = () => {
  const navigate = useNavigate();

  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [selectedTime, setSelectedTime] = useState<number>(20);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setIsLocked(true);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const handleStartTimer = (minutes: number) => {
    const duration = minutes * 60;

    setSelectedTime(minutes);
    setTimeLeft(duration);
    setIsTimerRunning(true);
    setIsLocked(false);
  };

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
      {isLocked && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Typography variant="h4" color="white" textAlign="center">
            Time's up! Please close the tab to exit.
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 6,
          p: 4,
          borderRadius: 3,
          position: "relative",
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

      {/* Timer Panel */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          left: 20,
          backgroundColor: "white",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1.5,
          width: 220,
          zIndex: 1000,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#1a237e", fontWeight: "bold" }}
        >
          Time: {formatTime(timeLeft)}
        </Typography>

        <FormControl fullWidth size="small">
          <InputLabel id="time-select-label">Select Time</InputLabel>
          <Select
            labelId="time-select-label"
            value={selectedTime}
            label="Select Time"
            onChange={(e: SelectChangeEvent<number>) =>
              setSelectedTime(Number(e.target.value))
            }
            disabled={isTimerRunning}
          >
            <MenuItem value={5}>5 Minutes</MenuItem>
            <MenuItem value={10}>10 Minutes</MenuItem>
            <MenuItem value={15}>15 Minutes</MenuItem>
            <MenuItem value={20}>20 Minutes</MenuItem>
            <MenuItem value={30}>30 Minutes</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleStartTimer(selectedTime)}
          disabled={isTimerRunning}
          sx={{ alignSelf: "stretch", borderRadius: 1 }}
        >
          Start
        </Button>
      </Box>

      {/* Chat */}
      <FloatingChatButton onClick={() => setShowChatWindow((prev) => !prev)} />
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
