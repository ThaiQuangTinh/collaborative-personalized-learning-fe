import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LearningStatus } from '../../constants/learningStatus';
import { TargetType } from '../../constants/targetType';
import topicService from '../../services/topicService';
import { Lesson, mapLessonResponsesToLessons } from '../../types/lesson';
import { mapNoteResponsesToNotes, Note } from '../../types/note';
import { mapTopicResponseToTopic, Topic } from '../../types/topic';
import { formatDate } from '../../utils/dateUtils';
import { generateId } from '../../utils/idUtils';
import Button from '../Button/Button';
import Input from '../Input/Input';
import LessonContainer from '../LessonContainer/LessonContainer';
import ConfirmModal from '../Modal/ConfirmModal/ConfirmModal';
import NoteContainer from '../NoteContainer/NoteContainer';
import './TopicContainer.css';

interface TopicContainerProps {
    pathId: string;
    topic: Topic;
    isEdit: boolean;
    onTopicCreate: (topic: Topic) => void;
    onTopicUpdate: (topic: Topic) => void;
    onTopicDelete: (topicId: string) => void;
    onLessonCreate: (topicId: string, lesson: Lesson) => void;
    onLessonUpdate: (topicId: string, lesson: Lesson) => void;
    onLessonDelete: (topicId: string, lessonId: string) => void;
    onLessonStatusChange: (lessonStatus: LearningStatus) => void;
}

const TopicContainer: React.FC<TopicContainerProps> = ({
    pathId,
    topic,
    isEdit,
    onTopicCreate,
    onTopicUpdate,
    onTopicDelete,
    onLessonCreate,
    onLessonUpdate,
    onLessonDelete,
    onLessonStatusChange
}) => {
    const [isExpanded, setIsExpanded] = useState(topic.isExpanded || false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState(topic.title);

    const [showDeleteTopicModal, setShowDeleteTopicModal] = useState(false);

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditTitle(e.target.value);
    };

    const handleTitleCancel = () => {
        setEditTitle(topic.title);
        setIsEditingTitle(false);
    };

    const handleNotesChange = (notes: Note[]) => {
        setNotes(notes);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddLesson = () => {
        const newLesson: Lesson = {
            id: generateId(),
            title: "Bài học mới",
            startTime: new Date().toISOString().split("T")[0],
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            status: LearningStatus.NOT_STARTED,
            displayIndex: 9999,
            isUnlocked: true,
            isExpanded: true,
            isLocal: true,
            notes: [],
            resources: [],
        };

        setLessons(prev => [...prev, newLesson]);
    }

    const handleCreateLesson = (newLesson: Lesson) => {
        const updatedLessons = [...lessons.filter(l => !l.isLocal), newLesson];

        setLessons(updatedLessons);

        onLessonCreate(topic.id, newLesson);
    };

    const handleDeleteLesson = (lessonId: string) => {
        if (!lessonId) return;

        const updatedLessons = lessons.filter(l => l.id !== lessonId) ?? [];

        setLessons(updatedLessons);

        onLessonDelete(topic.id, lessonId);
    };

    const handleUpdateLesson = (lessonUpdated: Lesson) => {
        if (!lessonUpdated) return;

        const updatedLessons = lessons.map(l => l.id === lessonUpdated.id ? lessonUpdated : l) ?? [];

        setLessons(updatedLessons);

        onLessonCreate(topic.id, lessonUpdated);
    };

    const handleSaveTopic = async () => {
        try {
            if (!pathId || editTitle === topic.title) return;

            // Create new topic
            if (topic.isLocal) {
                const res = await topicService.createTopic({ pathId: pathId, title: editTitle });
                if (res.success && res.data) {
                    toast.success("Tạo mới chủ đề thành công!");
                    onTopicCreate(mapTopicResponseToTopic(res.data));
                    setIsEditingTitle(false);
                }
            }
            // Update topic 
            else {
                const res = await topicService.updateTopicById(topic.id, { title: editTitle });
                if (res.success && res.data) {
                    toast.success("Cập nhật chủ đề thành công!");
                    onTopicUpdate(mapTopicResponseToTopic(res.data));
                    setIsEditingTitle(false);
                }
            }
        }
        catch {
            toast.error("Có lỗi xảy ra!");
        }
    };

    const handleDeleteTopic = async () => {
        if (!topic) return;

        if (topic.isLocal) {
            toast.success("Xóa chủ đề thành công!");
            onTopicDelete(topic.id);
        } else {
            try {
                const res = await topicService.deleteTopicById(topic.id);
                if (res.success) {
                    toast.success("Xóa chủ đề thành công!");
                    onTopicDelete(topic.id);
                }
            }
            catch {
                toast.error("Có lỗi xảy ra!");
            }
        }
    };

    // Fetch topic by topic id.
    useEffect(() => {
        if (!topic || topic.isLocal) return;

        const fetchLessonByTopicId = async (topicId: string) => {
            const response = await topicService.getAllLessonsByTopicId(topicId);
            if (response != null && response.data) {
                setLessons(mapLessonResponsesToLessons(response.data));
            }
        };

        fetchLessonByTopicId(topic.id);
    }, [topic]);


    // Fetch notes by topic id.
    useEffect(() => {
        if (!topic || topic.isLocal) return;

        const fetchNotesByTopicId = async (topicId: string) => {
            const response = await topicService.getAllNotesByTopicId(topicId);
            if (response != null && response.data) {
                setNotes(mapNoteResponsesToNotes(response.data));
            }
        };

        fetchNotesByTopicId(topic.id);
    }, [topic]);

    return (
        <div className="topic">
            <div className="topic-header">
                <div className="topic-title">
                    <i className="fas fa-grip-vertical drag-handle"></i>
                    {isEdit && isEditingTitle ? (
                        <div className="title-edit-container">
                            <Input
                                value={editTitle}
                                onChange={handleTitleChange}
                                autoFocus={true}
                                focusColor='#4361ee'
                                background='#fff'
                            />
                        </div>
                    ) : (
                        <span onDoubleClick={() => isEdit && setIsEditingTitle(true)}>
                            {topic.title}
                        </span>
                    )}
                </div>
                <div className="topic-actions">
                    {isEdit && (
                        <>
                            {isEditingTitle ? (
                                <>
                                    {/* Icon save */}
                                    <i
                                        className="fas fa-check save-topic-btn"
                                        title="Lưu chủ đề"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditingTitle(false);
                                            handleSaveTopic();
                                        }}
                                    ></i>

                                    {/* Icon cancel */}
                                    <i
                                        className="fas fa-times cancel-topic-btn"
                                        title="Hủy chỉnh sửa"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTitleCancel();
                                        }}
                                    ></i>
                                </>
                            ) : (
                                <>
                                    {/* Icon edit */}
                                    <i
                                        className="fas fa-edit edit-topic-btn"
                                        title="Chỉnh sửa chủ đề"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditingTitle(true);
                                            setIsExpanded(true);
                                        }}
                                    ></i>

                                    {/* Icon xóa */}
                                    <i
                                        className="fas fa-trash delete-topic-btn"
                                        title="Xóa chủ đề"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDeleteTopicModal(true);
                                        }}
                                    ></i>
                                </>
                            )}
                        </>
                    )}
                    {/* Toggle expand */}
                    <i
                        className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} toggle-topic`}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand();
                        }}
                    ></i>
                </div>

            </div>

            {isExpanded && (
                <div className="topic-content">
                    <div className="topic-date-content">
                        {!topic.isLocal && topic.startTime && (
                            <h4 className='topic-time-title'>Thời gian chủ đề:
                                <span className='topic-time'>
                                    {formatDate(topic.startTime)} - {formatDate(topic.endTime)}
                                </span>
                            </h4>
                        )}
                    </div>

                    <div className="topic-notes">
                        <NoteContainer
                            initialNotes={notes}
                            targetType={TargetType.TOPIC}
                            targetId={topic.id}
                            onNotesChange={handleNotesChange}
                            placeholder="Thêm ghi chú cho chủ đề"
                            isEdit={isEdit}
                        />
                    </div>

                    {lessons.length > 0 && (
                        <div className="lessons-container">
                            <h4 className="lessons-title">
                                <i className="fas fa-book"></i> Bài học ({lessons.length})
                            </h4>
                            {[...lessons]
                                .sort((a, b) => (a.displayIndex ?? 0) - (b.displayIndex ?? 0))
                                .map(lesson => (
                                    <LessonContainer
                                        key={lesson.id}
                                        topicId={topic.id}
                                        lesson={lesson}
                                        isEdit={isEdit}
                                        onLessonCreate={handleCreateLesson}
                                        onLessonUpdate={handleUpdateLesson}
                                        onLessonDelete={handleDeleteLesson}
                                        onStatusChange={(lessonId, newStatus) => {
                                            setLessons(prev =>
                                                prev.map(l => (l.id === lessonId ? { ...l, status: newStatus } : l))
                                            );
                                            onLessonStatusChange(newStatus);
                                        }}
                                        onResourceView={() => { }}
                                        onResourceDelete={() => { }}
                                        onResourceAdd={() => { }}
                                    />
                                ))
                            }

                        </div>
                    )}

                    {
                        (lessons.length === 0 && !isEdit) && (
                            <div className='lesson-empty'>
                                <i className="fa-solid fa-book"></i>
                                <span>Chưa có bài học nào</span>
                            </div>
                        )
                    }

                    {isEdit && (
                        <Button
                            text='Thêm bài học'
                            icon='fas fa-plus'
                            textColor='#ffff'
                            backgroundColor='#3498db'
                            fullWidth={false}
                            onClick={handleAddLesson}
                        />
                    )}
                </div>
            )}

            <ConfirmModal
                isOpen={showDeleteTopicModal}
                title="Xác nhận xóa chủ đề"
                message="Bạn có chắc chắn muốn xóa chủ đề này không?"
                onCancel={() => setShowDeleteTopicModal(false)}
                onConfirm={handleDeleteTopic}
            />
        </div>
    );
};

export default TopicContainer;