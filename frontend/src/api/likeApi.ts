import axiosInstance from "../config/axiosConfig";
import { LikeResponse } from "../types/like-types";
import axios from "axios";

const BASE_URL = '/api/v1/likes';

export const likeApi = {
    // Toggle like for a post (add or remove)
    toggleLike: async (postId: string,currentUserId:string): Promise<LikeResponse | null> => {
        try {
            const response = await axiosInstance.post<LikeResponse>(`${BASE_URL}/${postId}/${currentUserId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('An unexpected error occurred while toggling the like');
        }
    },

    // Count likes for a specific post
    countLikesForPost: async (postId: string): Promise<number> => {
        try {
            const response = await axiosInstance.get<number>(`${BASE_URL}/count/${postId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to count likes for the post');
        }
    },

    // Check if the current user has liked a specific post
    hasUserLikedPost: async (postId: string): Promise<boolean> => {
        try {
            const response = await axiosInstance.get<boolean>(`${BASE_URL}/check/${postId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to check if the user has liked the post');
        }
    },
};