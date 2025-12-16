import { ApiResponse } from "../types/common";
import { CreatePostResponse } from "../types/post";
import {
    CreatePostCommentRequest, PostCommentResponse, UpdatePostCommentRequest,
    UpdatePostCommentResponse
} from "../types/postComment";
import api from "./api";

const POST_COMMENT_BASE = "/api/post-comments";

class PostCommentService {

    // Update post comment by post comment id.
    async updatePostCommentById(postCommentId: string, data: UpdatePostCommentRequest):
        Promise<ApiResponse<PostCommentResponse>> {

        return api.put(`${POST_COMMENT_BASE}/${postCommentId}`, data);
    }

    // Delete post comment by post id.
    async deletePostCommentById(postCommentId: string): Promise<ApiResponse<null>> {

        return api.delete(`${POST_COMMENT_BASE}/${postCommentId}`);
    }

    // Create new post comment.
    async createPostComment(data: CreatePostCommentRequest):
        Promise<ApiResponse<PostCommentResponse>> {

        return api.post(`${POST_COMMENT_BASE}`, data);
    }

}

const postCommnentService = new PostCommentService();

export default postCommnentService;