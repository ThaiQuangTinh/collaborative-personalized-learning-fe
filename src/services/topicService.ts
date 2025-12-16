import { ApiResponse } from "../types/common";
import { LessonResponse } from "../types/lesson";
import { NoteResponse } from "../types/note";
import {
    CreateTopicRequest, CreateTopicResponse,
    TopicResponse,
    UpdateTopicRequest, UpdateTopicResponse
} from "../types/topic";
import api from "./api";

const TOPIC_BASE = "/api/topics";

class TopicService {

    // Update topic by topic id.
    async updateTopicById(topicId: string, data: UpdateTopicRequest):
        Promise<ApiResponse<TopicResponse>> {

        return api.put(`${TOPIC_BASE}/${topicId}`, data);
    }

    // Delete topic by topic id.
    async deleteTopicById(topicId: string): Promise<ApiResponse<null>> {
        return api.delete(`${TOPIC_BASE}/${topicId}`);
    }

    // Create topic.
    async createTopic(data: CreateTopicRequest):
        Promise<ApiResponse<TopicResponse>> {

        return api.post(`${TOPIC_BASE}`, data);
    }

    // Get all notes by topic id.
    async getAllNotesByTopicId(topicId: string):
        Promise<ApiResponse<NoteResponse[]>> {

        return api.get(`${TOPIC_BASE}/${topicId}/notes`);
    }

    // Get all lessons by topic id.
    async getAllLessonsByTopicId(topicId: string):
        Promise<ApiResponse<LessonResponse[]>> {

        return api.get(`${TOPIC_BASE}/${topicId}/lessons`);
    }

}

const topicService = new TopicService();

export default topicService;