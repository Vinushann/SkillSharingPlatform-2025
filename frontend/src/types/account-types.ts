export interface AccountDeactivationRequest {
    deactivateStartDate: string;
    deactivateEndDate?: string;  
}

export interface AccountDeactivationResponse {
    id: string;
    email: string;
    username: string;
    deactivateStatus: boolean;
    deactivateStartDate: string;
    deactivateEndDate?: string;
    message?: string;
}