import { ApiResponse } from "../types/common";
import api from "./api";

const POST_LIKE_BASE = "/api/post-likes";

class PostLikeService {

    // Create new post like.
    async createPostLike(postLikeId: string):
        Promise<ApiResponse<null>> {

        return api.post(`${POST_LIKE_BASE}/${postLikeId}`);
    }

    // Delete post like by post id.
    async unPostLikeById(postLikeId: string): Promise<ApiResponse<null>> {

        return api.delete(`${POST_LIKE_BASE}/${postLikeId}`);
    }

}

const postLikeService = new PostLikeService();

export default postLikeService;