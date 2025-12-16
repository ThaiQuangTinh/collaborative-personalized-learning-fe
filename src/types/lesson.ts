import { LearningStatus } from "../constants/learningStatus";
import { Note } from "./note";
import { ExportResourceResponse, ImportResourceRequest, Resource } from "./resource";

export interface Lesson {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    status: LearningStatus;
    displayIndex: number;
    notes: Note[];
    resources: Resource[];
    isExpanded?: boolean;
    isUnlocked?: boolean;
    isLocal?: boolean
}

export interface LessonResponse {
    lessonId: string,
    title: string,
    startTime: string,
    endTime: string,
    displayIndex: number,
    status: LearningStatus
}

export const mapLessonResponseToLesson = (res: LessonResponse): Lesson => ({
    id: res.lessonId,
    title: res.title,
    startTime: res.startTime,
    endTime: res.endTime,
    status: res.status,
    displayIndex: res.displayIndex,
    notes: [],
    resources: [],
    isExpanded: false,
    isUnlocked: true,
    isLocal: false
});


export const mapLessonResponsesToLessons = (list: LessonResponse[]): Lesson[] =>
    list.map(mapLessonResponseToLesson);


export interface ImportLessonRequest {
    title: string,
    displayIndex: number,
    resources: ImportResourceRequest[]
}

export interface ExportLessonResponse {
    title: string,
    displayIndex: number,
    resources: ExportResourceResponse[]
}

export interface UpdateLessonRequest {
    title: string,
    startTime: string,
    endTime: string
}

export interface UpdateLessonResponse {
    lessonId: string,
    title: string,
    displayIndex: number,
    startTime: string,
    endTime: string,
    lessonStatus: LearningStatus
}

export interface CreateLessonRequest {
    topicId: string
    title: string
    startTime: string,
    endTime: string
}

export interface CreateLessonResponse {
    lessonId: string,
    title: string,
    displayIndex: number,
    startTime: string,
    endTime: string,
    lessonStatus: LearningStatus
}
