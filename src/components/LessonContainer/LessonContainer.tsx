import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LearningStatus } from '../../constants/learningStatus';
import { TargetType } from '../../constants/targetType';
import lessonService from '../../services/lessonService';
import progressService from '../../services/progressService';
import { Lesson, mapLessonResponseToLesson } from '../../types/lesson';
import { mapNoteResponsesToNotes, Note, NoteResponse } from '../../types/note';
import { Resource } from '../../types/resource';
import { toTimestamp } from '../../utils/dateUtils';
import { getStatusBadgeClass, getStatusClass, getStatusText } from '../../utils/lessonUtils';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import Input from '../Input/Input';
import ConfirmModal from '../Modal/ConfirmModal/ConfirmModal';
import NoteContainer from '../NoteContainer/NoteContainer';
import ResourceContainer from '../ResourceContainer/ResourceContainer';
import './LessonContainer.css';


interface LessonContainerProps {
    topicId: string;
    lesson: Lesson;
    isEdit: boolean;
    onLessonCreate: (lesson: Lesson) => void;
    onLessonUpdate: (lesson: Lesson) => void;
    onLessonDelete: (lessonId: string) => void;
    onStatusChange: (lessonId: string, newStatus: Lesson['status']) => void;
    onResourceView: (resource: Resource) => void;
    onResourceDelete: (resourceId: string) => void;
    onResourceAdd: (lessonId: string) => void;
}

const LessonContainer: React.FC<LessonContainerProps> = ({
    topicId,
    lesson,
    isEdit,
    onLessonCreate,
    onLessonUpdate,
    onLessonDelete,
    onStatusChange,
    onResourceView,
    onResourceDelete,
    onResourceAdd
}) => {
    const [isExpanded, setIsExpanded] = useState(lesson.isExpanded || false);

    const [isEditingData, setIsEditingData] = useState(false);
    const [editTitle, setEditTitle] = useState(lesson.title);
    const [editRangeDate, setEditRangeDate] = useState<{ startDate: string; endDate: string }>({
        startDate: '',
        endDate: ''
    });

    const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);

    const [notes, setNotes] = useState<NoteResponse[]>([]);


    const handleDateChange = (range: { startDate: string; endDate: string }) => {
        setEditRangeDate({ startDate: range.startDate, endDate: range.endDate });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditTitle(e.target.value);
    };

    const handleNotesChange = (notes: Note[]) => {
        setNotes(notes);
    };

    const handleStatusClick = () => {
        if (!lesson.isUnlocked) return;

        let newStatus: Lesson['status'];
        switch (lesson.status) {
            case LearningStatus.NOT_STARTED:
                newStatus = LearningStatus.IN_PROGRESS;
                break;
            case LearningStatus.IN_PROGRESS:
                newStatus = LearningStatus.COMPLETED;
                break;
            case LearningStatus.COMPLETED:
                newStatus = LearningStatus.OVERDUE;
                break;
            case LearningStatus.OVERDUE:
                newStatus = LearningStatus.NOT_STARTED;
                break;
            default:
                newStatus = LearningStatus.NOT_STARTED;
        }

        handleUpdateLessonStatus(newStatus);
        onStatusChange(lesson.id, newStatus);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSaveLesson = async () => {
        if (!topicId || !lesson) return;

        try {
            // Create lesson
            if (lesson.isLocal) {
                console.log("Start date: " + editRangeDate.startDate);
                console.log("End date: " + editRangeDate.endDate);

                const res = await lessonService.createLesson({
                    topicId: topicId, title: editTitle,
                    startTime: toTimestamp(editRangeDate.startDate),
                    endTime: toTimestamp(editRangeDate.endDate)
                });

                if (res.success && res.data) {
                    toast.success("Tạo mới bài học thành công!");
                    setIsEditingData(false);
                    onLessonCreate?.(mapLessonResponseToLesson(res.data));
                }
            }
            // Update lesson
            else {
                if (lesson.title === editTitle ||
                    lesson.startTime === editRangeDate.startDate ||
                    lesson.endTime === editRangeDate.startDate) {
                    setIsEditingData(false);
                    return;
                }

                const res = await lessonService.updateLessonByid(lesson.id, {
                    title: editTitle,
                    startTime: toTimestamp(editRangeDate.startDate),
                    endTime: toTimestamp(editRangeDate.endDate)
                });

                if (res.success && res.data) {
                    toast.success("Cập nhật bài học thành công!");
                    setIsEditingData(false);
                    onLessonUpdate?.(mapLessonResponseToLesson(res.data));
                }
            }
        }
        catch {
            toast.error("Có lỗi xảy ra!");
        }
    }

    const handleUpdateLessonStatus = async (status: LearningStatus) => {
        if (!lesson) return;

        try {
            const res = await progressService.updateProgress({
                lessonId: lesson.id, status: status
            });
            if (res.success) {
                toast.success("Thay đổi trạng thái thành công!");
            }
        }
        catch {
            toast.error("Có lỗi xảy ra!");
        }
    }

    const handleDeleteLesson = async () => {
        if (!lesson) return;

        if (lesson.isLocal) {
            onLessonDelete(lesson.id);
            toast.success("Xóa bài học thành công!");
            return;
        }

        try {
            const res = await lessonService.deleteLessonById(lesson.id);
            if (res.success) {
                toast.success("Xóa bài học thành công!");
                setShowDeleteLessonModal(false);
                setIsEditingData(false);
                onLessonDelete(lesson.id);
            }
        }
        catch {
            toast.error("Có lỗi xảy ra!");
        }
    }

    // Fecth all notes by lesson id.
    useEffect(() => {
        if (!lesson || lesson.isLocal) return;

        const fetchNotesByLessonId = async (lessonId: string) => {
            const response = await lessonService.getAllNotesByLessonId(lessonId);
            if (response != null && response.data) {
                setNotes(mapNoteResponsesToNotes(response.data));
            }
        };

        fetchNotesByLessonId(lesson.id);
    }, [lesson]);

    useEffect(() => {
        setEditRangeDate({
            startDate: lesson.startTime ?? '',
            endDate: lesson.endTime ?? ''
        });
    }, [lesson.id]);

    return (
        <div className={`lesson ${!lesson.isUnlocked ? 'lesson-disabled' : ''}`}>
            <div className="lesson-header">
                <div className="lesson-left">
                    <div
                        className={`lesson-status ${getStatusClass(lesson)} ${!lesson.isUnlocked ? 'disabled' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStatusClick();
                        }}
                        title={getStatusText(lesson)}
                    ></div>

                    {/* TITLE + BADGE — EXPAND */}
                    <div className="lesson-main">
                        {isEdit && isEditingData ? (
                            <Input
                                value={editTitle}
                                onChange={handleTitleChange}
                                focusColor='#4361ee'
                                autoFocus={true}
                            />
                        ) : (
                            <h4
                                className={`lesson-title ${!lesson.isUnlocked ? 'lesson-title-disabled' : ''}`}
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    isEdit && setIsEditingData(true);
                                }}
                            >
                                {lesson.title}
                            </h4>
                        )}

                        <span className={`status-badge ${getStatusBadgeClass(lesson)}`}>
                            {getStatusText(lesson)}
                        </span>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="lesson-actions">
                    {isEdit && lesson.isUnlocked && (
                        <>
                            {isEditingData ? (
                                <>
                                    {/* SAVE */}
                                    <i
                                        className="fas fa-check save-lesson-btn"
                                        title="Lưu bài học"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSaveLesson();
                                        }}
                                    ></i>

                                    {/* CANCEL */}
                                    <i
                                        className="fas fa-times cancel-lesson-btn"
                                        title="Hủy chỉnh sửa"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditingData(false);
                                        }}
                                    ></i>
                                </>
                            ) : (
                                <>
                                    {/* EDIT */}
                                    <i
                                        className="fas fa-edit edit-lesson-btn"
                                        title="Chỉnh sửa bài học"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditingData(true);
                                            setIsExpanded(true);
                                        }}
                                    ></i>

                                    {/* DELETE */}
                                    <i
                                        className="fas fa-trash delete-note-btn"
                                        title="Xóa bài học"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDeleteLessonModal(true);
                                        }}
                                    ></i>
                                </>
                            )}
                        </>
                    )}

                    <i
                        className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} toggle-lesson`}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand();
                        }}
                    ></i>
                </div>
            </div>

            {/* CONTENT */}
            {isExpanded && (
                <div className="lesson-content">

                    <div className="lesson-date-range">
                        <DateRangePicker
                            key={isEditingData ? "edit" : "view"}
                            startDate={lesson.startTime}
                            endDate={lesson.endTime}
                            startDateLabel="Ngày bắt đầu bài học"
                            endDateLabel="Ngày kết thúc bài học"
                            editable={isEditingData && lesson.isUnlocked}
                            onChange={handleDateChange}
                            backgroundColor={!isEdit ? '#fff' : '#e3f2fd'}
                            borderColor="#ccc"
                            fontSize="14px"
                        />
                    </div>

                    {!lesson.isLocal && (
                        <ResourceContainer
                            lessonId={lesson.id}
                            isEdit={isEdit}
                            isUnlocked={lesson.isUnlocked ?? false}
                            onResourceView={onResourceView}
                            onResourceDelete={(resourceId) =>
                                onResourceDelete(resourceId)
                            }
                            onResourceAdd={() => { }}
                        />
                    )}

                    <div className="lesson-notes">
                        <NoteContainer
                            initialNotes={notes}
                            targetType={TargetType.LESSON}
                            targetId={lesson.id}
                            onNotesChange={handleNotesChange}
                            placeholder="Thêm ghi chú cho bài học"
                            isEdit={isEdit}
                        />
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={showDeleteLessonModal}
                title="Xác nhận xóa bài học"
                message="Bạn có chắc chắn muốn xóa bài học này không?"
                onCancel={() => setShowDeleteLessonModal(false)}
                onConfirm={handleDeleteLesson}
            />
        </div>
    );
};

export default LessonContainer;