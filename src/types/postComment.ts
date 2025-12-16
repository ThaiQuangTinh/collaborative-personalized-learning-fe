import { UserPostResponse } from "./post";

export interface PostCommentResponse {
    commentId: string,
    userPostResponse: UserPostResponse,
    content: string,
    updatedAt: string,
    ownedByCurrentUser: boolean
}

export interface CreatePostCommentRequest {
    postId: string,
    content: string
}

export interface CreatePostCommentResponse {
    commentId: string,
    postId: string,
    userPostResponse: UserPostResponse,
    content: string,
    createdAt: string,
    updatedAt: string
}

export interface UpdatePostCommentRequest {
    content: string
}

export interface UpdatePostCommentResponse {
    commentId: string,
    content: string,
    updateAt: string
}