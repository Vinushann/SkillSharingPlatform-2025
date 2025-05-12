// src/components/UseTemplate.tsx
import React, { useState } from "react";
import { Box, Paper, Typography, Chip, Button, Divider } from "@mui/material";
import templatePlans from "./templatePlans";

// Define interfaces for component props and data structures
interface Subtopic {
  name: string;
  duration: string;
  resource: string;
  completed: boolean;
}

interface TemplatePlan {
  mainTitle: string;
  subtopics: Subtopic[];
}

interface PlanPayload {
  mainTitle: string;
  sub1Name: string;
  sub1Duration: string;
  sub1Resource: string;
  sub1Completed: boolean;
  sub2Name: string;
  sub2Duration: string;
  sub2Resource: string;
  sub2Completed: boolean;
  sub3Name: string;
  sub3Duration: string;
  sub3Resource: string;
  sub3Completed: boolean;
  sub4Name: string;
  sub4Duration: string;
  sub4Resource: string;
  sub4Completed: boolean;
  [key: string]: string | boolean; // Index signature for dynamic property access
}

interface UseTemplateProps {
  onTemplateSelect: (data: PlanPayload) => void;
}

const UseTemplate: React.FC<UseTemplateProps> = ({ onTemplateSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState<TemplatePlan | null>(null);

  const handleSelect = (plan: TemplatePlan): void => {
    // Create a base payload with default values for all required fields
    const basePayload: Partial<PlanPayload> = {
      mainTitle: plan.mainTitle,
    };
    
    // Initialize all subtopic fields with default empty values
    for (let i = 1; i <= 4; i++) {
      basePayload[`sub${i}Name`] = '';
      basePayload[`sub${i}Duration`] = '';
      basePayload[`sub${i}Resource`] = '';
      basePayload[`sub${i}Completed`] = false;
    }
    
    // Override with actual values from the template
    plan.subtopics.forEach((sub, idx) => {
      const i = idx + 1;
      if (i <= 4) { // Ensure we don't exceed the 4 subtopics limit
        basePayload[`sub${i}Name`] = sub.name;
        basePayload[`sub${i}Duration`] = sub.duration;
        basePayload[`sub${i}Resource`] = sub.resource;
        basePayload[`sub${i}Completed`] = sub.completed;
      }
    });

    // Cast to full PlanPayload type
    const payload = basePayload as PlanPayload;
    
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
