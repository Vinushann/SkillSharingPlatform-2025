export interface CommentRequest {
    postId: string;
    content: string;
}

export interface CommentResponse {
    id: string;
    content: string;
    user: UserSummaryDTO;
    commentedAt: Date;
}

export interface UserSummaryDTO {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
}