// src/pages/PostsPage.jsx
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import PostCard from "../components/PostCard";

const fetchPosts = async () => {
  return [
    {
      id: 1,
      userId: 1,
      title: "Learn Java Programming",
      content: "A comprehensive guide to Java programming.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: 2,
      title: "Advanced Spring Boot Tips",
      content: "Tips for better Spring Boot applications.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const userId = 1;

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    loadPosts();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        All Posts
      </Typography>
      {posts.length === 0 ? (
        <Typography>No posts available.</Typography>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} userId={userId} />
        ))
      )}
    </div>
  );
};

export default PostsPage;
