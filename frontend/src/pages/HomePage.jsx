import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Container,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { Link } from "react-router-dom";

const HomePage = () => {
  // Mock data for activity feed
  const activities = [
    {
      user: "Alex",
      action: "started a new learning plan: Frontend Development",
      time: "2h ago",
    },
    { user: "Sara", action: "completed AI for Starters", time: "5h ago" },
    {
      user: "Mike",
      action: "shared a learning plan: DevOps Essentials",
      time: "1d ago",
    },
  ];

  // Mock data for follow suggestions
  const suggestions = [
    { name: "John Doe", role: "Frontend Developer" },
    { name: "Emily Smith", role: "Data Scientist" },
    { name: "Liam Brown", role: "DevOps Engineer" },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)",
          p: 6,
          borderRadius: 3,
          textAlign: "center",
          mb: 6,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ color: "#1a237e", mb: 2 }}
        >
          Welcome to Skill Share!
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#37474f", mb: 3, fontSize: "1.1rem" }}
        >
          Start your journey by creating or following a learning plan.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            component={Link}
            to="/learning"
            sx={{
              backgroundColor: "#3f51b5",
              "&:hover": { backgroundColor: "#303f9f" },
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: "bold",
            }}
          >
            Start Learning
          </Button>

          <IconButton
            sx={{
              backgroundColor: "#3f51b5",
              color: "white",
              "&:hover": { backgroundColor: "#303f9f" },
            }}
            onClick={() => alert("Share functionality coming soon!")} // Placeholder for share action
          >
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Activity Feed */}
        <Grid item xs={12} md={8}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "#1a237e", mb: 3 }}
          >
            Recent Activity
          </Typography>
          {activities.map((activity, idx) => (
            <Paper
              key={idx}
              elevation={2}
              sx={{
                p: 3,
                mb: 2,
                borderRadius: 3,
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "#3f51b5" }}>{activity.user[0]}</Avatar>
                <Box flexGrow={1}>
                  <Typography sx={{ color: "#37474f" }}>
                    <strong>{activity.user}</strong> {activity.action}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#546e7a" }}>
                    {activity.time}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Grid>

        {/* Follow Suggestions Sidebar */}
        <Grid item xs={12} md={4}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "#1a237e", mb: 3 }}
          >
            Who to Follow
          </Typography>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#ffffff",
              border: "1px solid #e0e0e0",
            }}
          >
            {suggestions.map((user, idx) => (
              <Box key={idx}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: "#3f51b5" }}>{user.name[0]}</Avatar>
                  <Box flexGrow={1}>
                    <Typography sx={{ color: "#37474f", fontWeight: "medium" }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#546e7a" }}>
                      {user.role}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "#3f51b5",
                      color: "#3f51b5",
                      borderRadius: 2,
                      "&:hover": { borderColor: "#303f9f", color: "#303f9f" },
                    }}
                    onClick={() =>
                      alert(`Follow ${user.name} functionality coming soon!`)
                    } // Placeholder
                  >
                    Follow
                  </Button>
                </Box>
                {idx < suggestions.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
