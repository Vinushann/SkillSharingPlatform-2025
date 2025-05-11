import React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import LearningHomePage from "./pages/LearningHomePage";

// theme - 1
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import CreatePlanRoot from "./components/HandlePlanSection/CreatePlanRoot";

const App = () => {
  // theme - 2
  const theme = createTheme({
    palette: {
      primary: {
        main: "#4caf50", // 💚 Your custom primary color
      },
      secondary: {
        main: "#f50057", // Optional
      },
    },
  });

  return (
    // theme - 3
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/learning" element={<LearningHomePage />} />
            <Route path="/create" element={<CreatePlanRoot />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
