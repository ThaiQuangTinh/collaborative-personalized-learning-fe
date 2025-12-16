import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import FormLabel from '../../components/FormLabel/FormLabel';
import Input from '../../components/Input/Input';
import LearningPathStats from '../../components/LearningPathStats/LearningPathStats';
import ConfirmModal from '../../components/Modal/ConfirmModal/ConfirmModal';
import ShareLearningPathModal from '../../components/Modal/ShareLearningPathModalContent/ShareLearningPathModal';
import MoreOptionsDropdown from '../../components/MoreOptionsDropdown/MoreOptionsDropdown';
import NoteContainer from '../../components/NoteContainer/NoteContainer';
import TagManager from '../../components/TagManager/TagManager';
import TextArea from '../../components/TextArea/TextArea';
import TopicContainer from '../../components/TopicContainer/TopicContainer';
import { LearningStatus } from '../../constants/learningStatus';
import { SharePathPermission } from '../../constants/sharePermission';
import { TargetType } from '../../constants/targetType';
import { useAuth } from '../../hooks/useAuth';
import useRouteNavigation from '../../hooks/useNavigation';
import learningPathService from '../../services/learningPathService';
import { LearningPath, LearningPathStatisticResponse, mapLearningPathResponseToLearningPath } from '../../types/learningPath';
import { mapNoteResponsesToNotes, Note } from '../../types/note';
import { mapTagResponsesToTags, Tag } from '../../types/tag';
import { mapTopicResponsesToTopics, Topic } from '../../types/topic';
import { formatDate } from '../../utils/dateUtils';
import { getErroMessageByCode } from '../../utils/handleError';
import { generateId } from '../../utils/idUtils';
import './LearningPathDetail.css';
import { Lesson } from '../../types/lesson';

const LearningPathDetail: React.FC = () => {

    const [isEditMode, setIsEditMode] = useState(false);

    const location = useLocation();
    const { pathId } = useParams<{ pathId: string }>();

    const { user } = useAuth();
    const [isShareMode, setIsShareMode] = useState(false);
    const [sharePermission, setSharePermission] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    const [realPathId, setRealPathId] = useState<string | null>(null);
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
    const [editTitle, setEditTitle] = useState(learningPath?.title ?? '');
    const [editDescription, setEditDescription] = useState(learningPath?.description ?? '');
    const [titleError, setTitleError] = useState<string | null>(null);
    const [showShareLearningPathModal, setShareLearningPathModal] = useState(false);

    const [learningPathStatistic, setLearningPathStatistic] = useState<LearningPathStatisticResponse | null>(null);

    const [showConfirmDeletePath, setShowConfirmDeletePath] = useState(false);
    const [showConfirmArchivePath, setShowCofirmArchivePath] = useState(false);

    const { toLearningPath } = useRouteNavigation();

    const handleTopicCreate = (newTopic: Topic) => {
        setLearningPath(prev => {
            if (!prev) return prev;

            const prevTopic = prev.topics.filter(topic => !topic.isLocal);

            return {
                ...prev,
                topics: [...prevTopic, newTopic]
            };
        });
    };

    const handleTopicUpdate = (updatedTopic: Topic) => {
        setLearningPath(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                topics: prev.topics.map(topic =>
                    topic.id === updatedTopic.id ? updatedTopic : topic
                ),
            }
        });
    };

    const handleTopicDelete = (topicId: string) => {
        setLearningPath(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                topics: prev.topics.filter(topic =>
                    topic.id !== topicId
                ),
            }
        });
    };

    const handleAddTopic = () => {
        const newTopic: Topic = {
            id: generateId(),
            title: 'Chủ đề mới',
            startTime: '',
            endTime: '',
            notes: [],
            lessons: [],
            isExpanded: true,
            displayIndex: 1000,
            status: LearningStatus.NOT_STARTED,
            isLocal: true
        };

        setLearningPath(prev => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                topics: [...prev.topics, newTopic],
            };
            return updated;
        });
    };

    const handleSaveChanges = async () => {
        try {
            if (!realPathId) return;

            const res = await learningPathService.updateLearningPathById(
                realPathId, { title: editTitle, description: editDescription }
            );

            if (res.success) {
                setLearningPath(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        title: res.data?.title ?? prev.title,
                        description: res.data?.description ?? prev.description
                    };
                });

                toast.success("Cập nhật thông tin lộ trình thành công!");
                setIsEditMode(false);
            }
        } catch (errRes: any) {
            toast.error(getErroMessageByCode(errRes.error.code));
        }
    };

    const handleTagChange = (updatedTags: Tag[]) => {
        setLearningPath((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                tags: updatedTags
            }
        })
    };

    const handleNotesChange = (notes: Note[]) => {
        setLearningPath((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                notes: notes
            }
        })
    };

    const handleCloneLearningPath = async () => {
        if (!pathId || !user?.userId) return;

        const token = pathId;

        try {
            const res = await learningPathService.cloneLearningPathFromShare(token);
            if (res.success) {
                toast.success("Sao chép lộ trình thành công!");
            }
        } catch (errRes: any) {
            toast.error(getErroMessageByCode(errRes.error.code));
        }
    };

    const handleDeleteLearningPath = async () => {
        if (!realPathId) return;

        try {
            const res = await learningPathService.deleteLearningPath({ pathIds: [realPathId] });
            if (res.success) {
                toast.success("Xóa lộ trình thành công!");
                toLearningPath();
            }
        }
        catch {
            toast.error("Có lỗi khi xóa lộ trình!");
        }
    };

    const handleArchiveLearningPath = async () => {
        if (!realPathId) return;

        try {
            const res = await learningPathService.archiveLearningPathByPathId(realPathId);
            if (res.success) {
                toast.success("Lưu trữ lộ trình thành công!");
                toLearningPath();
            }
        }
        catch {
            toast.error("Có lỗi khi lưu trữ lộ trình!");
        }
    };

    const handleExportJsonLearningPath = async () => {
        if (!realPathId) return;

        try {
            const res = await learningPathService.exportLearningPaths({
                pathIds: [realPathId]
            });

            if (res.status !== 200) {
                const errorBlob = res.data;
                const errorText = await errorBlob.text();
                console.error("Server error:", errorText);

                toast.error("Có lỗi khi export!");
                return;
            }

            // Nếu OK → tạo file
            const blob = res.data;
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `learning_path_export_${realPathId}.json`;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("EXPORT ERROR:", err);
            toast.error("Có lỗi khi export lộ trình!");
        }
    };

    const handleLessonStatusChange = async (lessonStatus: LearningStatus) => {
        if (lessonStatus === LearningStatus.IN_PROGRESS) return;

        if (!learningPathStatistic) return;

        let completedLessons = learningPathStatistic.completedLessons;
        let remainingLessons = learningPathStatistic.remainingLessons;

        if (lessonStatus === LearningStatus.COMPLETED) {
            completedLessons += 1;
            remainingLessons -= 1;
        } else {
            completedLessons -= 1;
            remainingLessons += 1;
        }

        const overallProgress = learningPathStatistic.totalLessons === 0
            ? 0
            : Math.floor((completedLessons * 100) / learningPathStatistic.totalLessons);

        setLearningPathStatistic(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                completedLessons,
                remainingLessons,
                overallProgress
            };
        });

        try {
            if (realPathId) {
                await learningPathService.updateLearningPathProgressPercent(
                    realPathId,
                    { progressPercent: overallProgress }
                );
            }
        } catch {
            console.error("Update progress failed");
        }
    };

    const handleLessonCreate = (topicId: string, lesson: Lesson) => {
        setLearningPath(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                topics: prev.topics.map(topic => {
                    if (topic.id !== topicId) return topic;

                    const newLesson: Lesson = {
                        ...lesson,
                        displayIndex: topic.lessons.length + 1,
                    };

                    return {
                        ...topic,
                        lessons: [...topic.lessons, newLesson],
                    };
                }),
            };
        });
    };

    const handleLessonUpdate = (topicId: string, updatedLesson: Lesson) => {
        setLearningPath(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                topics: prev.topics.map(topic => {
                    if (topic.id !== topicId) return topic;

                    return {
                        ...topic,
                        lessons: topic.lessons.map(lesson =>
                            lesson.id === updatedLesson.id
                                ? { ...lesson, ...updatedLesson }
                                : lesson
                        ),
                    };
                }),
            };
        });
    };

    const handleLessonDelete = (topicId: string, lessonId: string) => {
        setLearningPath(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                topics: prev.topics.map(topic => {
                    if (topic.id !== topicId) return topic;

                    return {
                        ...topic,
                        lessons: topic.lessons.filter(
                            lesson => lesson.id !== lessonId
                        ),
                    };
                }),
            };
        });
    };

    // Sửa lại hàm fetchAll để nhận pathId làm tham số
    const fetchAll = async (pathIdToFetch: string) => {
        if (!pathIdToFetch) return;

        // Fetch learning path.
        const lpResp = await learningPathService.getLearningPathById(pathIdToFetch);
        if (!lpResp?.data) return;

        let learningPathData = mapLearningPathResponseToLearningPath(lpResp.data);

        const [tagsResp, topicsResp, notesResp] = await Promise.all([
            learningPathService.getTagsByLearningPathId(pathIdToFetch),
            learningPathService.getAllTopicsByPathId(pathIdToFetch),
            learningPathService.getAllNotesByPathId(pathIdToFetch)
        ]);

        learningPathData = {
            ...learningPathData,
            tags: tagsResp?.data ? mapTagResponsesToTags(tagsResp.data) : [],
            topics: topicsResp?.data ? mapTopicResponsesToTopics(topicsResp.data) : [],
            notes: notesResp?.data ? mapNoteResponsesToNotes(notesResp.data) : []
        };

        setLearningPath(learningPathData);
    };

    useEffect(() => {
        const initializeData = async () => {
            const query = new URLSearchParams(location.search);
            const perm = query.get("perm");

            if (location.pathname.includes("/share") && perm) {
                setIsShareMode(true);
                const token = pathId;

                try {
                    if (!token) return;

                    const res = await learningPathService.getLearningPathFromShareToken(token);
                    if (res.success && res.data) {
                        setSharePermission(res.data?.sharePermission);
                        setRealPathId(res.data.pathId);
                        setIsOwner(user?.userId === res.data.shareByUserId);

                        // Fetch data ngay sau khi có realPathId
                        await fetchAll(res.data.pathId);
                    } else {
                        toast.error("Link chia sẻ không hợp lệ!");
                    }
                }
                catch {
                    toast.error("Có lỗi xảy ra!");
                }
            } else {
                const newRealPathId = pathId || null;
                setRealPathId(newRealPathId);

                const isEdit = query.get("edit");
                setIsEditMode(isEdit === 'true');

                // Fetch data ngay sau khi có realPathId
                if (newRealPathId) {
                    await fetchAll(newRealPathId);
                }
            }
        };

        initializeData();
    }, [location.pathname, pathId]);

    // Fetch statistic of learning path.
    useEffect(() => {
        const fetchStatisticLearningPath = async () => {
            if (!realPathId) return;

            const response = await learningPathService.getStatisticsInfoByPathId(realPathId);
            if (response != null && response.data) {
                setLearningPathStatistic(response.data);
            }
        }

        fetchStatisticLearningPath();
    }, [realPathId]);

    useEffect(() => {
        console.log(learningPath);

        if (learningPath) {
            setEditTitle(learningPath.title);
            setEditDescription(learningPath.description);
        }
    }, [learningPath]);

    return (
        <div className="learning-path-detail">
            <div className={`learning-path-container ${(!isShareMode || isOwner) ? 'lp-share-mode' : ''}`}>
                <div className="main-content">
                    <div className="learning-path-info">
                        <div className="info-section">
                            {isEditMode ? (
                                <div className="edit-name-container">
                                    <FormLabel text='Tên lộ trình' required margin='20px 0 10px 0' />
                                    <Input
                                        placeholder='Nhập tên lộ trình'
                                        value={editTitle}
                                        onChange={(e) => {
                                            setEditTitle(e.target.value);
                                            if (titleError && e.target.value.trim()) setTitleError(null);
                                        }}
                                        onBlur={() => {
                                            if (!editTitle.trim()) {
                                                setTitleError("Tên lộ trình không được để trống");
                                            } else {
                                                setTitleError(null);
                                            }
                                        }}
                                        autoFocus
                                        name='title'
                                        error={titleError ?? undefined}
                                        focusColor='#3498db'
                                    />
                                </div>
                            ) : (
                                <h1
                                    className="learning-path-name"
                                    onDoubleClick={() => isEditMode}
                                >
                                    {learningPath?.title}
                                </h1>
                            )}

                            {!(sharePermission === SharePathPermission.VIEW) && (
                                <MoreOptionsDropdown
                                    className='learning-path-option'
                                    items={(!isShareMode || isOwner) ? [
                                        { icon: "fas fa-edit", label: "Chỉnh sửa", onClick: () => setIsEditMode(!isEditMode) },
                                        { icon: "fas fa-share-alt", label: "Chia sẻ", onClick: () => { setShareLearningPathModal(true) } },
                                        { icon: "fas fa-trash-alt", label: "Xóa", onClick: () => { setShowConfirmDeletePath(true) } },
                                        { icon: "fas fa-archive", label: "Lưu trữ", onClick: () => { setShowCofirmArchivePath(true) } },
                                        { icon: "fas fa-file-export", label: "Xuất json", onClick: () => { handleExportJsonLearningPath() } }
                                    ] : (
                                        [{ icon: "fa-regular fa-copy", label: "Sao chép", onClick: () => { handleCloneLearningPath() } }]
                                    )}
                                />
                            )}

                            {isEditMode ? (
                                <div className="edit-description-container">
                                    <FormLabel text='Mô tả lộ trình' margin='20px 0 20px 0' />
                                    <TextArea
                                        placeholder="Nhập mô tả cho lộ trình..."
                                        name="description"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        rows={3}
                                        border="1px solid #ddd"
                                        focusColor="#4361ee"
                                    />
                                </div>
                            ) : (
                                <p
                                    className="learning-path-description"
                                >
                                    {learningPath?.description}
                                </p>
                            )}
                        </div>

                        <div className="info-section time-panel">
                            <h4 className='info-section-title'>Thời gian lộ trình:
                                <span className='info-section-time'>
                                    {formatDate(learningPath?.startTime!)} - {formatDate(learningPath?.endTime!)}
                                </span>
                            </h4>
                        </div>

                        <div className="info-section">
                            <TagManager
                                tags={learningPath?.tags ?? []}
                                onTagsChange={handleTagChange}
                                isEditMode={isEditMode}
                            />
                        </div>

                        <div className="info-section">
                            <NoteContainer
                                initialNotes={learningPath?.notes}
                                targetType={TargetType.PATH}
                                targetId={realPathId || ''}
                                onNotesChange={handleNotesChange}
                                placeholder="Thêm ghi chú cho lộ trình"
                                isEdit={isEditMode}
                            />
                        </div>
                    </div>

                    {/* Danh sách chủ đề */}
                    <div className="topics-section">
                        <div className="section-header">
                            <h2>
                                <i className="fas fa-list-ul"></i> Chủ đề và Bài học
                            </h2>
                            {isEditMode && (
                                <Button
                                    text='Thêm chủ đề'
                                    icon='fas fa-plus'
                                    onClick={handleAddTopic}
                                    backgroundColor='#3498db'
                                    fullWidth={false}
                                />
                            )}
                        </div>


                        <div className="topics-list">
                            {learningPath?.topics
                                ?.slice()
                                .sort((a, b) => a.displayIndex - b.displayIndex)
                                .map(topic => (
                                    <TopicContainer
                                        key={topic.id}
                                        pathId={realPathId || ''}
                                        topic={topic}
                                        isEdit={isEditMode}
                                        onTopicCreate={handleTopicCreate}
                                        onTopicUpdate={handleTopicUpdate}
                                        onTopicDelete={handleTopicDelete}
                                        onLessonCreate={handleLessonCreate}
                                        onLessonUpdate={handleLessonUpdate}
                                        onLessonDelete={handleLessonDelete}
                                        onLessonStatusChange={handleLessonStatusChange}
                                    />
                                ))}

                            {learningPath?.topics.length === 0 && (
                                <div className="empty-state">
                                    <i className="fas fa-road"></i>
                                    <h3>Chưa có chủ đề nào</h3>
                                    <p>Bắt đầu bằng cách thêm chủ đề đầu tiên vào lộ trình của bạn</p>
                                </div>
                            )}
                        </div>

                        {isEditMode && (
                            <Button
                                text='Thêm chủ đề'
                                icon='fas fa-plus'
                                onClick={handleAddTopic}
                                backgroundColor='#3498db'
                                fullWidth
                            />
                        )}

                        {/* Nút lưu thay đổi */}
                        {isEditMode && (
                            <div className="save-actions">
                                <Button
                                    text='Lưu thay đổi'
                                    icon='fas fa-save'
                                    onClick={handleSaveChanges}
                                    fullWidth={false}
                                    backgroundColor='#3498db'
                                />

                                <Button
                                    text='Hủy bỏ'
                                    icon='fas fa-times'
                                    onClick={() => setIsEditMode(false)}
                                    fullWidth={false}
                                    backgroundColor='#fff'
                                    textColor='#3498db'
                                    border='1px solid #3498db'
                                />
                            </div>
                        )}
                    </div>
                </div>

                {(!isShareMode || isOwner) && (
                    <div className='sidebar-wrapper'>
                        <LearningPathStats statistic={learningPathStatistic} />
                    </div>
                )}
            </div>

            <ShareLearningPathModal
                isOpen={showShareLearningPathModal}
                onClose={() => { setShareLearningPathModal(false) }}
                pathId={realPathId || ''}
            />

            <ConfirmModal
                isOpen={showConfirmArchivePath}
                title="Xác nhận lưu trữ lộ trình"
                message="Bạn có chắc chắn muốn lưu trữ lộ trình này không?"
                onCancel={() => { setShowCofirmArchivePath(false) }}
                onConfirm={() => { handleArchiveLearningPath() }}
            />

            <ConfirmModal
                isOpen={showConfirmDeletePath}
                title="Xác nhận xóa lộ trình"
                message="Bạn có chắc chắn muốn xóa lộ trình này không?"
                onCancel={() => { setShowConfirmDeletePath(false) }}
                onConfirm={() => { handleDeleteLearningPath() }}
            />
        </div>
    );
};

export default LearningPathDetail;