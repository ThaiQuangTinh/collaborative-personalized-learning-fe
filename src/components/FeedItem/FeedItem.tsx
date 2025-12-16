import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import postCommnentService from '../../services/postComment';
import postService from '../../services/postService';
import { PostResponse } from '../../types/post';
import { PostCommentResponse } from '../../types/postComment';
import ConfirmModal from '../Modal/ConfirmModal/ConfirmModal';
import './FeedItem.css';
import postLikeService from '../../services/postLikeService';

interface FeedItemProps {
    post: PostResponse;
    onEdit: (postId: string) => void;
    onDeletePost: (postId: string) => void;
}

const FeedItem = ({
    post,
    onEdit,
    onDeletePost
}: FeedItemProps) => {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [isShowConfirmDeletePost, setIsShowConfirmDeletePost] = useState(false);
    const [isShowConfirmDeleteComment, setIsShowConfirmDeleteComment] = useState(false);
    const [comments, setComments] = useState<PostCommentResponse[]>([]);
    const [isLikedPost, setIsLikedPost] = useState(post.liked);
    const [likeCount, setLikeCount] = useState(post.likeCount);

    // State cho chức năng sửa comment
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [showCommentMenuId, setShowCommentMenuId] = useState<string | null>(null);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    const handleAddComent = async () => {
        if (!commentContent.trim()) return;

        try {
            const res = await postCommnentService.createPostComment({
                postId: post.postId,
                content: commentContent
            });

            if (res.success && res.data) {
                const newComment = res.data;
                setComments(prev => [...prev, newComment]);
                setCommentContent('');
                setShowCommentInput(false);
                toast.success("Bình luận thành công!");
            }
        } catch {
            toast.error("Có lỗi khi bình luận bài viết!");
        }
    };

    const handleStartEditComment = (comment: PostCommentResponse) => {
        setEditingCommentId(comment.commentId);
        setEditingCommentContent(comment.content);
        setShowCommentMenuId(null);
    };

    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditingCommentContent('');
    };

    const handleUpdateComment = async (commentId: string) => {
        if (!editingCommentContent.trim()) {
            toast.error("Nội dung bình luận không được để trống!");
            return;
        }

        try {
            const res = await postCommnentService.updatePostCommentById(commentId, {
                content: editingCommentContent
            });

            if (res.success) {
                setComments(prev =>
                    prev.map(comment =>
                        comment.commentId === commentId
                            ? { ...comment, content: editingCommentContent, updatedAt: new Date().toISOString() }
                            : comment
                    )
                );
                setEditingCommentId(null);
                setEditingCommentContent('');
                toast.success("Cập nhật bình luận thành công!");
            }
        } catch {
            toast.error("Có lỗi khi cập nhật bình luận");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            const res = await postCommnentService.deletePostCommentById(commentId);
            if (res.success) {
                setComments(prev => {
                    if (!prev) return prev;
                    return prev.filter(cmt => cmt.commentId !== commentId);
                });
                setIsShowConfirmDeleteComment(false);
                setCommentToDelete(null);
                toast.success("Xóa bình luận thành công!");
            }
        } catch {
            toast.error("Có lỗi khi xóa bình luận!");
        }
    };

    const handleConfirmDeleteComment = (commentId: string) => {
        setCommentToDelete(commentId);
        setIsShowConfirmDeleteComment(true);
        setShowCommentMenuId(null);
    };

    const handleChangeLikeStatus = async () => {
        try {
            // Unlike post
            if (isLikedPost) {
                const res = await postLikeService.unPostLikeById(post.postId);
                if (res.success) {
                    setIsLikedPost(false);
                    setLikeCount(prev => prev - 1);
                }
            }
            // Like post
            else {
                const res = await postLikeService.createPostLike(post.postId);
                if (res.success) {
                    setIsLikedPost(true);
                    setLikeCount(prev => prev + 1);
                }
            }
        } catch {
            toast.error("Có lỗi khi thay đổi like!");
        }
    };

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const handleCommentClick = () => {
        setShowComments(!showComments);
        if (!showComments) {
            setShowCommentInput(true);
        }
    };

    const handleDeletePost = async () => {
        if (!post) return;

        try {
            const res = await postService.deletePostById(post.postId);
            if (res.success) {
                onDeletePost(post.postId);
                toast.success("Xóa bài đăng thành công!");
            }
        } catch {
            toast.error("Có lỗi xảy ra khi xóa bài đăng!");
        }
    };

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = () => {
            setShowMenu(false);
            setShowCommentMenuId(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            if (!post.postId) return;

            try {
                const res = await postService.getPostCommentByPostId(post.postId);
                if (res.status && res.data) {
                    setComments(res.data);
                }
            } catch {
                toast.error("Có lỗi xảy ra khi lấy danh sách bình luận");
            }
        };

        fetchComments();
    }, [post]);

    return (
        <>
            <div className="post-card" id={`post-${post.postId}`}>
                <div className="post-header">
                    <div className="post-author">
                        <div className="author-avatar">
                            {post.userPostResponse.avatarUrl
                                ? <img src={post.userPostResponse.avatarUrl} alt={post.userPostResponse.fullName} />
                                : post.userPostResponse.fullName.charAt(0)
                            }
                        </div>
                        <div className="author-info">
                            <div className="author-name">{post.userPostResponse.fullName}</div>
                            <div className="post-date">{formatDate(post.updatedAt)}</div>
                        </div>
                    </div>

                    {post.ownedByCurrentUser && (
                        <div className="post-menu">
                            <button
                                className="menu-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                            >
                                ⋮
                            </button>
                            {showMenu && (
                                <div className="menu-dropdown">
                                    <button onClick={() => onEdit(post.postId)} className="menu-item">
                                        <i className="fa-solid fa-pen"></i> Chỉnh sửa
                                    </button>
                                    <button onClick={() => setIsShowConfirmDeletePost(true)} className="menu-item delete">
                                        <i className="fas fa-trash"></i> Xóa
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-description">{post.content}</p>
                    {post.externalLink && (
                        <a
                            href={post.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="post-link"
                        >
                            <span className="link-icon"><i className="fa-solid fa-link"></i></span>
                            <span className="link-text">{post.externalLink}</span>
                        </a>
                    )}
                </div>

                <div className="post-actions">
                    <div className="like-section">
                        <button
                            className={`like-btn ${isLikedPost ? 'active' : ''}`}
                            onClick={() => handleChangeLikeStatus()}
                        >
                            <span className="like-icon">
                                {isLikedPost ? (<i className="fa-solid fa-heart"></i>) : (<i className="fa-regular fa-heart"></i>)}
                            </span>
                            <span className="like-count">{likeCount}</span>
                        </button>
                    </div>

                    <div className="comment-info">
                        <button
                            className="comment-count-btn"
                            onClick={() => setShowComments(!showComments)}
                        >
                            <span className="comment-icon">💬</span>
                            <span className="comment-count">{comments.length}</span>
                        </button>
                        <button
                            className="comment-btn"
                            onClick={handleCommentClick}
                        >
                            Bình luận
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="comments-section">
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <div key={comment.commentId} className="comment">
                                    <div className="comment-header">
                                        <div className="comment-author-info">
                                            <div className="comment-avatar">
                                                {comment.userPostResponse.avatarUrl
                                                    ? <img src={comment.userPostResponse.avatarUrl} alt={comment.userPostResponse.fullName} />
                                                    : comment.userPostResponse.fullName.charAt(0)
                                                }
                                            </div>
                                            <div className="comment-author-details">
                                                <div className="comment-author">{comment.userPostResponse.fullName}</div>
                                                <div className="comment-date">{formatDate(comment.updatedAt)}</div>
                                            </div>
                                        </div>

                                        {comment.ownedByCurrentUser && (
                                            <div className="comment-menu">
                                                <button
                                                    className="comment-menu-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowCommentMenuId(
                                                            showCommentMenuId === comment.commentId ? null : comment.commentId
                                                        );
                                                    }}
                                                >
                                                    ⋮
                                                </button>
                                                {showCommentMenuId === comment.commentId && (
                                                    <div className="comment-menu-dropdown">
                                                        <button
                                                            onClick={() => handleStartEditComment(comment)}
                                                            className="comment-menu-item"
                                                        >
                                                            <i className="fa-solid fa-pen"></i> Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => handleConfirmDeleteComment(comment.commentId)}
                                                            className="comment-menu-item delete"
                                                        >
                                                            <i className="fas fa-trash"></i> Xóa
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {editingCommentId === comment.commentId ? (
                                        <div className="edit-comment">
                                            <textarea
                                                value={editingCommentContent}
                                                onChange={(e) => setEditingCommentContent(e.target.value)}
                                                className="edit-comment-input"
                                                rows={3}
                                            />
                                            <div className="edit-comment-actions">
                                                <button
                                                    onClick={() => handleUpdateComment(comment.commentId)}
                                                    className="save-comment-btn"
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    onClick={handleCancelEditComment}
                                                    className="cancel-edit-comment-btn"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="comment-content">{comment.content}</div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-comments">
                                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                            </div>
                        )}

                        {showCommentInput && (
                            <div className="add-comment">
                                <textarea
                                    placeholder="Viết bình luận của bạn..."
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    className="comment-input"
                                />
                                <div className="comment-actions">
                                    <button
                                        onClick={handleAddComent}
                                        className="submit-comment-btn"
                                        disabled={!commentContent.trim()}
                                    >
                                        Gửi
                                    </button>
                                    <button
                                        onClick={() => setShowCommentInput(false)}
                                        className="cancel-comment-btn"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isShowConfirmDeletePost}
                title="Xác nhận xóa bài đăng"
                message="Bạn có chắc chắn muốn xóa bài đăng này không?"
                onCancel={() => { setIsShowConfirmDeletePost(false) }}
                onConfirm={() => { handleDeletePost() }}
            />

            <ConfirmModal
                isOpen={isShowConfirmDeleteComment}
                title="Xác nhận xóa bình luận"
                message="Bạn có chắc chắn muốn xóa bình luận này không?"
                onCancel={() => {
                    setIsShowConfirmDeleteComment(false);
                    setCommentToDelete(null);
                }}
                onConfirm={() => {
                    if (commentToDelete) {
                        handleDeleteComment(commentToDelete);
                    }
                }}
            />
        </>
    );
};

export default FeedItem;