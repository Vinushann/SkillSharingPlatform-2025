// src/components/UseTemplate.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, Chip, Button, Divider } from "@mui/material";
import templatePlans from "./templatePlans";

const UseTemplate = ({ onTemplateSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelect = (plan) => {
    // 🔁 Map template format to flat preview format for shared PreviewPlanSub
    const payload = {
      mainTitle: plan.mainTitle,
      ...plan.subtopics.reduce((acc, sub, idx) => {
        const i = idx + 1;
        acc[`sub${i}Name`] = sub.name;
        acc[`sub${i}Duration`] = sub.duration;
        acc[`sub${i}Resource`] = sub.resource;
        acc[`sub${i}Completed`] = sub.completed;
        return acc;
      }, {}),
    };

    setSelectedPlan(plan);
    onTemplateSelect(payload);
  };

  return (
    <Box>
      {templatePlans.map((plan, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {plan.mainTitle}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
              {plan.subtopics.map((sub, i) => (
                <Chip
                  key={i}
                  label={sub.name}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>

            <Typography variant="body2">
              Duration:{" "}
              {plan.subtopics.reduce(
                (acc, cur, i) => acc + (i > 0 ? ", " : "") + cur.duration,
                ""
              )}
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => handleSelect(plan)}
            sx={{ textTransform: "uppercase", fontWeight: "bold" }}
          >
            Use Plan
          </Button>
        </Paper>
      ))}
    </Box>
  );
};

export default UseTemplate;
