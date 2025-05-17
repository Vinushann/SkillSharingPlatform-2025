// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

export const getComments = async (postId) => {
  const response = await api.get(`/engagement/posts/${postId}/comments`);
  return response.data;
};

export const addComment = async (postId, commentData) => {
  const response = await api.post(
    `/engagement/posts/${postId}/comment`,
    commentData
  );
  return response.data;
};

export const likePost = async (postId, userId) => {
  const response = await api.post(
    `/engagement/posts/${postId}/like?userId=${userId}`
  );
  return response.data;
};

export const unlikePost = async (postId, userId) => {
  const response = await api.delete(
    `/engagement/posts/${postId}/unlike?userId=${userId}`
  );
  return response.data;
};

export const sharePost = async (postId, userId) => {
  const response = await api.post(
    `/engagement/posts/${postId}/share?userId=${userId}`
  );
  return response.data;
};

export const editComment = async (commentId, commentData) => {
  const response = await api.put(
    `/engagement/comments/${commentId}`,
    commentData
  );
  return response.data;
};

export const deleteComment = async (commentId, userId) => {
  const response = await api.delete(
    `/engagement/comments/${commentId}?userId=${userId}`
  );
  return response.data;
};

// Notification APIs
export const getNotifications = async (recipientId) => {
  const response = await api.get(`/notifications/user/${recipientId}`);
  return response.data;
};

export const getUnreadNotifications = async (recipientId) => {
  const response = await api.get(`/notifications/user/${recipientId}/unread`);
  return response.data;
};

export const createNotification = async (recipientId, message, type, relatedPostId) => {
  const response = await api.post('/notifications', null, {
    params: { recipientId, message, type, relatedPostId },
  });
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  await api.delete(`/notifications/${notificationId}`);
};
