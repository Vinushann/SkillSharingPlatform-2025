import React, { useState } from "react";
import { Box, Container, Tabs, Tab, Typography } from "@mui/material";
import CreatePlanForm from "./CreatePlanForm";
import UseTemplate from "./UseTemplate";
import PreviewPlanSub from "./PreviewPlanSub";

// ✅ Define the type for planData (should match CreatePlanForm payload)
interface PlanData {
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

const CreatePlanRoot: React.FC = () => {
  // 🔁 Track which tab is active (0: Create, 1: Template)
  const [tab, setTab] = useState<number>(0);

  // 📦 Shared plan data between form/template and preview
  const [planData, setPlanData] = useState<PlanData | null>(null);

  // 🔄 Handle tab switching
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
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
