import axiosInstance from "../config/axiosConfig";
import { CommentResponse } from "../types/comment-types";
import axios from "axios";

const BASE_URL = '/api/v1/comments';

export const commentApi = {
    // Create a new comment
    createComment: async (postId: string, content: string): Promise<CommentResponse> => {
        try {
            const currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                throw new Error('User is not authenticated');
            }
            const response = await axiosInstance.post<CommentResponse>(`${BASE_URL}/${currentUserId}`, { postId, content });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('An unexpected error occurred while creating the comment');
        }
    },

    // Get all comments for a specific post
    getCommentsForPost: async (postId: string): Promise<CommentResponse[]> => {
        try {
            const response = await axiosInstance.get<CommentResponse[]>(`${BASE_URL}/post/${postId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to fetch comments for the post');
        }
    },

    // Update an existing comment
    updateComment: async (commentId: string, content: string): Promise<CommentResponse> => {
        try {
            const currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                throw new Error('User is not authenticated');
            }
            const response = await axiosInstance.put<CommentResponse>(`${BASE_URL}/${commentId}/${currentUserId}`, { content });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to update the comment');
        }
    },

    // Delete a comment by ID
    deleteComment: async (commentId: string): Promise<void> => {
        try {
            const currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                throw new Error('User is not authenticated');
            }
            await axiosInstance.delete(`${BASE_URL}/${commentId}/${currentUserId}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to delete the comment');
        }
    },

    // Count comments for a specific post
    countCommentsForPost: async (postId: string): Promise<string> => {
        try {
            const response = await axiosInstance.get<string>(`${BASE_URL}/count/${postId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to count comments for the post');
        }
    },
};