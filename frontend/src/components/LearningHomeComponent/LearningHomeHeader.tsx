import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import ShowTemplates from "./ShowTemplates";
import CreatePlan from "./CreatePlan";

const LearningHomeHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 6,
          p: 4,
          borderRadius: 3,
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
        </Box>

        <Box sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#3949ab", fontStyle: "italic" }}
          >
            Inspire others with your progress and goals.
          </Typography>

          <Button
            onClick={() => navigate("/create")}
            variant="contained"
            size="large"
            color="secondary"
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
        </Box>
      </Box>
    </div>
  );
};

export default LearningHomeHeader;