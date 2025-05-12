import axiosInstance from "../config/axiosConfig";
import { AccountDeactivationRequest, AccountDeactivationResponse } from "../types/account-types";
import axios from "axios";

const BASE_URL = '/api/users';

export const accountApi = {
    // Deactivate user account
    deactivateAccount: async (
        userId: string, 
        deactivationData: AccountDeactivationRequest
    ): Promise<AccountDeactivationResponse> => {
        try {
            const response = await axiosInstance.post<AccountDeactivationResponse>(
                `${BASE_URL}/${userId}/deactivate`,
                deactivationData
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('An unexpected error occurred while deactivating the account');
        }
    },

    // Check account deactivation status
    checkDeactivationStatus: async (userId: string): Promise<AccountDeactivationResponse> => {
        try {
            const response = await axiosInstance.get<AccountDeactivationResponse>(
                `${BASE_URL}/${userId}/deactivation-status`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw new Error('Failed to check account deactivation status');
        }
    }
};