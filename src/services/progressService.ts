import { ApiResponse } from "../types/common";
import {
    CreateProgeessRequest, UpdateProgressRequest,
    UpdateProgressResponse
} from "../types/progress";
import api from "./api";

const PROGRESS_BASE = "/api/progresses";

class ProgressService {

    // Update progress for lesson.
    async updateProgress(data: UpdateProgressRequest):
        Promise<ApiResponse<UpdateProgressResponse>> {

        return api.put(`${PROGRESS_BASE}`, data);
    }

    // Create progress for lesson.
    async createProgress(data: CreateProgeessRequest):
        Promise<ApiResponse<CreateProgeessRequest>> {

        return api.post(`${PROGRESS_BASE}`, data);
    }

}

const progressService = new ProgressService();

export default progressService;