import React, { useState } from "react";
import { Box, Container, Tabs, Tab, Typography } from "@mui/material";
import CreatePlanForm from "./CreatePlanForm";
import UseTemplate from "./UseTemplate";
import PreviewPlanSub from "./PreviewPlanSub";

const CreatePlanRoot = () => {
  // 🔁 Track which tab is active (0: Create, 1: Template)
  const [tab, setTab] = useState(0);

  // 📦 Shared plan data between form/template and preview
  const [planData, setPlanData] = useState(null);

  // 🔄 Handle tab switching
  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setPlanData(null); // Reset preview on tab switch
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Box display="flex">
        {/* 🧱 Left Section: Form + Template */}
        <Box flex={1} pr={2}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Start new learning journey
          </Typography>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="success"
            indicatorColor="success"
            sx={{ mb: 3 }}
          >
            <Tab label="CREATE PLAN" />
            <Tab label="USE TEMPLATE" />
          </Tabs>

          {tab === 0 && <CreatePlanForm onFormDataChange={setPlanData} />}
          {tab === 1 && <UseTemplate onTemplateSelect={setPlanData} />}
        </Box>

        {/* 🎯 Right Section: Live Preview */}
        <Box flex={1} pl={2}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
           Preview
          </Typography>
          <PreviewPlanSub planData={planData} />
        </Box>
      </Box>
    </Container>
  );
};

export default CreatePlanRoot;
