import { PostCommentResponse } from './postComment';

export interface PostResponse {
    postId: string,
    userPostResponse: UserPostResponse,
    title: string,
    content: string,
    externalLink: string,
    likeCount: number,
    commentCount: number,
    updatedAt: string,
    postCommentResponses: PostCommentResponse[],
    ownedByCurrentUser: boolean,
    liked: boolean
}

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  link: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isOwner?: boolean;
}

export interface UpdatePostRequest {
    title: string,
    content: string,
    externalLink: string
}

export interface UpdatePostResponse {
    postId: string,
    title: string,
    content: string,
    externalLink: string,
    updatedAt: string
}

export interface CreatePostRequest {
    title: string,
    content: string,
    externalLink: string,
}

export interface CreatePostResponse {
    postId: string,
    userPostResponse: UserPostResponse,
    title: string,
    content: string,
    externalLink: string,
    likeCount: number,
    commentCount: number,
    createdAt: string,
    updatedAt: string
}

export interface UserPostResponse {
    fullName: string,
    avatarUrl: string
}