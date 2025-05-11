import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip
} from "@mui/material";
import axios from "axios";

const SearchPlanDialog = ({ open, onClose, selectedTitle }) => {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (selectedTitle) {
      axios.get("http://localhost:8080/api/plans").then((res) => {
        const matched = res.data.find((p) => p.mainTitle === selectedTitle);
        setPlan(matched);
      });
    }
  }, [selectedTitle]);

  const handleUseTemplate = async () => {
    if (!plan) return;
    try {
      await axios.post("http://localhost:8080/api/plans", plan);
      alert("Template saved successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to store template:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Template: {selectedTitle}</DialogTitle>
      <DialogContent>
        {plan ? (
          <Box>
            {[1, 2, 3, 4].map((i) => {
              const name = plan[`sub${i}Name`];
              const duration = plan[`sub${i}Duration`];
              const resource = plan[`sub${i}Resource`];
              const completed = plan[`sub${i}Completed`];
              if (!name) return null;
              const videoId = (resource || "").split("v=")[1]?.split("&")[0];

              return (
                <Box key={i} mb={3}>
                  <Typography fontWeight="bold">
                    Subtopic {i}: {name} ({duration})
                  </Typography>
                  <iframe
                    width="100%"
                    height="150"
                    style={{ borderRadius: "8px", marginTop: 8 }}
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <Chip
                    label={completed ? "Completed" : "Not Completed"}
                    color={completed ? "success" : "warning"}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Divider sx={{ mt: 2 }} />
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUseTemplate} variant="contained" color="primary">
          Use This Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchPlanDialog;
