import React, { useState } from "react";
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
  Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// 👇 Functional component for Learning Home Page
const LearningHomePage = () => {
  // --- STATE HOOKS ---
  const [openDialog, setOpenDialog] = useState(false); // controls dialog open/close
  const [tab, setTab] = useState(0); // tab index: 0 = Template, 1 = Create One
  const [mainTitle, setMainTitle] = useState(""); // title of the custom plan
  const [subTopics, setSubTopics] = useState([
    // list of subtopics added dynamically
    { id: 1, name: "", description: "", duration: "", resource: "" }
  ]);
  const [showPreview, setShowPreview] = useState(false); // toggles preview mode

  // --- EVENT HANDLERS ---

  // Tab switch handler
  const handleTabChange = (_, newValue) => setTab(newValue);

  // Adds a new subtopic block to the form
  const addSubTopic = () => {
    setSubTopics([
      ...subTopics,
      { id: subTopics.length + 1, name: "", description: "", duration: "", resource: "" }
    ]);
  };

  // Removes a subtopic by ID
  const removeSubTopic = (id) => {
    setSubTopics(subTopics.filter(topic => topic.id !== id));
  };

  // Updates a field in a specific subtopic
  const handleInputChange = (id, field, value) => {
    const updated = subTopics.map(topic =>
      topic.id === id ? { ...topic, [field]: value } : topic
    );
    setSubTopics(updated);
  };

  // --- TEMPORARY HARDCODED TEMPLATE DATA ---
  const templates = [
    {
      title: "Frontend Development Learning",
      topics: ["HTML", "CSS", "React"],
      duration: "3 weeks"
    },
    {
      title: "AI for Starters",
      topics: ["Python", "Numpy", "Pandas"],
      duration: "4 weeks"
    },
    {
      title: "DevOps Essentials",
      topics: ["Git", "Docker", "CI/CD"],
      duration: "2 weeks"
    },
    {
      title: "UI/UX Crash Course",
      topics: ["Figma", "Design Systems", "Accessibility"],
      duration: "2 weeks"
    }
  ];

  // --- MAIN RETURN BLOCK ---
  return (
    <Box sx={{ maxWidth: "1000px", mx: "auto", mt: 8, px: 3 }}>
      {/* Header with Title and CTA button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 6
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Time to share your learning progress!
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mt={2}>
            Let the world know what you're working on.
          </Typography>
        </Box>

        {/* Dialog trigger */}
        <Button variant="contained" size="large" sx={{ height: "48px" }} onClick={() => setOpenDialog(true)}>
          Initiate
        </Button>
      </Box>

      {/* Dialog Modal */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>{showPreview ? "Preview Learning Plan" : "Select or Create a Learning Plan"}</DialogTitle>
        <DialogContent>

          {/* IF NOT IN PREVIEW MODE */}
          {!showPreview ? (
            <>
              {/* Tab Section */}
              <Tabs value={tab} onChange={handleTabChange} centered>
                <Tab label="Template" />
                <Tab label="Create One" />
              </Tabs>

              <Box mt={4}>
                {/* === Template Tab === */}
                {tab === 0 && (
                  <Box display="flex" flexDirection="column" gap={3}>
                    {templates.map((plan, idx) => (
                      <Paper
                        key={idx}
                        elevation={3}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 3,
                          borderRadius: 3,
                          backgroundColor: "#f4f4f4"
                        }}
                      >
                        <Box>
                          <Typography variant="h6" fontWeight="bold">{plan.title}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Topics: {plan.topics.join(", ")}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Duration: {plan.duration}
                          </Typography>
                        </Box>
                        <Button variant="contained" color="primary">use</Button>
                      </Paper>
                    ))}
                  </Box>
                )}

                {/* === Create Tab === */}
                {tab === 1 && (
                  <Box mt={3}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>Create your journey</Typography>

                    {/* Main Title Field */}
                    <TextField
                      label="Main Title"
                      variant="filled"
                      fullWidth
                      sx={{ backgroundColor: '#eee', borderRadius: 1, mb: 3 }}
                      value={mainTitle}
                      onChange={(e) => setMainTitle(e.target.value)}
                    />

                    {/* Subtopic Input Blocks */}
                    {subTopics.map((topic, index) => (
                      <Paper key={topic.id} elevation={1} sx={{ p: 3, backgroundColor: '#eee', borderRadius: 2, mb: 2 }}>
                        {/* Subtopic Name with Delete Icon */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <TextField
                            label="Sub topic name"
                            value={topic.name}
                            onChange={(e) => handleInputChange(topic.id, 'name', e.target.value)}
                            fullWidth
                          />
                          {subTopics.length > 1 && (
                            <IconButton onClick={() => removeSubTopic(topic.id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>

                        {/* Subtopic Details */}
                        <Box display="flex" flexDirection="column" gap={2} mt={2}>
                          <TextField
                            label="Description"
                            multiline
                            rows={3}
                            fullWidth
                            value={topic.description}
                            onChange={(e) => handleInputChange(topic.id, 'description', e.target.value)}
                          />
                          <TextField
                            label="Duration (in days)"
                            type="number"
                            fullWidth
                            value={topic.duration}
                            onChange={(e) => handleInputChange(topic.id, 'duration', e.target.value)}
                          />
                          <TextField
                            label="Resource (YouTube/Article URL)"
                            fullWidth
                            value={topic.resource}
                            onChange={(e) => handleInputChange(topic.id, 'resource', e.target.value)}
                          />
                        </Box>
                      </Paper>
                    ))}

                    {/* Add + Preview Buttons */}
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Button variant="outlined" onClick={() => setShowPreview(true)}>Preview</Button>
                      <Button variant="contained" onClick={addSubTopic}>Add Subtopics</Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            // === PREVIEW MODE ===
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {mainTitle || "Untitled Plan"}
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Preview Each Subtopic */}
              {subTopics.map((topic, idx) => (
                <Box key={idx} mb={3}>
                  <Typography variant="h6">### {topic.name || `Sub topic ${idx + 1}`}</Typography>
                  <Typography color="textSecondary" mt={1}>{topic.description}</Typography>
                  <Typography mt={1}><strong>Duration:</strong> {topic.duration} days</Typography>

                  {/* Resource Preview (iframe for YouTube) */}
                  {topic.resource && (
                    <Box mt={2}>
                      <Typography variant="subtitle2">Resource:</Typography>
                      <iframe
                        width="100%"
                        height="200"
                        src={topic.resource.replace("watch?v=", "embed/")}
                        title={`resource-${idx}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </Box>
                  )}
                  <Divider sx={{ mt: 3 }} />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>

        {/* Dialog Footer Buttons */}
        <DialogActions>
          {showPreview ? (
            <Button onClick={() => setShowPreview(false)} color="primary">Back to Edit</Button>
          ) : (
            <Button onClick={() => setOpenDialog(false)} color="error">Close</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LearningHomePage;
