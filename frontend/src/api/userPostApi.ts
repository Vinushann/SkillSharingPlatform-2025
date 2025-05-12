import axiosInstance from "../config/axiosConfig";
import axios from "axios";
import { PostRequest, PostResponse } from "../types/post-types";

const BASE_URL = '/api/posts';

export const userPostApi = {
    createPost: async (
        userId: string,
        postRequest: PostRequest
    ): Promise<PostResponse> => {
        try {
            const response = await axiosInstance.post<PostResponse>(
                BASE_URL,
                postRequest,
                { params: { userId } }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || error.message);
            }
            throw new Error('Failed to create post');
        }
    },

    getPostById: async (
        postId: string,
        currentUserId: string
    ): Promise<PostResponse> => {
        try {
            const response = await axiosInstance.get<PostResponse>(
                `${BASE_URL}/${postId}`,
                { params: { currentUserId } }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('Post not found');
                }
                throw new Error(error.response?.data?.message || error.message);
            }
            throw new Error('Failed to fetch post');
        }
    },

    getPostsByUserId: async (
        userId: string,
        currentUserId: string
    ): Promise<PostResponse[]> => {
        try {
            const response = await axiosInstance.get<PostResponse[]>(
                `${BASE_URL}/user/${userId}`,
                { params: { currentUserId } }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || error.message);
            }
            throw new Error('Failed to fetch user posts');
        }
    },

    getAllPosts: async (
        currentUserId: string
    ): Promise<PostResponse[]> => {
        try {
            const response = await axiosInstance.get<PostResponse[]>(
                BASE_URL,
                { params: { currentUserId } }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || error.message);
            }
            throw new Error('Failed to fetch posts');
        }
    },

    updatePost: async (
        postId: string,
        userId: string,
        postRequest: PostRequest
    ): Promise<PostResponse> => {
        try {
            const response = await axiosInstance.put<PostResponse>(
                `${BASE_URL}/${postId}`,
                postRequest,
                { params: { userId } }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('Post not found');
                }
                if (error.response?.status === 403) {
                    throw new Error('Unauthorized to update this post');
                }
                throw new Error(error.response?.data?.message || error.message);
            }
            throw new Error('Failed to update post');
        }
    },

    deletePost: async (
        postId: string,
        userId: string
    ): Promise<void> => {
        try {
            await axiosInstance.delete(
                `${BASE_URL}/${postId}`,
                { params: { userId } }
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('Post not found');
                }
                if (error.response?.status === 403) {
                    throw new Error('Unauthorized to delete this post');
                }
                throw new Error(error.response?.data?.message || error.message);
            }
            throw new Error('Failed to delete post');
        }
    },

    repostPost: async (
        postId: string,
        userId: string
    ): Promise<PostResponse> => {
        try {
            const response = await axiosInstance.post<PostResponse>(
                `${BASE_URL}/${postId}/repost`,
                null,
                { params: { userId } }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('Post not found');
                }
                throw new Error(error.response?.data?.message || error.message);
            }
            throw new Error('Failed to repost');
        }
    },

    removeRepost: async (
        postId: string,
        userId: string
    ): Promise<void> => {
        try {
            await axiosInstance.delete(
                `${BASE_URL}/${postId}/repost`,
                { params: { userId } }
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('Post not found');
                }
                throw new Error(error.response?.data?.message || error.message);
            }
            throw new Error('Failed to remove repost');
        }
    },

    postExists: async (
        postId: string
    ): Promise<boolean> => {
        try {
            const response = await axiosInstance.get<boolean>(
                `${BASE_URL}/${postId}/exists`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || error.message);
            }
            throw new Error('Failed to check post existence');
        }
    }
};