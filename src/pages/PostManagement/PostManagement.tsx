import { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import './PostManagement.css';
import { AdminPostResponse } from '../../types/adminPost';
import adminPostService from '../../services/adminPost';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import AppModal from '../../components/Modal/AppModal/AppModal';
import ConfirmModal from '../../components/Modal/ConfirmModal/ConfirmModal';

const PostManagement = () => {
    const [posts, setPosts] = useState<AdminPostResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedPost, setSelectedPost] = useState<AdminPostResponse | null>(null);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    
    // Modal states
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch all posts
    const fetchAllPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminPostService.getAllPosts();
            if (res.success && res.data) {
                setPosts(res.data);
            }
        } catch {
            toast.error("Có lỗi khi lấy danh sách bài đăng!");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch post by ID
    const getPostById = async (postId: string) => {
        try {
            const res = await adminPostService.getPostById(postId);
            if (res.success && res.data) {
                setSelectedPost(res.data);
                setIsDetailModalOpen(true);
            }
        } catch {
            toast.error("Có lỗi khi lấy bài đăng theo id");
        }
    };

    // Delete post by ID
    const deletePostById = async (postId: string) => {
        try {
            const res = await adminPostService.deletePostById(postId);
            if (res.success) {
                toast.success("Xóa bài đăng thành công!");
                // Remove deleted post from state
                setPosts(prevPosts => prevPosts.filter(post => post.postId !== postId));
            }
        } catch {
            toast.error("Có lỗi khi xóa bài đăng!");
        } finally {
            setIsConfirmModalOpen(false);
            setPostToDelete(null);
        }
    };

    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        // Update URL search params
        if (value) {
            setSearchParams({ search: value });
        } else {
            setSearchParams({});
        }
    };

    // Filter posts based on search term
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle delete confirmation
    const handleDeleteClick = (postId: string) => {
        setPostToDelete(postId);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (postToDelete) {
            deletePostById(postToDelete);
        }
    };

    // Initialize search term from URL
    useEffect(() => {
        const searchParam = searchParams.get('search');
        if (searchParam) {
            setSearchTerm(searchParam);
        }
    }, [searchParams]);

    // Fetch posts on component mount
    useEffect(() => {
        fetchAllPosts();
    }, [location.pathname, fetchAllPosts]);

    return (
        <div className="post-management-container">
            <div className="post-management-header">
                <h1 className="post-management-title">Quản lý bài đăng</h1>
                <div className="post-management-stats">
                    <span className="stat-item">
                        Tổng số bài: <strong>{posts.length}</strong>
                    </span>
                    <span className="stat-item">
                        Đang hiển thị: <strong>{filteredPosts.length}</strong>
                    </span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="post-search-bar">
                <div className="search-input-container">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm bài đăng theo tiêu đề, tác giả hoặc nội dung..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {searchTerm && (
                        <button 
                            className="clear-search-btn"
                            onClick={() => setSearchTerm('')}
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="loading-container">
                    <LoadingSpinner size="small" />
                    <p className="loading-text">Đang tải danh sách bài đăng...</p>
                </div>
            ) : (
                <>
                    {/* Posts Table */}
                    <div className="posts-table-container">
                        <table className="posts-table">
                            <thead>
                                <tr>
                                    <th className="text-center">STT</th>
                                    <th>Tiêu đề</th>
                                    <th>Tác giả</th>
                                    <th className="text-center">Likes</th>
                                    <th className="text-center">Comments</th>
                                    <th>Ngày đăng</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map((post, index) => (
                                        <tr key={post.postId} className="post-row">
                                            <td className="text-center">{index + 1}</td>
                                            <td className="post-title-cell">
                                                <div 
                                                    className="post-title-link"
                                                    onClick={() => getPostById(post.postId)}
                                                >
                                                    {post.title}
                                                </div>
                                            </td>
                                            <td>{post.authorName}</td>
                                            <td className="text-center">
                                                <span className="count-badge like-count">
                                                    <i className="fa-solid fa-heart"></i>
                                                    {post.likeCount}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="count-badge comment-count">
                                                    <i className="fa-solid fa-comment"></i>
                                                    {post.commentCount}
                                                </span>
                                            </td>
                                            <td>{formatDate(post.createdAt)}</td>
                                            <td className="text-center">
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-action btn-view"
                                                        onClick={() => getPostById(post.postId)}
                                                        title="Xem chi tiết"
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn-action btn-delete"
                                                        onClick={() => handleDeleteClick(post.postId)}
                                                        title="Xóa bài đăng"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="no-data">
                                            {searchTerm ? 'Không tìm thấy bài đăng phù hợp' : 'Không có bài đăng nào'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Post Detail Modal */}
            <AppModal
                isOpen={isDetailModalOpen}
                title="Chi tiết bài đăng"
                onClose={() => setIsDetailModalOpen(false)}
                padding="30px"
            >
                {selectedPost && (
                    <div className="post-detail-content">
                        <div className="post-detail-header">
                            <h2 className="post-detail-title">{selectedPost.title}</h2>
                            <div className="post-detail-meta">
                                <span className="meta-item">
                                    <i className="fa-solid fa-user"></i>
                                    {selectedPost.authorName}
                                </span>
                                <span className="meta-item">
                                    <i className="fa-solid fa-calendar"></i>
                                    {formatDate(selectedPost.createdAt)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="post-detail-stats">
                            <div className="stat-box">
                                <i className="fa-solid fa-heart stat-icon like-icon"></i>
                                <div className="stat-info">
                                    <span className="stat-value">{selectedPost.likeCount}</span>
                                    <span className="stat-label">Likes</span>
                                </div>
                            </div>
                            <div className="stat-box">
                                <i className="fa-solid fa-comment stat-icon comment-icon"></i>
                                <div className="stat-info">
                                    <span className="stat-value">{selectedPost.commentCount}</span>
                                    <span className="stat-label">Comments</span>
                                </div>
                            </div>
                        </div>

                        <div className="post-detail-body">
                            <h3 className="content-title">Nội dung</h3>
                            <div className="post-content">
                                {selectedPost.content}
                            </div>
                        </div>

                        <div className="post-detail-footer">
                            <button
                                className="btn-close-modal"
                                onClick={() => setIsDetailModalOpen(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </AppModal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác."
                onCancel={() => {
                    setIsConfirmModalOpen(false);
                    setPostToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default PostManagement;