import { LearningStatus } from "../constants/learningStatus"
import { SharePathPermission } from "../constants/sharePermission";
import { Note } from "./note";
import { Tag } from "./tag";
import { ExportTopicResponse, ImportTopicRequest, Topic } from "./topic"

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    status: LearningStatus,
    progressPercent: number,
    tags: Tag[];
    notes: Note[];
    topics: Topic[];
    deleted: boolean,
    archived: boolean,
    favourite: boolean,
    createAt: string,
    userOriginalPathResponse: UserOriginalPathResponse
}

// LEARNING PATH MODEL
export interface LearningPathResponse {
    pathId: string,
    title: string,
    description: string,
    startTime: string,
    endTime: string,
    status: LearningStatus,
    progressPercent: number,
    deleted: boolean,
    archived: boolean,
    favourite: boolean,
    createAt: string,
    userOriginalPathResponse: UserOriginalPathResponse
}

export interface UserOriginalPathResponse {
    userId: string,
    fullname: string,
    avatarUrl: string
}

// Map 1 LearningPathResponse -> LearningPath
export const mapLearningPathResponseToLearningPath = (res: LearningPathResponse): LearningPath => ({
    id: res.pathId,
    title: res.title,
    description: res.description,
    startTime: res.startTime,
    endTime: res.endTime,
    status: res.status,
    progressPercent: res.progressPercent,
    tags: [],
    notes: [],
    topics: [],
    deleted: res.deleted,
    archived: res.archived,
    favourite: res.favourite,
    createAt: res.createAt,
    userOriginalPathResponse: res.userOriginalPathResponse
});

// Map nhiều LearningPathResponse -> LearningPath[]
export const mapLearningPathResponsesToLearningPaths = (responses: LearningPathResponse[]): LearningPath[] =>
    responses.map(mapLearningPathResponseToLearningPath);

// CREATE LEARNING PATH
export interface CreateLearningPathRequest {
    title: string,
    description?: string
}

export interface CreateLearningPathResponse {
    pathId: string,
    title: string,
    description: string,
    deleted: boolean,
    archived: boolean,
    favourite: boolean
}

export interface UpdateLearningPathRequest {
    title: string,
    description: string
}

export interface UpdateLearningPathResponse {
    pathId: string,
    title: string,
    description: string
}

export interface DeleteLearningPathRequest {
    pathIds: string[]
}

export interface ImportLearningPathRequest {
    file: File
}

export interface ExportLearningPathResponse {
    title: string,
    description: string,
    topics: ExportTopicResponse[]
}

export interface LearningPathStatisticResponse {
    pathId: string,
    pathTitle: string,
    totalTopics: number,
    totalLessons: number,
    completedLessons: number,
    remainingLessons: number,
    overallProgress: number,
    durationMonths: number,
    durationDays: number,
    startDate: string,
    endDate: string,
    lastUpdated: string
}

export interface CreateShareLearningPathRequest {
    sharePermission: SharePathPermission
}

export interface CreateShareLearningPathResponse {
    shareUrl: string,
    token: string,
    sharePermission: SharePathPermission,
}

export interface ShareLearningPathResponse {
    shareByUserId: string,
    pathId: string,
    sharePermission: SharePathPermission
}

export interface ExportLearningPathRequest {
    pathIds: string[]
}

export interface UpdatePathProgressPercent {
    progressPercent: number
}