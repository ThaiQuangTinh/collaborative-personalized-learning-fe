import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import postService from '../../../services/postService';
import { PostResponse } from '../../../types/post';
import ButtonCancel from '../../ButtonCancel/ButtonCancel';
import ButtonSave from '../../ButtonSave/ButtonSave';
import FormLabel from '../../FormLabel/FormLabel';
import Input from '../../Input/Input';
import TextArea from '../../TextArea/TextArea';
import AppModal from '../AppModal/AppModal';
import './CreatePostModalContent.css';

interface CreatePostModalContentProps {
    isOpen: boolean;
    onClose: () => void;
    onCreatePost: (newPost: PostResponse) => void;
    onUpdatePost?: (updatedPost: PostResponse) => void;
    isEditing?: boolean;
    initialPostData?: PostResponse
}

const CreatePostModalContent: React.FC<CreatePostModalContentProps> = ({
    isOpen,
    onClose,
    onCreatePost,
    onUpdatePost,
    isEditing = false,
    initialPostData
}) => {
    const [formData, setFormData] = useState({
        title: initialPostData?.title || '',
        content: initialPostData?.content || '',
        link: initialPostData?.externalLink || ''
    });

    const [errors, setErrors] = useState({
        title: '',
        content: '',
        link: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors = {
            title: '',
            content: '',
            link: ''
        };

        let isValid = true;

        if (!formData.title.trim()) {
            newErrors.title = 'Vui lòng nhập tiêu đề';
            isValid = false;
        } else if (formData.title.trim().length < 5) {
            newErrors.title = 'Tiêu đề phải có ít nhất 5 ký tự';
            isValid = false;
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Vui lòng nhập nội dung';
            isValid = false;
        } else if (formData.content.trim().length < 10) {
            newErrors.content = 'Nội dung phải có ít nhất 10 ký tự';
            isValid = false;
        }

        // if (!formData.link.trim()) {
        //     newErrors.link = 'Vui lòng nhập link chia sẻ';
        //     isValid = false;
        // } 
        if (formData.link.trim()) {
            const urlPattern = /^https?:\/\/.+$/i;

            if (!urlPattern.test(formData.link.trim())) {
                newErrors.link = 'Vui lòng nhập URL hợp lệ';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            if (isEditing) {
                if (!initialPostData?.postId) return;

                const res = await postService.updatePostById(initialPostData?.postId, {
                    title: formData.title,
                    content: formData.content,
                    externalLink: formData.link
                });

                if (res.success && res.data) {
                    toast.success("Cập nhật bài đăng thành công!");
                    onUpdatePost?.(res.data);
                    handleClose();
                }
            } else {
                const res = await postService.createPost({
                    title: formData.title,
                    content: formData.content,
                    externalLink: formData.link
                });

                if (res.success && res.data) {
                    toast.success("Tạo bài đăng thành công!");
                    onCreatePost(res.data);
                    handleClose();
                }
            }
        } catch {
            toast.error("Có lỗi khi tạo bài đăng!");
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            content: '',
            link: ''
        });
        setErrors({
            title: '',
            content: '',
            link: ''
        });

        onClose();
    };

    useEffect(() => {
        if (initialPostData) {
            setFormData({
                title: initialPostData.title,
                content: initialPostData.content,
                link: initialPostData.externalLink
            });
        } else {
            setFormData({
                title: '',
                content: '',
                link: ''
            });
        }
    }, [initialPostData]);


    return (
        <AppModal
            isOpen={isOpen}
            title={isEditing ? "Chỉnh sửa bài đăng" : "Chia sẻ lộ trình học tập"}
            onClose={handleClose}
        >
            <div className="create-post-modal-content">
                <div className="form-section">
                    <FormLabel text='Tiêu đề' required />
                    <Input
                        type="text"
                        placeholder="Nhập tiêu đề bài đăng..."
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        error={errors.title}
                        padding="12px 16px"
                        margin="8px 0 16px 0"
                        background="#fff"
                        borderColor="2px solid #e2e8f0"
                        focusColor="#2563eb"
                        width="100%"
                    // onKeyDown={handleKeyPress}
                    />
                </div>

                <div className="form-section">
                    <FormLabel text='Nội dung' required />
                    <TextArea
                        placeholder="Mô tả chi tiết về lộ trình học tập của bạn..."
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        error={errors.content}
                        rows={6}
                        padding="12px 16px"
                        margin="8px 0 16px 0"
                        backgroundColor="#fff"
                        border="1px solid #e2e8f0"
                        focusColor="#2563eb"
                        width="100%"
                    />
                </div>

                <div className="form-section">
                    <FormLabel text='Link chia sẻ' />
                    <Input
                        type="text"
                        placeholder="https://example.com/learning-path"
                        value={formData.link}
                        onChange={(e) => handleInputChange('link', e.target.value)}
                        error={errors.link}
                        padding="12px 16px"
                        margin="8px 0 16px 0"
                        background="#fff"
                        borderColor="2px solid #e2e8f0"
                        focusColor="#2563eb"
                        width="100%"
                    // onKeyDown={handleKeyPress}
                    />
                </div>

                <div className="modal-actions">
                    <ButtonCancel onClick={handleClose} />
                    <ButtonSave
                        text={isEditing ? "Cập nhật" : "Xác nhận"}
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </AppModal>
    );
};

export default CreatePostModalContent;