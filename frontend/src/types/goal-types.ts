export enum GoalStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

export interface GoalRequest {
    description: string;
    targetDate: Date;
    status?: GoalStatus;
}

export interface GoalResponse {
    id: string;
    description: string;
    status: GoalStatus;
    targetDate: Date;
    createdAt: Date;
    updatedAt: Date;
    user: UserSummaryDTO;
}

export interface UserSummaryDTO {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
}