import { LearningStatus } from "../constants/learningStatus";
import { ExportLessonResponse, ImportLessonRequest, Lesson } from "./lesson";
import { Note } from "./note";

export interface Topic {
    id: string;
    title: string;
    displayIndex: number;
    startTime: string;
    endTime: string;
    status: LearningStatus,
    notes: Note[];
    lessons: Lesson[];
    isExpanded?: boolean;
    isLocal?: boolean
}

export interface TopicResponse {
    topicId: string,
    title: string,
    displayIndex: number,
    startTime: string,
    endTime: string,
    status: LearningStatus,
}

// Map 1 topic
export const mapTopicResponseToTopic = (res: TopicResponse): Topic => ({
    id: res.topicId,
    title: res.title,
    displayIndex: res.displayIndex,
    startTime: res.startTime,
    endTime: res.endTime,
    status: res.status,
    notes: [],
    lessons: [],
    isExpanded: false,
    isLocal: false
});

// Map nhiều topic
export const mapTopicResponsesToTopics = (responses: TopicResponse[]): Topic[] =>
    responses.map(mapTopicResponseToTopic);

export interface ImportTopicRequest {
    title: string,
    displayIndex: number,
    lessons: ImportLessonRequest[]
}

export interface ExportTopicResponse {
    title: string,
    displayIndex: number,
    lessons: ExportLessonResponse[]
}

export interface UpdateTopicRequest {
    title: string
}

export interface UpdateTopicResponse {
    topicId: string,
    pathId: string,
    title: string,
    displayIndex: number
}

export interface CreateTopicRequest {
    pathId: string,
    title: string
}

export interface CreateTopicResponse {
    topicId: string,
    pathId: string,
    title: string,
    displayIndex: number
}
