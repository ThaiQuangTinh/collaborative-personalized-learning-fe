import { LearningStatus } from "../constants/learningStatus";

export interface CreateProgeessRequest {
    lessonId: string,
    status: LearningStatus
}

export interface CreateProgressResponse {
    progressId: string,
    lessonId: string,
    status: LearningStatus
}

export interface UpdateProgressRequest {
    lessonId: string,
    status: LearningStatus
}

export interface UpdateProgressResponse {
    progressId: string,
    lessonId: string,
    status: LearningStatus
}