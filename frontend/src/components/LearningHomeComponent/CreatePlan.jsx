import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import learningPlans from "./learningPlans";
import ShowTemplates from "./ShowTemplates";

const CreatePlan = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tab, setTab] = useState(0);
  const [mainTitle, setMainTitle] = useState("");
  const [subtopic, setSubtopic] = useState({
    name: "",
    description: "",
    duration: "",
    resource: "",
    goals: "",
    exercises: "",
    completed: false,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [errors, setErrors] = useState({});
  const [plans, setPlans] = useState([]); // State to store retrieved plans
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for success alert
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message for success alert

  // Fetch plans when the component mounts
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
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

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setSelectedPlan(null); // Reset selected plan when switching tabs
    setShowPreview(false); // Reset preview mode
    setErrors({}); // Clear errors
  };

  const handleInputChange = (field, value) => {
    setSubtopic((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if it now has a value
    if (value) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handlePostPlan = async () => {
    // Validate the form if creating a custom plan
    if (!selectedPlan && !validateForm()) return;

    // Prepare the plan data based on whether it's a template plan or a custom plan
    const planData = selectedPlan
      ? {
          planTitle: selectedPlan.title,
          subtopicName: selectedPlan.subtopics[0].name, // Use the first subtopic
          description: selectedPlan.subtopics[0].description,
          duration: selectedPlan.subtopics[0].duration,
          resources: selectedPlan.subtopics[0].resource,
          goals: selectedPlan.subtopics[0].goals,
          exercises: selectedPlan.subtopics[0].exercises,
          markAsCompleted: false, // Default for template plans
        }
      : {
          planTitle: mainTitle,
          subtopicName: subtopic.name,
          description: subtopic.description,
          duration: subtopic.duration,
          resources: subtopic.resource,
          goals: subtopic.goals,
          exercises: subtopic.exercises,
          markAsCompleted: subtopic.completed,
        };

    try {
      const response = await fetch("http://localhost:8080/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        setSnackbarMessage("Plan posted successfully!");
        setOpenSnackbar(true);
        setOpenDialog(false);
        setShowPreview(false);
        setMainTitle("");
        setSubtopic({
          name: "",
          description: "",
          duration: "",
          resource: "",
          goals: "",
          exercises: "",
          completed: false,
        });
        setSelectedPlan(null);
        setErrors({});
        fetchPlans(); // Refresh the plans list after posting
      } else {
        console.error("Failed to post plan:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting plan:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate main title
    if (!mainTitle.trim()) {
      newErrors.mainTitle = "Plan title is required";
      isValid = false;
    }

    // Validate subtopic fields
    const fields = [
      "name",
      "description",
      "duration",
      "resource",
      "goals",
      "exercises",
    ];
    fields.forEach((field) => {
      if (!subtopic[field].trim()) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handlePreviewClick = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
  };
  return (
    <div>
      <Box>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "#1a237e", mb: 3 }}
        >
          Craft Your Learning Journey
        </Typography>
        <TextField
          label="Plan Title"
          variant="outlined"
          fullWidth
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#f5f7fa",
            },
          }}
          value={mainTitle}
          onChange={(e) => {
            setMainTitle(e.target.value);
            if (e.target.value) {
              setErrors((prev) => ({ ...prev, mainTitle: "" }));
            }
          }}
          error={!!errors.mainTitle}
          helperText={errors.mainTitle}
        />
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            backgroundColor: "#fafafa",
          }}
        >
          <TextField
            label="Subtopic Name"
            variant="outlined"
            value={subtopic.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
            error={!!errors.name}
            helperText={errors.name}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={3}
                fullWidth
                value={subtopic.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration (e.g., 5 days)"
                variant="outlined"
                fullWidth
                value={subtopic.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
                error={!!errors.duration}
                helperText={errors.duration}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Resource (YouTube/Article URL)"
                variant="outlined"
                fullWidth
                value={subtopic.resource}
                onChange={(e) => handleInputChange("resource", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
                error={!!errors.resource}
                helperText={errors.resource}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Goals"
                variant="outlined"
                multiline
                rows={2}
                fullWidth
                value={subtopic.goals}
                onChange={(e) => handleInputChange("goals", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
                error={!!errors.goals}
                helperText={errors.goals}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Exercises"
                variant="outlined"
                multiline
                rows={2}
                fullWidth
                value={subtopic.exercises}
                onChange={(e) => handleInputChange("exercises", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
                error={!!errors.exercises}
                helperText={errors.exercises}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={subtopic.completed}
                    onChange={(e) =>
                      handleInputChange("completed", e.target.checked)
                    }
                    sx={{
                      color: "#3f51b5",
                      "&.Mui-checked": { color: "#3f51b5" },
                    }}
                  />
                }
                label="Mark as Completed"
                sx={{ color: "#37474f" }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#3f51b5",
              color: "#3f51b5",
              borderRadius: 2,
              px: 4,
              "&:hover": {
                borderColor: "#303f9f",
                color: "#303f9f",
              },
            }}
            onClick={handlePreviewClick}
          >
            Preview Plan
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" },
              borderRadius: 2,
              px: 4,
            }}
            onClick={handlePostPlan}
          >
            Post Plan
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default CreatePlan;
