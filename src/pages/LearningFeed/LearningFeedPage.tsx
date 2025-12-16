import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import FeedItem from '../../components/FeedItem/FeedItem';
import CreatePostModalContent from '../../components/Modal/CreatePostModalContent/CreatePostModalContent';
import { PostResponse } from '../../types/post';
import postService from '../../services/postService';
import Button from '../../components/Button/Button';
import SearchBar from '../../components/SearchBar/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './LearningFeedPage.css';

const LearningFeedPage = () => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isShowCreatePostModal, setIsShowCreatePostModal] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<PostResponse | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const postId = searchParams.get("id");
  const location = useLocation();

  const handleSearch = useCallback((searchValue: string) => {
    setSearchTerm(searchValue);

    if (!searchValue.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const term = searchValue.toLowerCase().trim();
    const results = posts.filter(post =>
      post.title?.toLowerCase().includes(term) ||
      post.content?.toLowerCase().includes(term) ||
      post.userPostResponse?.fullName?.toLowerCase().includes(term)
    );

    setFilteredPosts(results);
  }, [posts]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setFilteredPosts(posts);

    // Reset lại highlight nếu có post đang được highlight
    if (postId) {
      const el = document.getElementById(`post-${postId}`);
      if (el) {
        el.classList.remove("highlight-post");
      }
    }
  }, [posts]);

  const handleAddPost = (newPost: PostResponse): void => {
    if (!newPost) return;
    setPosts(prev => [newPost, ...prev]);
    setFilteredPosts(prev => [newPost, ...prev]);
  };

  const handleUpdatePost = (updatedPost: PostResponse): void => {
    const updatedPosts = posts.map(post =>
      post.postId === updatedPost.postId
        ? { ...post, ...updatedPost }
        : post
    );
    setPosts(updatedPosts);
    handleSearch(searchTerm);
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string): void => {
    const updatedPosts = posts.filter(post => post.postId !== postId);
    setPosts(updatedPosts);
    handleSearch(searchTerm);
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      try {
        const res = await postService.getAllPostOfServer();
        if (res.success && res.data) {
          setPosts(res.data);
          setFilteredPosts(res.data);
        }
      } catch {
        toast.error("Có lỗi khi lấy danh sách bài đăng!");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, [location.pathname]);

  useEffect(() => {
    if (!postId) return;

    const tryScroll = () => {
      const el = document.getElementById(`post-${postId}`);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        el.classList.add("highlight-post");

        setSearchParams({}, { replace: true });

        return true;
      }
      return false;
    };

    if (!tryScroll()) {
      const interval = setInterval(() => {
        if (tryScroll()) {
          clearInterval(interval);
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [postId, filteredPosts.length, setSearchParams]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, posts, handleSearch]);

  return (
    <div className="learning-feed">
      <div className="feed-container">
        <div className="feed-header">
          <div className="header-content">
            <h1 className='learning-feed-title'>Cộng đồng học tập</h1>
            <p>Chia sẻ và khám phá các lộ trình học tập từ cộng đồng</p>
          </div>
        </div>

        <div className="action-bar">
          <div className="search-bar-wrapper">
            <SearchBar
              placeholder="Tìm kiếm bài đăng, tác giả..."
              onSearch={handleSearch}
              width="100%"
              size="medium"
              backgroundColor="#fff"
              borderColor="#d0d7de"
              focusBorderColor="#4361ee"
              iconColor="#4361ee"
              textColor="#333"
            />
          </div>

          <Button
            text='Chia sẻ lộ trình'
            variant='primary'
            icon='fa-solid fa-plus'
            size='medium'
            onClick={() => setIsShowCreatePostModal(true)}
            backgroundColor='#4361ee'
            fullWidth={false}
          />
        </div>

        <div className="posts-feed">
          <div className="section-header">
            <h3>Bài đăng gần đây</h3>
            <div className="posts-count">
              {searchTerm ? `${filteredPosts.length} kết quả` : `${posts.length} bài đăng`}
            </div>
          </div>

          {loading ? (
            <div className="loading-posts">
              <LoadingSpinner size="small" color="#4361ee" />
              <p>Đang tải bài đăng...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="no-posts">
              <div className="no-posts-icon">
                <i className="fa-solid fa-book"></i>
              </div>
              {searchTerm ? (
                <>
                  <p>Không tìm thấy bài đăng nào phù hợp với "{searchTerm}"</p>
                  <button
                    className="clear-search-link"
                    onClick={handleClearSearch}
                  >
                    Xóa tìm kiếm
                  </button>
                </>
              ) : (
                <p>Chưa có bài đăng nào. Hãy là người đầu tiên chia sẻ!</p>
              )}
            </div>
          ) : (
            <div className="posts-grid">
              {filteredPosts.map(post => (
                <FeedItem
                  key={post.postId}
                  post={post}
                  onEdit={(postId: string) => {
                    const post = posts.find(p => p.postId === postId);
                    if (post) {
                      setEditingPost(post);
                      setIsShowCreatePostModal(true);
                    }
                  }}
                  onDeletePost={handleDeletePost}
                />
              ))}
            </div>
          )}
        </div>

        <CreatePostModalContent
          isOpen={isShowCreatePostModal}
          onClose={() => {
            setIsShowCreatePostModal(false);
            setEditingPost(null);
          }}
          onCreatePost={handleAddPost}
          onUpdatePost={handleUpdatePost}
          isEditing={!!editingPost}
          initialPostData={editingPost || undefined}
        />
      </div>
    </div>
  );
};

export default LearningFeedPage;