import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import LearningHomePage from "./pages/LearningHomePage";
import PostCard from "./components/PostCard";
import PostsPage from "./pages/PostsPage";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/learning" element={<LearningHomePage />} />
          <Route path="/posts" element={<PostsPage/>} />
          <Route path="/post/:id" element={<PostsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;