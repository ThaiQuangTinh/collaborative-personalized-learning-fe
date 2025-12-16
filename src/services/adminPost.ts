import { AdminPostResponse } from "../types/adminPost";
import { ApiResponse } from "../types/common";
import api from "./api";

const NOTE_BASE = "/api/admin/posts";

class AdminPostService {

    // Get all post.
    async getAllPosts():
        Promise<ApiResponse<AdminPostResponse[]>> {

        return api.get(`${NOTE_BASE}`);
    }

    // Get post by id.
    async getPostById(postId: string):
        Promise<ApiResponse<AdminPostResponse>> {

        return api.get(`${NOTE_BASE}/${postId}`);
    }

    // Delete post by id.
    async deletePostById(postId: string):
        Promise<ApiResponse<null>> {

        return api.delete(`${NOTE_BASE}/${postId}`);
    }

}

const adminPostService = new AdminPostService();

export default adminPostService;