import { ApiResponse } from "../types/common";
import {
    CreateLearningPathRequest, CreateShareLearningPathRequest, CreateShareLearningPathResponse, DeleteLearningPathRequest, ExportLearningPathRequest, ExportLearningPathResponse,
    ImportLearningPathRequest, LearningPathResponse, LearningPathStatisticResponse,
    ShareLearningPathResponse,
    UpdateLearningPathRequest,
    UpdateLearningPathResponse,
    UpdatePathProgressPercent
}
    from "../types/learningPath";
import { NoteResponse } from "../types/note";
import { TagResponse } from "../types/tag";
import { TopicResponse } from "../types/topic";
import api from "./api";

const LEARNING_PATH_BASE = "/api/learning-paths";

class LearningPathService {

    // Get learning path by path id.
    async getLearningPathById(pathId: string):
        Promise<ApiResponse<LearningPathResponse>> {

        return api.get(`${LEARNING_PATH_BASE}/${pathId}`);
    }

    // Update learning path by path id.
    async updateLearningPathById(pathId: string, data: UpdateLearningPathRequest):
        Promise<ApiResponse<UpdateLearningPathResponse>> {

        return api.put(`${LEARNING_PATH_BASE}/${pathId}`, data);
    }

    // Get all learning path by user.
    async getAllLearningPath(): Promise<ApiResponse<LearningPathResponse[]>> {
        return api.get(`${LEARNING_PATH_BASE}`);
    }

    // Create learning path.
    async createLearningPath(data: CreateLearningPathRequest):
        Promise<ApiResponse<LearningPathResponse>> {

        return api.post(`${LEARNING_PATH_BASE}`, data);
    }

    // Delete learning path by list path ids.
    async deleteLearningPath(data: DeleteLearningPathRequest): Promise<ApiResponse<null>> {
        return api.delete(`${LEARNING_PATH_BASE}`, { data });
    }

    // Get link after share learning path.
    async getLinkToShareLearningPath(pathId: string, data: CreateShareLearningPathRequest):
        Promise<ApiResponse<CreateShareLearningPathResponse>> {

        return api.post(`${LEARNING_PATH_BASE}/${pathId}/share`, data);
    }

    // Favourite learing path by path id.
    async favouriteLearningPathByPathId(pathId: string): Promise<ApiResponse<null>> {
        return api.post(`${LEARNING_PATH_BASE}/${pathId}/favorite`);
    }

    // Un favourite learning path by pathh id.
    async unFavouriteLearningPathByPathId(pathId: string): Promise<ApiResponse<null>> {
        return api.delete(`${LEARNING_PATH_BASE}/${pathId}/favorite`);
    }

    // Archive learning path by path id.
    async archiveLearningPathByPathId(pathId: string): Promise<ApiResponse<null>> {
        return api.post(`${LEARNING_PATH_BASE}/${pathId}/archive`);
    }

    // Unarchive learning path by path id.
    async unArchiveLearningPathByPathId(pathId: string): Promise<ApiResponse<null>> {
        return api.delete(`${LEARNING_PATH_BASE}/${pathId}/archive`);
    }

    // Import learning path (can import many learning path).
    async importLearningPaths(data: ImportLearningPathRequest):
        Promise<ApiResponse<LearningPathResponse[]>> {

        const formData = new FormData()
        formData.set("file", data.file);

        return api.post(`${LEARNING_PATH_BASE}/import`, formData);
    }

    // Clone learning path from share link.
    async cloneLearningPathFromShare(token: string):
        Promise<ApiResponse<LearningPathResponse>> {

        return api.post(`${LEARNING_PATH_BASE}/clone-from-share/${token}`);
    }

    // Get all topic by path id.
    async getAllTopicsByPathId(pathId: string):
        Promise<ApiResponse<TopicResponse[]>> {

        return api.get(`${LEARNING_PATH_BASE}/${pathId}/topics`);
    }

    // Get all tags by path id.
    async getTagsByLearningPathId(pathId: string):
        Promise<ApiResponse<TagResponse[]>> {

        return api.get(`${LEARNING_PATH_BASE}/${pathId}/tags`);
    }

    // Get statistics info by path id.
    async getStatisticsInfoByPathId(pathId: string):
        Promise<ApiResponse<LearningPathStatisticResponse>> {

        return api.get(`${LEARNING_PATH_BASE}/${pathId}/statistics`);
    }

    // Get all notes by path id.
    async getAllNotesByPathId(pathId: string):
        Promise<ApiResponse<NoteResponse[]>> {

        return api.get(`${LEARNING_PATH_BASE}/${pathId}/notes`);
    }

    // Export learning path (can export many learning path)
    async exportLearningPaths(data: ExportLearningPathRequest) {
        return api.post(`${LEARNING_PATH_BASE}/export`, data, {
            responseType: "blob",
            validateStatus: () => true
        });
    }

    // Get learning path from share token.
    async getLearningPathFromShareToken(token: string):
        Promise<ApiResponse<ShareLearningPathResponse>> {

        return api.get(`${LEARNING_PATH_BASE}/share/${token}`);
    }

    // Get all favourite learning paths.
    async getFavoriteLearningPaths(): Promise<ApiResponse<LearningPathResponse[]>> {
        return api.get(`${LEARNING_PATH_BASE}/favorites`);
    }

    // Get all archive learning paths.
    async getArchiveLearningPaths(): Promise<ApiResponse<LearningPathResponse[]>> {
        return api.get(`${LEARNING_PATH_BASE}/archives`);
    }

    // Update learniging path progress percent.
    async updateLearningPathProgressPercent(pathId: string, data: UpdatePathProgressPercent):
        Promise<ApiResponse<null>> {

        return api.patch(`${LEARNING_PATH_BASE}/${pathId}/progress`, data);
    }

}

const learningPathService = new LearningPathService();

export default learningPathService;