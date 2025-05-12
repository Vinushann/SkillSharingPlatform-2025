import axiosInstance from "../config/axiosConfig";
import { FollowResponse, } from "../types/follow-types";
import axios from "axios";

const BASE_URL = '/api/v1/follows';

export const followApi = {
    // Follow a user
    followUser: async (followingId: string,currentUserId:string): Promise<FollowResponse> => {
        try {
            const response = await axiosInstance.post<FollowResponse>(`${BASE_URL}/${currentUserId}`, { followingId });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('An unexpected error occurred while following the user');
        }
    },

    // Unfollow a user
    unfollowUser: async (followingId: string,currentUserId:string): Promise<void> => {
        try {
            await axiosInstance.delete(`${BASE_URL}/${followingId}/${currentUserId}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to unfollow the user');
        }
    },

    // Get all followers of a user
    getFollowers: async (userId: string): Promise<FollowResponse[]> => {
        try {
            const response = await axiosInstance.get<FollowResponse[]>(`${BASE_URL}/followers/${userId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to fetch followers');
        }
    },

    // Get all users a user is following
    getFollowings: async (userId: string): Promise<FollowResponse[]> => {
        try {
            const response = await axiosInstance.get<FollowResponse[]>(`${BASE_URL}/followings/${userId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to fetch followings');
        }
    },

    // Count followers for a user
    countFollowers: async (userId: string): Promise<number> => {
        try {
            const response = await axiosInstance.get<number>(`${BASE_URL}/count/followers/${userId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to count followers');
        }
    },

    // Count followings for a user
    countFollowings: async (userId: string): Promise<number> => {
        try {
            const response = await axiosInstance.get<number>(`${BASE_URL}/count/followings/${userId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data || error.message);
            }
            throw new Error('Failed to count followings');
        }
    },
};