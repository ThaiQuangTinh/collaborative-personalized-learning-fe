import { ApiResponse } from "../types/common";
import { CreateNoteRequest, CreateNoteResponse, NoteResponse, UpdateNoteRequest, UpdateNoteResponse } from "../types/note";
import api from "./api";

const NOTE_BASE = "/api/notes";

class NoteService {

    // Update note by note id.
    async updateNoteById(noteId: string, data: UpdateNoteRequest):
        Promise<ApiResponse<NoteResponse>> {

        return api.put(`${NOTE_BASE}/${noteId}`, data);
    }

    // Delete note by note id.
    async deleteNoteById(noteId: string): Promise<ApiResponse<null>> {
        return api.delete(`${NOTE_BASE}/${noteId}`);
    }

    // Create new post comment.
    async createNote(data: CreateNoteRequest): Promise<ApiResponse<CreateNoteResponse>> {
        return api.post(`${NOTE_BASE}`, data);
    }

}

const noteService = new NoteService();

export default noteService;