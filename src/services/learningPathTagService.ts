import { ApiResponse } from "../types/common";
import { CreateLearningPathResponse } from "../types/learningPath";
import { CreateLearningPathTagRequest, DeleteLearningPathTagRequest } from "../types/learningPathTag";
import api from "./api";

const LEARING_PATH_TAG_BASE = "/api/learning-path-tags";

class LearningPathTagService {

    // Create new post like.
    async createLearningPathTag(data: CreateLearningPathTagRequest[]):
        Promise<ApiResponse<CreateLearningPathResponse[]>> {

        return api.post(`${LEARING_PATH_TAG_BASE}`, data);
    }

    // Delete post like by post id.
    async deleteLearningPathTag(data: DeleteLearningPathTagRequest):
        Promise<ApiResponse<null>> {

        return api.delete(`${LEARING_PATH_TAG_BASE}`, { data: data });
    }

}

const learningPathTagService = new LearningPathTagService();

export default learningPathTagService;