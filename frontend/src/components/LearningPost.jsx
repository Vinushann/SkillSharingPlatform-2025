import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import SaveIcon from "@mui/icons-material/Save";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReportIcon from "@mui/icons-material/Report";
import LinkIcon from "@mui/icons-material/Link";
import InfoIcon from "@mui/icons-material/Info";
import learningPlans from "../components/learningPlans"; // Import the learning plans data

const LearningPost = () => {
  // Add random usernames and profile images for each post
  const randomUserData = [
    { username: "Alex Smith", profileImage: "https://randomuser.me/api/portraits/men/1.jpg" },
    { username: "Jordan Lee", profileImage: "https://randomuser.me/api/portraits/women/2.jpg" },
    { username: "Taylor Kim", profileImage: "https://randomuser.me/api/portraits/men/3.jpg" },
    { username: "Casey Brown", profileImage: "https://randomuser.me/api/portraits/women/4.jpg" }
  ];

  // Add IDs and user data to each learning plan
  const posts = learningPlans.map((plan, index) => ({
    id: `plan-${index}`,
    mainTopic: plan.title,
    subtopics: plan.subtopics.map(sub => ({ ...sub, completed: Math.random() > 0.5 })), // Randomly mark subtopics as completed
    duration: plan.duration,
    goal: `Master the basics of ${plan.title.toLowerCase()}`,
    username: randomUserData[index % randomUserData.length].username,
    profileImage: randomUserData[index % randomUserData.length].profileImage
  }));

  const [postStates, setPostStates] = useState(
    posts.reduce((acc, post) => ({
      ...acc,
      [post.id]: {
        likes: 0,
        liked: false,
        comments: [],
        newComment: "",
        showComments: false,
        shareDialogOpen: false,
        moreDialogOpen: false,
        menuAnchor: null
      }
    }), {})
  );

  // Load likes and comments from local storage on mount
  useEffect(() => {
    const updatedStates = { ...postStates };
    posts.forEach(post => {
      const storedLikes = localStorage.getItem(`likes-${post.id}`);
      const storedLiked = localStorage.getItem(`liked-${post.id}`);
      const storedComments = localStorage.getItem(`comments-${post.id}`);
      updatedStates[post.id] = {
        ...updatedStates[post.id],
        likes: storedLikes ? parseInt(storedLikes) : 0,
        liked: storedLiked ? storedLiked === "true" : false,
        comments: storedComments ? JSON.parse(storedComments) : []
      };
    });
    setPostStates(updatedStates);
  }, []);

  const handleLike = (postId) => {
    setPostStates(prev => {
      const postState = prev[postId];
      const newLiked = !postState.liked;
      const newLikes = newLiked ? postState.likes + 1 : postState.likes - 1;
      localStorage.setItem(`likes-${postId}`, newLikes.toString());
      localStorage.setItem(`liked-${postId}`, newLiked.toString());
      return {
        ...prev,
        [postId]: { ...postState, likes: newLikes, liked: newLiked }
      };
    });
  };

  const handleCommentChange = (postId, value) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: { ...prev[postId], newComment: value }
    }));
  };

  const handleCommentSubmit = (postId) => {
    setPostStates(prev => {
      const postState = prev[postId];
      if (!postState.newComment.trim()) return prev;
      const updatedComments = [
        ...postState.comments,
        { id: Date.now(), text: postState.newComment, timestamp: new Date().toLocaleString() }
      ];
      localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments));
      return {
        ...prev,
        [postId]: { ...postState, comments: updatedComments, newComment: "" }
      };
    });
  };

  const toggleComments = (postId) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: { ...prev[postId], showComments: !prev[postId].showComments }
    }));
  };

  const handleShare = (postId) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: { ...prev[postId], shareDialogOpen: true }
    }));
  };

  const handleSave = (postId) => {
    const post = posts.find(p => p.id === postId);
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    if (!savedPosts.some(savedPost => savedPost.id === postId)) {
      savedPosts.push(post);
      localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
      alert("Post saved to local storage!");
    } else {
      alert("Post is already saved!");
    }
  };

  const handleMenuOpen = (postId, event) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: { ...prev[postId], menuAnchor: event.currentTarget }
    }));
  };

  const handleMenuClose = (postId) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: { ...prev[postId], menuAnchor: null }
    }));
  };

  const handleMoreDialogOpen = (postId) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: { ...prev[postId], moreDialogOpen: true }
    }));
  };

  const handleMoreDialogClose = (postId) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: { ...prev[postId], moreDialogOpen: false }
    }));
  };

  const handleShareDialogClose = (postId) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: { ...prev[postId], shareDialogOpen: false }
    }));
  };

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", bgcolor: "#fff", p: 4, overflowY: "auto" }}>
      {/* Header Section */}

      {/* Posts List */}
      {posts.map(post => (
       <Box
       key={post.id}
       sx={{
         maxWidth: "800px",
         mx: "auto",
         bgcolor: "white",
         borderRadius: 3,
         boxShadow: "0 8px 24px rgba(0, 0, 0, 0.75)", // stronger shadow
         p: 4,
         mb: 4,
       }}
     >
          {/* User Info and Options */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={post.profileImage}
                alt="Profile"
                style={{ width: 50, height: 50, borderRadius: "50%", mr: 2 }}
              />
              <Typography variant="h6" sx={{ color: "#1a237e" }}>{post.username}</Typography>
            </Box>
            <IconButton onClick={(e) => handleMenuOpen(post.id, e)}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={postStates[post.id]?.menuAnchor}
              open={Boolean(postStates[post.id]?.menuAnchor)}
              onClose={() => handleMenuClose(post.id)}
            >
              <MenuItem onClick={() => handleMenuClose(post.id)}>
                <ListItemIcon><ReportIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Report Post</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                handleMenuClose(post.id);
                alert("Link copied!");
              }}>
                <ListItemIcon><LinkIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Copy Link</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                handleMoreDialogOpen(post.id);
                handleMenuClose(post.id);
              }}>
                <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
                <ListItemText>View Details</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          {/* Main Topic */}
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#1a237e", mb: 2 }}>
            {post.mainTopic}
          </Typography>

          {/* Subtopics */}
          <List>
            {post.subtopics.map((subtopic, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: subtopic.completed ? "green" : "black" }} />
                </ListItemIcon>
                <ListItemText primary={subtopic.name} />
              </ListItem>
            ))}
          </List>
          <Button
            variant="text"
            sx={{ color: "#3f51b5", textTransform: "none" }}
            onClick={() => handleMoreDialogOpen(post.id)}
          >
            More
          </Button>

          {/* Duration and Goal */}
          <Typography variant="body1" sx={{ color: "#546e7a", mt: 2 }}>
            <strong>Duration:</strong> {post.duration}
          </Typography>
          <Typography variant="body1" sx={{ color: "#546e7a", mb: 3 }}>
            <strong>Goal:</strong> {post.goal}
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, borderTop: "1px solid #e0e0e0", pt: 2 }}>
            <Button
              startIcon={<ThumbUpIcon />}
              sx={{ color: postStates[post.id]?.liked ? "#3f51b5" : "#546e7a" }}
              onClick={() => handleLike(post.id)}
            >
              Like ({postStates[post.id]?.likes || 0})
            </Button>
            <Button
              startIcon={<CommentIcon />}
              sx={{ color: "#546e7a" }}
              onClick={() => toggleComments(post.id)}
            >
              Discussion ({postStates[post.id]?.comments.length || 0})
            </Button>
            <Button
              startIcon={<ShareIcon />}
              sx={{ color: "#546e7a" }}
              onClick={() => handleShare(post.id)}
            >
              Share
            </Button>
            <Button
              startIcon={<SaveIcon />}
              sx={{ color: "#546e7a" }}
              onClick={() => handleSave(post.id)}
            >
              Save
            </Button>
          </Box>

          {/* Comments Section */}
          {postStates[post.id]?.showComments && (
            <Box sx={{ mt: 3 }}>
              <TextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                value={postStates[post.id]?.newComment || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                sx={{ bgcolor: "#3f51b5", "&:hover": { bgcolor: "#303f9f" } }}
                onClick={() => handleCommentSubmit(post.id)}
              >
                Post Comment
              </Button>
              <List sx={{ mt: 2 }}>
                {postStates[post.id]?.comments.map(comment => (
                  <ListItem key={comment.id}>
                    <ListItemText
                      primary={comment.text}
                      secondary={comment.timestamp}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Share Dialog */}
          <Dialog open={postStates[post.id]?.shareDialogOpen} onClose={() => handleShareDialogClose(post.id)}>
            <DialogTitle>Share Post</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Share this post using the link below:
              </Typography>
              <TextField
                value={`${window.location.origin}/post/${post.id}`}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                  alert("Link copied!");
                }}
                sx={{ color: "#3f51b5" }}
              >
                Copy Link
              </Button>
              <Button onClick={() => handleShareDialogClose(post.id)} sx={{ color: "#ef5350" }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* More Details Dialog */}
          <Dialog open={postStates[post.id]?.moreDialogOpen} onClose={() => handleMoreDialogClose(post.id)}>
            <DialogTitle>{post.mainTopic}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Posted by:</strong> {post.username}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Duration:</strong> {post.duration}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Goal:</strong> {post.goal}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Subtopics:
              </Typography>
              <List>
                {post.subtopics.map((subtopic, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Checkbox checked={subtopic.completed} disabled />
                    </ListItemIcon>
                    <ListItemText
                      primary={subtopic.name}
                      secondary={
                        <>
                          <Typography variant="body2">{subtopic.description}</Typography>
                          <Typography variant="body2">
                            <strong>Duration:</strong> {subtopic.duration}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Resource:</strong>{" "}
                            <a href={subtopic.resource} target="_blank" rel="noopener noreferrer">
                              {subtopic.resource}
                            </a>
                          </Typography>
                          <Typography variant="body2">
                            <strong>Goals:</strong> {subtopic.goals}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Exercises:</strong> {subtopic.exercises}
                          </Typography>
                          <Typography variant="body2">
                            {subtopic.completed ? "Completed" : "Not Completed"}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleMoreDialogClose(post.id)} sx={{ color: "#ef5350" }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ))}
    </Box>
  );
};

export default LearningPost;