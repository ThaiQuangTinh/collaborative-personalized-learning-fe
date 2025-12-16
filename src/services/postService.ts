import { ApiResponse } from "../types/common";
import {
    CreatePostRequest, CreatePostResponse, PostResponse,
    UpdatePostRequest, UpdatePostResponse
} from "../types/post";
import { PostCommentResponse } from "../types/postComment";
import api from "./api";

const POST_BASE = "/api/posts";

class PostService {

    // Update post by post id.
    async updatePostById(postId: string, data: UpdatePostRequest):
        Promise<ApiResponse<PostResponse>> {

        return api.put(`${POST_BASE}/${postId}`, data);
    }

    // Delete post by post id.
    async deletePostById(postId: string): Promise<ApiResponse<null>> {

        return api.delete(`${POST_BASE}/${postId}`);
    }

    // Get all post of server.
    async getAllPostOfServer(): Promise<ApiResponse<PostResponse[]>> {
        return api.get(`${POST_BASE}`);
    }

    // Create new post.
    async createPost(data: CreatePostRequest):
        Promise<ApiResponse<PostResponse>> {

        return api.post(`${POST_BASE}`, data);
    }

    // Get post comments by post id.
    async getPostCommentByPostId(postId: string):
        Promise<ApiResponse<PostCommentResponse[]>> {

        return api.get(`${POST_BASE}/${postId}/comments`);
    }

}

const postService = new PostService();

export default postService;