import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TargetType } from '../../constants/targetType';
import noteService from '../../services/noteService';
import { Note } from '../../types/note';
import { getErroMessageByCode } from '../../utils/handleError';
import Button from '../Button/Button';
import Input from '../Input/Input';
import TextArea from '../TextArea/TextArea';
import './NoteContainer.css';
import ConfirmModal from '../Modal/ConfirmModal/ConfirmModal';


interface NoteContainerProps {
    initialNotes?: Note[];
    targetType?: TargetType;
    targetId?: string;
    onNotesChange?: (notes: Note[]) => void;
    placeholder?: string;
    isEdit?: boolean;
}

const NoteContainer: React.FC<NoteContainerProps> = ({
    initialNotes = [],
    onNotesChange,
    targetType,
    targetId,
    placeholder = "Thêm ghi chú mới...",
    isEdit = false
}) => {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [isAdding, setIsAdding] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
    const [noteIdToDelete, setNoteIdToDelete] = useState('');

    useEffect(() => {
        const sorted = [...initialNotes].sort((a, b) => a.displayIndex - b.displayIndex);
        setNotes(sorted);
    }, [initialNotes]);

    const handleEditNote = (note: Note) => {
        setEditingNoteId(note.noteId);
        setEditTitle(note.title);
        setEditContent(note.content);
    };

    const handleSaveEdit = async () => {
        if (editingNoteId) {
            try {
                const res = await noteService.updateNoteById(editingNoteId, {
                    title: editTitle,
                    content: editContent
                });

                if (res.success && res.data) {
                    const updatedNote = res.data as Note;
                    setNotes(prev => {
                        const updated = prev.map(note =>
                            note.noteId === editingNoteId ? updatedNote : note
                        );
                        onNotesChange?.(updated);

                        return updated;
                    });

                    setEditingNoteId(null);
                    setEditTitle('');
                    setEditContent('');
                    toast.success("Cập nhật ghi chú thành công!");
                }
            }
            catch {
                toast.error("Cập nhật ghi chú thất bại!");
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditTitle('');
        setEditContent('');
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
            if (!noteId) return;

            const res = await noteService.deleteNoteById(noteId);
            if (res.success) {
                onNotesChange?.(initialNotes.filter(n => n.noteId !== noteId));
                setShowDeleteNoteModal(false);
                toast.success('Xóa ghi chú thành công!');
            }
        }
        catch {

        }
    };

    const handleAddNote = async () => {
        try {
            if (!targetType || !targetId) return;

            const res = await noteService.createNote({
                targetType,
                targetId,
                title: newNoteTitle.trim() || "Ghi chú không có tiêu đề",
                content: newNoteContent
            });

            if (res.success && res.data) {
                const newNote = res.data as Note;

                setNotes(prev => {
                    const updated = [...prev, newNote];
                    onNotesChange?.(updated);
                    return updated;
                });

                setNewNoteTitle("");
                setNewNoteContent("");
                setIsAdding(false);

                toast.success("Tạo ghi chú thành công!");
            }
        } catch (errRes: any) {
            toast.error(getErroMessageByCode(errRes.error.code));
        }
    }

    return (
        <div className="note-container">
            {notes.length > 0 && (
                notes.map(note => (
                    <div key={note.noteId} className="note">
                        <div className="note-header">
                            {editingNoteId === note.noteId ? (
                                <Input
                                    placeholder="Tiêu đề ghi chú"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    focusColor='#3498db'
                                    background='#fff'
                                />
                            ) : (
                                <div className="note-title">{note.title}</div>
                            )}
                            <div className="note-actions">
                                {editingNoteId === note.noteId ? (
                                    <div className='note-actions-edit'>
                                        <i
                                            className="fas fa-check save-note-btn"
                                            title="Lưu"
                                            onClick={handleSaveEdit}
                                        ></i>
                                        <i
                                            className="fas fa-times cancel-note-btn"
                                            title="Hủy"
                                            onClick={handleCancelEdit}
                                        ></i>
                                    </div>
                                ) : (
                                    isEdit && (
                                        <div className='note-actions-creare'>
                                            <i
                                                className="fas fa-edit edit-note-btn"
                                                title="Chỉnh sửa"
                                                onClick={() => handleEditNote(note)}
                                            ></i>
                                            <i
                                                className="fas fa-trash delete-note-btn"
                                                title="Xóa"
                                                onClick={() => {
                                                    setShowDeleteNoteModal(true);
                                                    setNoteIdToDelete(note.noteId);
                                                }}
                                            ></i>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="note-content">
                            {editingNoteId === note.noteId ? (
                                <TextArea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder="Nội dung ghi chú..."
                                    rows={3}
                                    focusColor='#3498db'
                                    backgroundColor='#fff'
                                />
                            ) : (
                                note.content
                            )}
                        </div>
                    </div>
                ))
            )}

            {isEdit && isAdding ? (
                <div className="note add-note-form">
                    <div className="note-header">
                        <Input
                            value={newNoteTitle}
                            placeholder="Tiêu đề ghi chú"
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            focusColor='#3498db'
                            autoFocus={true}
                        />
                    </div>
                    <div className="note-content">
                        <TextArea
                            placeholder="Nội dung ghi chú..."
                            value={newNoteContent}
                            focusColor='#3498db'
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="note-actions-row">
                        <Button
                            text='Hủy'
                            icon='fas fa-times'
                            onClick={() => setIsAdding(false)}
                            backgroundColor='#f8f9fa'
                            border='1px solid #cccccc'
                            textColor='#514848'
                            fullWidth={false}
                        />
                        <Button
                            text='Lưu'
                            icon='fas fa-save'
                            onClick={handleAddNote}
                            disabled={!newNoteContent.trim()}
                            backgroundColor='#3498db'
                            fullWidth={false}
                        />
                    </div>
                </div>
            ) : (
                isEdit && (
                    <Button
                        text={placeholder}
                        icon='fas fa-plus'
                        onClick={() => setIsAdding(true)}
                        fullWidth={false}
                        backgroundColor='#ffffff'
                        textColor='#3498db'
                        border='1px solid #3498db'
                        fontWeight='bold'
                    />
                )
            )}

            {/* {notes.length === 0 && !isAdding && !isEdit && (
                <div className="empty-notes">
                    <i className="fas fa-sticky-note"></i>
                    <p>Chưa có ghi chú nào</p>
                </div>
            )} */}

            <ConfirmModal
                isOpen={showDeleteNoteModal}
                title="Xác nhận xóa ghi chú"
                message="Bạn có chắc chắn muốn xóa ghi chú này không?"
                onCancel={() => setShowDeleteNoteModal(false)}
                onConfirm={() => { handleDeleteNote(noteIdToDelete) }}
            />
        </div>
    );
};

export default NoteContainer;