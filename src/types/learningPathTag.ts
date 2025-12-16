

export interface CreateLearningPathTagRequest {
    pathId: string,
    tagId: string
}

export interface CreateLearningPathTagResponse {
    pathId: string,
    tagId: string,
    tagName: string
}

export interface DeleteLearningPathTagRequest {
    pathId: string,
    tagId: string,
}