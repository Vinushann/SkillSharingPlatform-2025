import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Typography,
  Divider,
} from "@mui/material";

const CreatePlanForm = ({ onFormDataChange }) => {
  const [mainTitle, setMainTitle] = useState("");
  const [subtopics, setSubtopics] = useState([
    { name: "", duration: "", resource: "", completed: false },
    { name: "", duration: "", resource: "", completed: false },
    { name: "", duration: "", resource: "", completed: false },
    { name: "", duration: "", resource: "", completed: false },
  ]);

  useEffect(() => {
    const payload = {
      mainTitle,
      sub1Name: subtopics[0].name,
      sub1Duration: subtopics[0].duration,
      sub1Resource: subtopics[0].resource,
      sub1Completed: subtopics[0].completed,

      sub2Name: subtopics[1].name,
      sub2Duration: subtopics[1].duration,
      sub2Resource: subtopics[1].resource,
      sub2Completed: subtopics[1].completed,

      sub3Name: subtopics[2].name,
      sub3Duration: subtopics[2].duration,
      sub3Resource: subtopics[2].resource,
      sub3Completed: subtopics[2].completed,

      sub4Name: subtopics[3].name,
      sub4Duration: subtopics[3].duration,
      sub4Resource: subtopics[3].resource,
      sub4Completed: subtopics[3].completed,
    };
    onFormDataChange(payload);
  }, [mainTitle, subtopics, onFormDataChange]);

  const handleSubtopicChange = (index, field, value) => {
    const updated = [...subtopics];
    updated[index][field] = value;
    setSubtopics(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      mainTitle,
      sub1Name: subtopics[0].name,
      sub1Duration: subtopics[0].duration,
      sub1Resource: subtopics[0].resource,
      sub1Completed: subtopics[0].completed,

      sub2Name: subtopics[1].name,
      sub2Duration: subtopics[1].duration,
      sub2Resource: subtopics[1].resource,
      sub2Completed: subtopics[1].completed,

      sub3Name: subtopics[2].name,
      sub3Duration: subtopics[2].duration,
      sub3Resource: subtopics[2].resource,
      sub3Completed: subtopics[2].completed,

      sub4Name: subtopics[3].name,
      sub4Duration: subtopics[3].duration,
      sub4Resource: subtopics[3].resource,
      sub4Completed: subtopics[3].completed,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/plans",
        payload
      );
      alert("Plan submitted successfully!");
    } catch (error) {
      console.error("Error submitting plan:", error);
      alert("Failed to submit plan.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Main Title"
        fullWidth
        sx={{ mb: 3 }}
        value={mainTitle}
        onChange={(e) => setMainTitle(e.target.value)}
      />

      {subtopics.map((sub, i) => (
        <Box key={i} sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Subtopic {i + 1}
          </Typography>

          <TextField
            label="Subtopic Name"
            fullWidth
            sx={{ mb: 2 }}
            value={sub.name}
            onChange={(e) => handleSubtopicChange(i, "name", e.target.value)}
          />

          <TextField
            label="Duration"
            fullWidth
            sx={{ mb: 2 }}
            value={sub.duration}
            onChange={(e) =>
              handleSubtopicChange(i, "duration", e.target.value)
            }
          />

          <TextField
            label="YouTube Link"
            fullWidth
            sx={{ mb: 2 }}
            value={sub.resource}
            onChange={(e) =>
              handleSubtopicChange(i, "resource", e.target.value)
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={sub.completed}
                onChange={(e) =>
                  handleSubtopicChange(i, "completed", e.target.checked)
                }
              />
            }
            label="Mark as Completed"
          />

          {i < 3 && <Divider sx={{ mt: 3 }} />}
        </Box>
      ))}

      <Button type="submit" variant="contained" color="success">
        Submit Plan
      </Button>
    </Box>
  );
};

export default CreatePlanForm;
