// src/components/PostCard.jsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { Favorite, Comment, Share } from "@mui/icons-material";
import {
  getComments,
  addComment,
  likePost,
  unlikePost,
  sharePost,
} from "../services/userEngagementService";

const PostCard = ({ post, userId }) => {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const fetchComments = async () => {
    const data = await getComments(post.id);
    setComments(data);
  };

  const handleLike = async () => {
    if (!liked) {
      await likePost(post.id, userId);
      setLiked(true);
      setLikeCount(likeCount + 1);
    } else {
      await unlikePost(post.id, userId);
      setLiked(false);
      setLikeCount(likeCount - 1);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = await addComment(post.id, {
        userId,
        content: comment,
      });
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const handleShare = async () => {
    await sharePost(post.id, userId);
    alert("Post shared successfully");
  };

  return (
    <Card style={{ marginBottom: "16px" }}>
      <CardContent>
        <Typography variant="h5">{post.title}</Typography>
        <Typography variant="body2">{post.content}</Typography>
        <Typography variant="caption">
          Posted by User {post.userId} on{" "}
          {new Date(post.createdAt).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          onClick={handleLike}
          color={liked ? "secondary" : "default"}
        >
          <Favorite /> {likeCount}
        </IconButton>
        <IconButton onClick={handleShare}>
          <Share />
        </IconButton>
        <form
          onSubmit={handleComment}
          style={{ display: "flex", width: "100%" }}
        >
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            size="small"
            style={{ flexGrow: 1, marginRight: "8px" }}
          />
          <Button type="submit" variant="contained" size="small">
            Comment
          </Button>
        </form>
      </CardActions>
      <CardContent>
        {comments.map((c) => (
          <Typography key={c.id} variant="body2" style={{ marginTop: "8px" }}>
            {c.content} (by User {c.userId})
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default PostCard;
