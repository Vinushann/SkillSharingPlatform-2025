import React from "react";
import { Box, Typography } from "@mui/material";

const HomePage = () => {
  return (
    <Box p={4}>
      <Typography variant="h3" fontWeight="bold">
        Welcome to Skill Share!
      </Typography>
      <Typography variant="body1" mt={2}>
        Start your journey by creating or following a learning plan.
      </Typography>
    </Box>
  );
};

export default HomePage;