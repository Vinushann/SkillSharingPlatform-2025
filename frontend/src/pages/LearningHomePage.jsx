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
  Divider,
  Chip,
  Grid,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Container,
  Alert,
} from "@mui/material";

import LearningHomeHeader from "../components/LearningHomeComponent/LearningHomeHeader";
import ViewPlans from "../components/HandlePlanSection/ViewPlans";

const LearningHomePage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <LearningHomeHeader />
      <ViewPlans />
    /</Container>
  );
};

export default LearningHomePage;
