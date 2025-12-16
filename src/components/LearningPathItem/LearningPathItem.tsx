import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { LearningStatus } from '../../constants/learningStatus';
import useRouteNavigation from '../../hooks/useNavigation';
import learningPathService from '../../services/learningPathService';
import { LearningPath } from '../../types/learningPath';
import { Tag } from '../../types/tag';
import { formatDate } from '../../utils/dateUtils';
import Button from '../Button/Button';
import ConfirmModal from '../Modal/ConfirmModal/ConfirmModal';
import ShareModal from '../Modal/ShareLearningPathModalContent/ShareLearningPathModal';
import MoreOptionsDropdown from '../MoreOptionsDropdown/MoreOptionsDropdown';
import './LearningPathItem.css';
import userService from '../../services/userService';

interface LearningPathItemProps {
  learningPath: LearningPath;
  tags?: Tag[];
  onClick: (e: any) => void;
  onDoubleClick: () => void;
  onToggleFavorite: (e: any) => void;
  onViewDetails: () => void;
  onCopy?: () => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  isSelected?: boolean;
  viewMode: 'grid' | 'list';
  isArchivedView: boolean
}

const LearningPathItem: React.FC<LearningPathItemProps> = ({
  learningPath,
  tags,
  onClick,
  onDoubleClick,
  onToggleFavorite,
  onViewDetails,
  onCopy,
  onDelete,
  onArchive,
  isSelected,
  viewMode,
  isArchivedView
}) => {
  const { toLearningPathDetails } = useRouteNavigation();
  const [showShareLearningPathModal, setShareLearningPathModal] = useState(false);
  const [showConfirmArchivePath, setShowConfirmArchivePath] = useState(false);
  const [showConfirmDeletePath, setShowConfirmDeletePath] = useState(false);
  const [showConfirmUnArchivePath, setShowConfirmUnArchivePath] = useState(false);

  const statusConfig = {
    [LearningStatus.NOT_STARTED]: {
      class: 'status-not-started',
      text: 'Chưa bắt đầu'
    },
    [LearningStatus.IN_PROGRESS]: {
      class: 'status-in-progress',
      text: 'Đang học'
    },
    [LearningStatus.COMPLETED]: {
      class: 'status-completed',
      text: 'Đã hoàn thành'
    }
  };

  // Handle delete learning path.
  const handleDeletePath = async () => {
    if (!learningPath.id) return;

    try {
      const res = await learningPathService.deleteLearningPath({ pathIds: [learningPath.id] });
      if (res.success) {
        onDelete?.(learningPath.id);
        toast.success("Xóa lộ trình thành công!");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi xóa lộ trình!");
    }
  }

  // Handle archive learing path.
  const handleArchivePath = async () => {
    if (!learningPath.id) return;

    try {
      const res = await learningPathService.archiveLearningPathByPathId(learningPath.id);
      if (res.success) {
        onArchive?.(learningPath.id);
        toast.success("Lưu trữ lộ trình thành công!");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi lưu trữ lộ trình!");
    }
  };

  const handleUnArchivePath = async () => {
    if (!learningPath.id) return;

    try {
      const res = await learningPathService.unArchiveLearningPathByPathId(learningPath.id);
      if (res.success) {
        onArchive?.(learningPath.id);
        toast.success("Hủy lưu trữ lộ trình thành công!");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi hủy lưu trữ!");
    }
  };

  const handleExportJsonLearningPath = async (pathId: string) => {
    if (!pathId) return;

    try {
      const res = await learningPathService.exportLearningPaths({
        pathIds: [pathId]
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
      link.download = `learning_path_export_${pathId}.json`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("EXPORT ERROR:", err);
      toast.error("Có lỗi khi export lộ trình!");
    }
  };

  const handleRenderMenuOption = () => {
    return (
      <MoreOptionsDropdown
        items={
          isArchivedView
            ? [
              { icon: "fas fa-undo", label: "Hủy lưu trữ", onClick: () => setShowConfirmUnArchivePath(true) },
              { icon: "fas fa-trash-alt", label: "Xóa", onClick: () => setShowConfirmDeletePath(true) }
            ]
            : [
              { icon: "fas fa-edit", label: "Chỉnh sửa", onClick: () => toLearningPathDetails(learningPath.id, true) },
              { icon: "fas fa-copy", label: "Sao chép", onClick: onCopy },
              { icon: "fas fa-share-alt", label: "Chia sẻ", onClick: () => setShareLearningPathModal(true) },
              { icon: "fas fa-trash-alt", label: "Xóa", onClick: () => setShowConfirmDeletePath(true) },
              { icon: "fas fa-archive", label: "Lưu trữ", onClick: () => setShowConfirmArchivePath(true) },
              { icon: "fas fa-file-export", label: "Xuất JSON", onClick: () => { handleExportJsonLearningPath(learningPath.id) } }
            ]
        }
      />
    );
  };

  return (
    <>
      {viewMode === 'grid' ? (
        <div className={`path-card grid-view-card ${isSelected ? 'choosed-card' : ''}`}
          onDoubleClick={onDoubleClick} onClick={onClick}>
          <div className="path-header">
            <div >
              <h3 className="path-title">{learningPath.title}</h3>
              <p className="path-description">{learningPath.description}</p>
            </div>
            {handleRenderMenuOption()}
          </div>

          {learningPath.userOriginalPathResponse && (
            <div className='contain-author'>
              <span className='author-title'>Tác giả: </span>
              {learningPath.userOriginalPathResponse.avatarUrl ? (
                <img
                  src={learningPath.userOriginalPathResponse.avatarUrl}
                  alt={learningPath.userOriginalPathResponse.fullname}
                />
              ) : (
                <div className="avatar-fallback">
                  {learningPath.userOriginalPathResponse.fullname?.charAt(0) || 'U'}
                </div>
              )}

              <span>{learningPath.userOriginalPathResponse.fullname}</span>
            </div>
          )}

          <div className="path-tags">
            {(tags?.length === 0 || !tags) ? (
              <span className="no-tag">Chưa có tag nào</span>
            ) : (
              tags?.map((tag, index) => (
                <span
                  key={index}
                  className="tag"
                  style={{
                    backgroundColor: `${tag.textColor}20`,
                    color: tag.textColor
                  }}
                >
                  <span className="tag-color" style={{ backgroundColor: tag.textColor }}></span>
                  {tag.tagName}
                </span>
              ))
            )}
          </div>

          <div className="path-meta">
            <span><i className="far fa-calendar"></i>
              {formatDate(learningPath.startTime)} - {formatDate(learningPath.endTime)}
            </span>
            <span className={`path-status ${statusConfig[learningPath.status].class}`}>
              {statusConfig[learningPath.status].text}
            </span>
          </div>

          <div className="path-progress">
            <div className="progress-bar">
              <div className="progress-value" style={{ width: `${learningPath.progressPercent}%` }}></div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '14px', marginTop: '5px', color: 'var(--gray)' }}>
              {learningPath.progressPercent}%
            </div>
          </div>

          <div className="path-actions">
            <button
              className={`favorite-btn ${learningPath.favourite ? 'active' : ''}`}
              onClick={onToggleFavorite}
            >
              <i className="fas fa-heart"></i>
            </button>
            <Button
              text='Xem chi tiết'
              icon='fas fa-eye'
              onClick={onViewDetails}
              backgroundColor='#f0f0f0'
              textColor='#000000'
              fullWidth={false}
            />
          </div>
        </div>
      ) :
        // List mode
        (
          <div className={`path-card list-view-card ${isSelected ? 'choosed-card' : ''}`}
            onDoubleClick={onDoubleClick} onClick={onClick}>
            <div className='path-header'>

              <h3 className="path-title">{learningPath.title}</h3>
              {handleRenderMenuOption()}
            </div>
          </div>
        )}

      <ShareModal
        isOpen={showShareLearningPathModal}
        onClose={() => setShareLearningPathModal(false)}
        pathId={learningPath.id}
      />

      <ConfirmModal
        isOpen={showConfirmArchivePath}
        title="Xác nhận lưu trữ lộ trình"
        message="Bạn có chắc chắn muốn lưu trữ lộ trình này không?"
        onCancel={() => { setShowConfirmArchivePath(false) }}
        onConfirm={() => { handleArchivePath() }}
      />

      <ConfirmModal
        isOpen={showConfirmDeletePath}
        title="Xác nhận xóa lộ trình"
        message="Bạn có chắc chắn muốn xóa lộ trình này không?"
        onCancel={() => { setShowConfirmDeletePath(false) }}
        onConfirm={() => { handleDeletePath() }}
      />

      <ConfirmModal
        isOpen={showConfirmUnArchivePath}
        title="Xác nhận hủy lưu trữ"
        message="Bạn có chắc chắn muốn hủy lưu trữ lộ trình này không?"
        onCancel={() => setShowConfirmUnArchivePath(false)}
        onConfirm={handleUnArchivePath}
      />
    </>
  );
};

export default LearningPathItem;