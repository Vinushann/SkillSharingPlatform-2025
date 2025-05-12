export interface PostMediaDTO {
  url: string;
  mediaType: string;
}

export interface UserSummaryDTO {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

export interface PostRequest {
  caption: string;
  media: PostMediaDTO[];
  taggedUserIds: string[];
}

export interface PostResponse {
  id: string;
  caption: string;
  postedBy: UserSummaryDTO;
  postedAt: Date;
  media: PostMediaDTO[];
  taggedUsers: UserSummaryDTO[];
  repostedBy: UserSummaryDTO[];
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  isRepost?: boolean;         
  reposter?: UserSummaryDTO; 
  originalPoster?: UserSummaryDTO; 
}

export interface RepostRequest {
  postId: string;
}

export interface LikeResponse {
  id: string;
  user: UserSummaryDTO;
  likedAt: Date;
}

export interface LikeRequest {
  postId: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  user: UserSummaryDTO;
  commentedAt: Date;
}

export interface CommentRequest {
  postId: string;
  content: string;
}

