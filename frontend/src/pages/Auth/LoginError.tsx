import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Link,
  Paper,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";

const sendSupportEmail = async (userMessage: string) => {
  try {
    const response = await fetch("/api/send-support-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "kavindyavishva@gmail.com",
        subject: "Login Error Inquiry",
        message: userMessage,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send support email");
    }
    return true;
  } catch (error) {
    console.error("Failed to send support email:", error);
    return false;
  }
};

const LoginError: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const message =
    queryParams.get("message") ||
    "Your account has been deactivated. If you did not press the deactivation button, please contact support.";

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null); // null = no message yet, true = sent, false = failed

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setSuccess(null);

    const sent = await sendSupportEmail(input.trim());

    setLoading(false);
    setSuccess(sent);
    if (sent) setInput("");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="80vh"
      bgcolor="#f9fafb"
      p={2}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" color="error" fontWeight="bold" gutterBottom>
          Login Error
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Please describe your issue below and we will get back to you shortly.
        </Typography>

        <TextField
          multiline
          minRows={4}
          maxRows={8}
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          fullWidth
          variant="outlined"
        />

        {loading && (
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <CircularProgress size={20} />
            <Typography variant="body2">Sending message...</Typography>
          </Box>
        )}

        {success === true && (
          <Alert severity="success" sx={{ mt: 1 }}>
            Your message has been sent! We will contact you soon.
          </Alert>
        )}

        {success === false && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Failed to send message. Please try again later.
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{ mt: 2 }}
        >
          Send Message
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Go to Home
        </Button>

        <Typography variant="body2" color="textSecondary" mt={1} textAlign="center">
          If you believe this is a mistake, please{" "}
          <Link href="mailto:kavindyavishva@gmail.com" underline="hover">
            contact support
          </Link>
          .
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginError;
