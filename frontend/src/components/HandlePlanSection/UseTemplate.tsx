import React, { useState } from "react";
import { Box, Paper, Typography, Chip, Button } from "@mui/material";
import templatePlans from "./templatePlans";

// ✅ Types
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

interface FlattenedPayload {
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
}

interface UseTemplateProps {
  onTemplateSelect: (payload: FlattenedPayload) => void;
}

const UseTemplate: React.FC<UseTemplateProps> = ({ onTemplateSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState<TemplatePlan | null>(null);

  const handleSelect = (plan: TemplatePlan) => {
    const payload: FlattenedPayload = {
      mainTitle: plan.mainTitle,
      ...plan.subtopics.reduce((acc: any, sub, idx) => {
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
      {templatePlans.map((plan: TemplatePlan, index: number) => (
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
              {plan.subtopics
                .map((sub) => sub.duration)
                .filter(Boolean)
                .join(", ")}
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