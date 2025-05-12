import axiosInstance from "../config/axiosConfig";
import { GoalRequest, GoalResponse } from "../types/goal-types";
import axios from "axios";

const BASE_URL = "/api/v1/goals";
const currentUserId = localStorage.getItem("userId");
export const goalsApi = {
  // Create a new goal
  createGoal: async (goalData: GoalRequest): Promise<GoalResponse> => {
    try {
      console.log("user id", currentUserId);
      const response = await axiosInstance.post<GoalResponse>(
        `${BASE_URL}/${currentUserId}`,
        goalData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || error.message);
      }
      throw new Error("An unexpected error occurred while creating the goal");
    }
  },

  // Get all goals for the current user
  getAllGoals: async (): Promise<GoalResponse[]> => {
    try {
      const response = await axiosInstance.get<GoalResponse[]>(
        `${BASE_URL}/${currentUserId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || error.message);
      }
      throw new Error("Failed to fetch goals");
    }
  },

  // Get a specific goal by ID
  getGoalById: async (goalId: string): Promise<GoalResponse> => {
    try {
      const response = await axiosInstance.get<GoalResponse>(
        `${BASE_URL}/${goalId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || error.message);
      }
      throw new Error("Failed to fetch the goal");
    }
  },

  // Update a goal
  updateGoal: async (
    goalId: string,
    goalData: GoalRequest
  ): Promise<GoalResponse> => {
    try {
      const response = await axiosInstance.put<GoalResponse>(
        `${BASE_URL}/${goalId}/${currentUserId}`,
        goalData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || error.message);
      }
      throw new Error("Failed to update the goal");
    }
  },

  // Delete a goal
  deleteGoal: async (goalId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`${BASE_URL}/${goalId}/${currentUserId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || error.message);
      }
      throw new Error("Failed to delete the goal");
    }
  },
};
