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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);

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

  const handleStartTimer = useCallback((minutes: number) => {
    const duration = minutes * 60;
    setSelectedTime(minutes);
    setTimeLeft(duration);
    setIsTimerRunning(true);
    setIsLocked(false);
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.repeat) return;
      if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        return;
      }
      const key = event.key.toLowerCase();
      if (key === "s") {
        navigate("/create");
      } else if (key === "t" && !isTimerRunning) {
        handleStartTimer(selectedTime);
      } else if (key === "g") {
        setShowChatWindow(true);
      } else if (event.metaKey && event.key === "/") {
        event.preventDefault();
        setShowShortcutsDialog(true);
      }
    },
    [navigate, handleStartTimer, selectedTime, isTimerRunning]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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

  // Define key symbols for graphical representation
  const keySymbols = {
    cmd: "⌘",
    shift: "⇧",
    ctrl: "⌃",
    alt: "⌥",
    backspace: "⌫",
    esc: "⎋",
  };

  // List of shortcuts, including existing ones and fake ones
  const shortcuts = [
    // Existing shortcuts from the code
    { action: "Start Learning", keys: ["s"] },
    { action: "Start Timer", keys: ["t"] },
    ,
    // Shortcuts from the image
    { action: "Talk to SkillZen AI", keys: ["g"] },
    { action: "Focus chat input", keys: ["shift", "esc"] },
    { action: "Show shortcuts", keys: ["cmd", "/"] },
  ];

  // Component to display key combinations as chips
  const KeyCombination = ({ keys }: { keys: string[] }) => (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {keys.map((key, index) => {
        const label =
          keySymbols[key] ||
          (key.length === 1 && /[a-z]/i.test(key) ? key.toUpperCase() : key);
        return (
          <Chip
            key={index}
            label={label}
            size="small"
            variant="outlined"
            sx={{ color: "#e0e0e0", borderColor: "#e0e0e0" }}
          />
        );
      })}
    </Box>
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

      {/* Shortcuts Dialog */}
      <Dialog
        open={showShortcutsDialog}
        onClose={() => setShowShortcutsDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "#e0e0e0",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: 2,
            position: "relative",
          }}
        >
          Keyboard shortcuts
          <IconButton
            aria-label="close"
            onClick={() => setShowShortcutsDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "#e0e0e0" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
            }}
          >
            {shortcuts.map((shortcut, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>{shortcut.action}</Typography>
                <KeyCombination keys={shortcut.keys} />
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningHomeHeader;
