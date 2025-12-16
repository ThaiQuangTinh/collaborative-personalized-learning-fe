import { ApiResponse } from "../types/common";
import {
    CreateTagRequest, CreateTagResponse, TagResponse,
    UpdateTagRequest, UpdateTagResponse
} from "../types/tag";
import api from "./api";

const TAG_BASE = "/api/tags";

class TagService {

    // Update tag by tag id.
    async updateTag(tagId: string, data: UpdateTagRequest):
        Promise<ApiResponse<UpdateTagResponse>> {

        return api.put(`${TAG_BASE}/${tagId}`, data);
    }

    // Delete tag by tag id.
    async deleteTag(tagId: string): Promise<ApiResponse<null>> {
        return api.delete(`${TAG_BASE}/${tagId}`);
    }

    // Get all tags by user.
    async getAllTagsByUser(): Promise<ApiResponse<TagResponse[]>> {
        return api.get(`${TAG_BASE}`);
    }

    // Create new tag.
    async createTag(data: CreateTagRequest): Promise<ApiResponse<CreateTagResponse>> {
        return api.post(`${TAG_BASE}`, data);
    }
    
}

const tagService = new TagService();

export default tagService;