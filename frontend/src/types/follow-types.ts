export interface FollowRequest {
    followingId: string;
}

export interface FollowResponse {
    id: string;
    follower: UserSummaryDTO;
    following: UserSummaryDTO;
    createdAt: Date;
}

export interface UserSummaryDTO {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
}