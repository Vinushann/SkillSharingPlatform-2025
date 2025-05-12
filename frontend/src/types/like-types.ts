export interface LikeResponse {
    id: string;
    user: UserSummaryDTO;
    likedAt: Date;
}

export interface UserSummaryDTO {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
}