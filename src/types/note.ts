import { TargetType } from "../constants/targetType"

export interface Note {
    noteId: string,
    targetType: TargetType,
    targetId: string,
    title: string,
    content: string,
    displayIndex: number
}

export interface NoteResponse {
    noteId: string,
    targetType: TargetType,
    targetId: string,
    title: string,
    content: string,
    displayIndex: number
}

// Map 1 NoteResponse -> Note
export const mapNoteResponseToNote = (res: NoteResponse): Note => ({
    noteId: res.noteId,
    targetType: res.targetType,
    targetId: res.targetId,
    title: res.title,
    content: res.content,
    displayIndex: res.displayIndex
});

// Map nhiều NoteResponse -> Note[]
export const mapNoteResponsesToNotes = (responses: NoteResponse[]): Note[] =>
    responses.map(mapNoteResponseToNote);

export interface UpdateNoteRequest {
    title: string,
    content: string
}

export interface UpdateNoteResponse {
    noteId: string,
    title: string,
    content: string,
    displayIndex: number
}

export interface CreateNoteRequest {
    targetType: TargetType,
    targetId: string,
    title: string,
    content: string
}

export interface CreateNoteResponse {
    noteId: string,
    targetType: TargetType,
    targetId: string,
    title: string,
    content: string,
    displayIndex: number
}
