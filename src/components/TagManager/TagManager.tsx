import React, { useEffect, useMemo, useState } from 'react';
import './TagManager.css';

import { mapTagResponsesToTags, Tag } from '../../types/tag';
import AppModal from '../Modal/AppModal/AppModal';
import TagModalContent from '../Modal/TagModalContent/TagModalContent';
import toast from 'react-hot-toast';
import tagService from '../../services/tagService';
import { useParams } from 'react-router-dom';
import learningPathTagService from '../../services/learningPathTagService';

interface TagManagerProps {
    tags: Tag[];
    onTagsChange: (tags: Tag[]) => void;
    isEditMode: boolean;
}

type ModalMode = 'create' | 'edit';

const TagManager: React.FC<TagManagerProps> = ({
    tags,
    onTagsChange,
    isEditMode,
}) => {

    const { pathId } = useParams<{ pathId: string }>();
    const [userTags, setUserTags] = useState<Tag[]>([]);
    const [modalMode, setModalMode] = useState<ModalMode | null>(null);
    const [activeTag, setActiveTag] = useState<Tag | null>(null);

    const unusedAvailableTags = useMemo(() => {
        return userTags.filter(
            userTag => !tags.some(t => t.id === userTag.id)
        );
    }, [userTags, tags]);


    /** Open create modal */
    const openCreateModal = () => {
        setModalMode('create');
        setActiveTag(null);
    };

    /** Open edit modal */
    const openEditModal = (tag: Tag) => {
        setModalMode('edit');
        setActiveTag(tag);
    };

    /** Khi modal save */
    const handleSave = (saved: Tag) => {
        if (modalMode === 'create') {
            setUserTags(prev => [...prev, saved]);
            toast.success("Tạo nhãn thành công");
        } else {
            onTagsChange(tags.map(t => t.id === saved.id ? saved : t));
            toast.success("Cập nhật nhãn thành công");
            closeModal();
        }
    };

    /** Khi modal xóa */
    const handleDeleteTag = () => {
        if (activeTag) {
            onTagsChange(tags.filter(t => t.id !== activeTag.id));
            setUserTags(prev => prev.filter(t => t.id !== activeTag.id));
            toast.success("Xóa nhãn thành công");
        }

        closeModal();
    };

    const handleDeletePathTag = async (tag: Tag) => {
        if (!tag || !pathId) return;

        try {
            const res = await learningPathTagService.deleteLearningPathTag({ pathId, tagId: tag.id });
            if (res.success) {
                onTagsChange(tags.filter(t => t.id !== tag.id));
                toast.success("Xóa nhãn của lộ trình thành công!");
            }
        } catch (errRes: any) {
            toast.error("Xóa nhãn của lộ trình thất bại");
        }
    }

    // Hanle when selected avaiable tag.
    const handleSelectAvailable = (tag: Tag) => {
        if (!tag) return;

        // // Remove tag of user
        // setUserTags((prev) => {
        //     return prev.filter(t => t.id !== tag.id)
        // });

        const alreadyInPath = tags.some(t => t.id === tag.id);
        if (!alreadyInPath) {
            onTagsChange([...tags, tag]);
        }

        toast.success("Thêm nhãn thành công!");
        closeModal();
    }

    const closeModal = () => {
        setModalMode(null);
        setActiveTag(null);
    };

    // Fetch all tag of current user.
    useEffect(() => {
        const fetchUserTags = async () => {
            const response = await tagService.getAllTagsByUser();
            if (response != null && response.data) {
                setUserTags(mapTagResponsesToTags(response.data));
            }
        };

        fetchUserTags();
    }, []);

    return (
        <div className="tag-manager">
            <h4>Nhãn: </h4>

            {!isEditMode ? (
                <div className="tags-container">
                    {tags.length ? (
                        tags.map((tag) => (
                            <div
                                key={tag.id}
                                className="tag view-tag"
                                style={{
                                    backgroundColor: `${tag.textColor}20`,
                                    color: tag.textColor
                                }}
                            >
                                <span className="tag-color" style={{ backgroundColor: tag.textColor }} />
                                {tag.tagName}
                            </div>
                        ))
                    ) : (
                        <div className="no-tags">Chưa có nhãn nào</div>
                    )}
                </div>
            ) : (
                <div className="tags-container">
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            className="tag edit-tag"
                            style={{
                                backgroundColor: `${tag.textColor}20`,
                                color: tag.textColor,
                            }}
                        >
                            <span className="tag-color" style={{ backgroundColor: tag.textColor }} />
                            <span style={{ flex: 1 }}>{tag.tagName}</span>

                            <i
                                className="fas fa-trash"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDeletePathTag(tag)}
                            />

                            <i
                                className="fas fa-edit"
                                style={{ cursor: 'pointer' }}
                                onClick={() => openEditModal(tag)}
                            />
                        </div>
                    ))}

                    <div className="tag tag-add" onClick={openCreateModal}>
                        <i className="fas fa-plus" /> Thêm nhãn
                    </div>
                </div>

            )}

            {/* MODAL */}
            <AppModal
                isOpen={modalMode !== null}
                title={modalMode === 'create' ? 'Thêm nhãn mới' : 'Chỉnh sửa nhãn'}
                onClose={closeModal}
            >
                <TagModalContent
                    mode={modalMode!}
                    initialTag={activeTag}
                    unusedAvailableTags={unusedAvailableTags}
                    onSave={handleSave}
                    onDelete={modalMode === 'edit' ? handleDeleteTag : undefined}
                    onSelect={handleSelectAvailable}
                    onCancel={closeModal}
                />
            </AppModal>
        </div>
    );
};

export default TagManager;