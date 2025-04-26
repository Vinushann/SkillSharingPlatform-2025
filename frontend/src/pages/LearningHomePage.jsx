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
  IconButton,
  Divider,
  Chip,
  Grid,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import learningPlans from "../components/learningPlans";
import LearningPost from "../components/LearningPost";

const LearningHomePage = () => {
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
    completed: false
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
    setSubtopic(prev => ({ ...prev, [field]: value }));

    // Clear error for this field if it now has a value
    if (value) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleUsePlan = (plan) => {
    setSelectedPlan(plan);
    setShowPreview(true);
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
          markAsCompleted: false // Default for template plans
        }
      : {
          planTitle: mainTitle,
          subtopicName: subtopic.name,
          description: subtopic.description,
          duration: subtopic.duration,
          resources: subtopic.resource,
          goals: subtopic.goals,
          exercises: subtopic.exercises,
          markAsCompleted: subtopic.completed
        };

    try {
      const response = await fetch("http://localhost:8080/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData)
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
          completed: false
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
    const fields = ["name", "description", "duration", "resource", "goals", "exercises"];
    fields.forEach(field => {
      if (!subtopic[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
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
    <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 6, px: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 6,
          p: 4,
          boxShadow: 3,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(255, 0, 0, 0.1)"
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
        </Box>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#3f51b5",
            "&:hover": { backgroundColor: "#303f9f" },
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: "bold"
          }}
          onClick={() => setOpenDialog(true)}
        >
          Start Learning
        </Button>
        <LearningPost />
      </Box>

      {/* Display Retrieved Plans as Cards */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "#1a237e", mb: 3 }}
        >
          Your Learning Plans
        </Typography>
        <Grid container spacing={3}>
          {plans.length > 0 ? (
            plans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#e0e0e0",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: "#1a237e", mb: 1 }}
                  >
                    {plan.planTitle}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" sx={{ color: "#37474f", mb: 1 }}>
                    <strong>Subtopic:</strong> {plan.subtopicName}
                  </Typography>
                  <Typography sx={{ color: "#37474f", mb: 1 }}>
                    <strong>Description:</strong> {plan.description}
                  </Typography>
                  <Typography sx={{ color: "#546e7a", mb: 1 }}>
                    <strong>Duration:</strong> {plan.duration}
                  </Typography>
                  <Typography sx={{ color: "#546e7a", mb: 1 }}>
                    <strong>Resources:</strong>{" "}
                    {plan.resources ? (
                      <a
                        href={plan.resources}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3f51b5", textDecoration: "underline" }}
                      >
                        {plan.resources}
                      </a>
                    ) : (
                      "Not specified"
                    )}
                  </Typography>
                  <Typography sx={{ color: "#546e7a", mb: 1 }}>
                    <strong>Goals:</strong> {plan.goals || "Not specified"}
                  </Typography>
                  <Typography sx={{ color: "#546e7a", mb: 1 }}>
                    <strong>Exercises:</strong> {plan.exercises || "Not specified"}
                  </Typography>
                  <Chip
                    label={plan.markAsCompleted ? "Completed" : "Not Completed"}
                    color={plan.markAsCompleted ? "success" : "default"}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: plan.markAsCompleted ? undefined : "#e8eaf6",
                      color: plan.markAsCompleted ? undefined : "#3f51b5",
                      fontWeight: "medium",
                    }}
                  />
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography sx={{ color: "#546e7a" }}>
              No learning plans yet. Create one to get started!
            </Typography>
          )}
        </Grid>
      </Box>

      {/* Dialog Modal */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            background: "#ffffff"
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#ffffff", color: "#1a237e", py: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            {showPreview
              ? (selectedPlan ? selectedPlan.title : mainTitle || "Untitled Plan")
              : "Select or Create a Plan"}
          </Typography>
          {showPreview && (
            <Typography variant="body2" sx={{ color: "#546e7a", mt: 1 }}>
              Total Duration: {selectedPlan
                ? selectedPlan.subtopics[0].duration
                : (parseInt(subtopic.duration) || 0) + " days"}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {!showPreview ? (
            <>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                centered
                sx={{
                  mb: 4,
                  "& .MuiTab-root": {
                    fontWeight: "bold",
                    color: "#3f51b5",
                    textTransform: "uppercase",
                    "&.Mui-selected": { color: "#1a237e" }
                  },
                  "& .MuiTabs-indicator": { backgroundColor: "#1a237e" }
                }}
              >
                <Tab label="Templates" />
                <Tab label="Create Your Own" />
              </Tabs>

              <Box>
                {tab === 0 && (
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
                                boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
                              }
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
                                      maxWidth: "150px", // Prevent chips from stretching too wide
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap"
                                    }}
                                  />
                                ))}
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ color: "#546e7a", mt: 1 }}
                              >
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
                                flexShrink: 0 // Prevent button from shrinking
                              }}
                              onClick={() => handleUsePlan(plan)}
                            >
                              Use Plan
                            </Button>
                          </Paper>
                        </Grid>
                      ))
                    ) : (
                      <Typography color="error">Error: Learning plans data is not available.</Typography>
                    )}
                  </Grid>
                )}

                {tab === 1 && (
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
                          backgroundColor: "#f5f7fa"
                        }
                      }}
                      value={mainTitle}
                      onChange={(e) => {
                        setMainTitle(e.target.value);
                        if (e.target.value) {
                          setErrors(prev => ({ ...prev, mainTitle: "" }));
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
                        backgroundColor: "#fafafa"
                      }}
                    >
                      <TextField
                        label="Subtopic Name"
                        variant="outlined"
                        value={subtopic.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        fullWidth
                        sx={{
                          mb: 2,
                          "& .MuiOutlinedInput-root": { borderRadius: 2 }
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
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 }
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
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 }
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
                            onChange={(e) => handleInputChange('resource', e.target.value)}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 }
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
                            onChange={(e) => handleInputChange('goals', e.target.value)}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 }
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
                            onChange={(e) => handleInputChange('exercises', e.target.value)}
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 }
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
                                onChange={(e) => handleInputChange('completed', e.target.checked)}
                                sx={{ color: "#3f51b5", '&.Mui-checked': { color: "#3f51b5" } }}
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
                          "&:hover": { borderColor: "#303f9f", color: "#303f9f" }
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
                          px: 4
                        }}
                        onClick={handlePostPlan}
                      >
                        Post Plan
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Box>
              {(selectedPlan ? selectedPlan.subtopics : [subtopic]).map((topic, idx) => (
                <Paper
                  key={idx}
                  elevation={2}
                  sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#1a237e", fontWeight: "bold" }}
                    >
                      {topic.name || `Subtopic ${idx + 1}`}
                    </Typography>
                    {!selectedPlan && (
                      <Chip
                        label={topic.completed ? "Completed" : "Not Completed"}
                        color={topic.completed ? "success" : "default"}
                        size="small"
                        sx={{ fontWeight: "medium" }}
                      />
                    )}
                  </Box>
                  <Typography sx={{ color: "#37474f", mb: 1 }}>
                    {topic.description}
                  </Typography>
                  <Typography sx={{ color: "#546e7a", mb: 1 }}>
                    <strong>Duration:</strong> {topic.duration}
                  </Typography>
                  <Typography sx={{ color: "#546e7a", mb: 1 }}>
                    <strong>Goals:</strong> {topic.goals || "Not specified"}
                  </Typography>
                  <Typography sx={{ color: "#546e7a", mb: 1 }}>
                    <strong>Exercises:</strong> {topic.exercises || "Not specified"}
                  </Typography>
                  {topic.resource && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" sx={{ color: "#3f51b5", mb: 1 }}>
                        Resource:
                      </Typography>
                      <a
                        href={topic.resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3f51b5", textDecoration: "underline" }}
                      >
                        {topic.resource}
                      </a>
                      {topic.resource.includes("youtube.com") && (
                        <Box mt={2}>
                          <iframe
                            width="100%"
                            height="200"
                            src={topic.resource.replace("watch?v=", "embed/")}
                            title={`resource-${idx}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ borderRadius: 8 }}
                          ></iframe>
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#fafafa" }}>
          {showPreview ? (
            <>
              <Button
                onClick={() => setShowPreview(false)}
                sx={{
                  color: "#3f51b5",
                  borderRadius: 2,
                  px: 4
                }}
              >
                Back to Edit
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#388e3c" },
                  borderRadius: 2,
                  px: 4
                }}
                onClick={handlePostPlan}
              >
                Post Plan
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{
                color: "#ef5350",
                borderRadius: 2,
                px: 4
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success Alert */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LearningHomePage;