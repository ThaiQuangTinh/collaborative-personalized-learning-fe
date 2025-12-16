import { ApiResponse } from "../types/common";
import { CreateLessonRequest, CreateLessonResponse, LessonResponse, UpdateLessonRequest, UpdateLessonResponse } from "../types/lesson";
import { NoteResponse } from "../types/note";
import { ResourceRespnse } from "../types/resource";
import api from "./api";

const LESSON_BASE = "/api/lessons";

class LessonService {

    // Update lesson by lesson id.
    async updateLessonByid(lessonId: string, data: UpdateLessonRequest):
        Promise<ApiResponse<LessonResponse>> {

        return api.put(`${LESSON_BASE}/${lessonId}`, data);
    }

    // Delete lesson by lesson id.
    async deleteLessonById(lessonId: string): Promise<ApiResponse<null>> {
        return api.delete(`${LESSON_BASE}/${lessonId}`);
    }

    // Create new lesson comment.
    async createLesson(data: CreateLessonRequest):
        Promise<ApiResponse<LessonResponse>> {

        return api.post(`${LESSON_BASE}`, data);
    }

    // Get all notes of lesson.
    async getAllNotesByLessonId(lessonId: string):
        Promise<ApiResponse<NoteResponse[]>> {

        return api.get(`${LESSON_BASE}/${lessonId}/notes`);
    }

    // Get all resources of lesson.
    async getAllResourcesByLessonId(lessonId: string):
        Promise<ApiResponse<ResourceRespnse[]>> {

        return api.get(`${LESSON_BASE}/${lessonId}/resources`);
    }

}

const lessonService = new LessonService();

export default lessonService;