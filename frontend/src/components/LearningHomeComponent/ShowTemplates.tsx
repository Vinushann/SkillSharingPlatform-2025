import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import learningPlans from "./learningPlans";

interface Subtopic {
  name: string;
  description: string;
  duration: string;
  resource: string;
  goals: string;
  exercises: string;
  completed: boolean;
}

interface LearningPlan {
  title: string;
  duration: string;
  subtopics: {
    name: string;
    description: string;
    duration: string;
    resource: string;
    clicked: boolean;
  }[];
}

const ShowTemplates: React.FC = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);
  const [mainTitle, setMainTitle] = useState<string>("");
  const [subtopic, setSubtopic] = useState<Subtopic>({
    name: "",
    description: "",
    duration: "",
    resource: "",
    goals: "",
    exercises: "",
    completed: false,
  });

  const [selectedPlan, setSelectedPlan] = useState<LearningPlan | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:8080/api/plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        console.error("Failed to fetch plans:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleUsePlan = (plan: LearningPlan): void => {
    setSelectedPlan(plan);
    setMainTitle(plan.title);
    // Type assertion to handle the different structure between LearningPlan subtopics and Subtopic
    const firstSubtopic = {
      name: plan.subtopics[0].name,
      description: plan.subtopics[0].description,
      duration: plan.subtopics[0].duration,
      resource: plan.subtopics[0].resource,
      goals: "",
      exercises: "",
      completed: false,
    };
    setSubtopic(firstSubtopic);
    setOpenDialog(true);
  };

  const handleSnackbarClose = (): void => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
  };

  return (
    <div>
      <Grid container spacing={3}>
        {learningPlans && Array.isArray(learningPlans) ? (
          learningPlans.map((plan, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 3,
                  borderRadius: 3,
                  background: "#ffffff",
                  minHeight: "120px",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "#1a237e" }}
                  >
                    {plan.title}
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {plan.subtopics.map((sub, i) => (
                      <Chip
                        key={i}
                        label={sub.name}
                        size="small"
                        sx={{
                          backgroundColor: "#e8eaf6",
                          color: "#3f51b5",
                          fontWeight: "medium",
                          borderRadius: 1,
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ color: "#546e7a", mt: 1 }}>
                    Duration: {plan.duration}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#3f51b5",
                    "&:hover": { backgroundColor: "#303f9f" },
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                  onClick={() => handleUsePlan(plan)}
                >
                  Use Plan
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography color="error">
            Error: Learning plans data is not available.
          </Typography>
        )}
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ShowTemplates;
