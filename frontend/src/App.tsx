import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePostForm from "./components/CreatePostForm";
import MyPosts from "./components/MyPosts";
import Home from "./pages/HomePage";
import { PostProvider } from "./context/PostContext";
import Navbar from "./components/Navigation/NavBar";
import LoginPage from "./pages/Auth/LoginPage";
import OAuth2RedirectHandler from "./pages/Auth/OAuth2RedirectHandler";
import ProfilePage from "./pages/User/ProfilePage";
import LearningPlansPage from "./pages/LearningPlans/LearningPlansPage";
import PostsPage from "./pages/Posts/PostsPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import FollowUserPage from "./pages/User/FollowUserPage";
import GoalsPage from "./pages/Goals/GoalsPage";
import CreatePlanRoot from "./components/HandlePlanSection/CreatePlanRoot";

import NoteTaking from "./components/Note/NoteTaking";
import LearningHomePage from "./pages/LearningHomePage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const App: React.FC = () => {
  const theme = createTheme({
    typography: {
      fontFamily: "'Source Sans Pro', sans-serif", // Apply Source Sans Pro font
      fontSize: 14, // base font size
      h1: {
        fontFamily: "'Source Sans Pro', sans-serif",
        fontWeight: 700,
      },
      body1: {
        fontSize: 16,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <PostProvider>
        <Router>
          <Navbar /> {/* 🆕 Use the Navbar */}
          <div className="pt-20">
            <Routes>
              {/* USER_MANAGEMENT_ROUTES */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/login/oauth2/code/google"
                element={<OAuth2RedirectHandler />}
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:id" element={<FollowUserPage />} />
              {/* APPLICATION_ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/all-posts" element={<PostsPage />} />
              {/* <Route path="/create" element={<CreatePostForm />} /> */}
              <Route path="/my-posts" element={<MyPosts />} />

              {/* LEARNING_PLAN_ROUTES */}
              <Route path="/learning-plans" element={<LearningPlansPage />} />
              <Route path="/learning" element={<LearningHomePage />} />
              <Route path="/create" element={<CreatePlanRoot />} />
              <Route path="/note" element={<NoteTaking />} />

              {/* BUY BOOKS */}
              <Route path="/buybook" element={<NoteTaking />} />

              {/* GOALS_ROUTES */}
              <Route path="/goals" element={<GoalsPage />} />
            </Routes>
          </div>
        </Router>
      </PostProvider>
    </ThemeProvider>
  );
};

export default App;
