import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../components/Button/Button';
import ButtonIcon from '../../components/ButtonIcon/ButtonIcon';
import DropDown from '../../components/DropDown/DropDown';
import FilterTabs from '../../components/FilterTabs/FilterTabs';
import LearningPathItem from '../../components/LearningPathItem/LearningPathItem';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ConfirmModal from '../../components/Modal/ConfirmModal/ConfirmModal';
import CreateLearningPathModalContent from '../../components/Modal/CreateLearningPathModalContent/CreateLearningPathModalContent';
import ImportModalContent from '../../components/Modal/ImportModalContent/ImportModalContent';
import SearchBar from '../../components/SearchBar/SearchBar';
import ViewToggle from '../../components/ViewToggle/ViewToggle';
import { LearningStatus } from '../../constants/learningStatus';
import useRouteNavigation from '../../hooks/useNavigation';
import learningPathService from '../../services/learningPathService';
import { LearningPath, mapLearningPathResponsesToLearningPaths } from '../../types/learningPath';
import { mapTagResponsesToTags, Tag } from '../../types/tag';
import './LearningPathPage.css';

const LearningPathPage = () => {
    const statusOptions = ['Tất cả', 'Chưa bắt đầu', 'Đang học', 'Đã hoàn thành'];
    const sortOptions = [
        'Sắp xếp', 'Tên A-Z', 'Tên Z-A',
        'Thời gian tăng dần', 'Thời gian giảm dần',
        'Tiến độ tăng dần', 'Tiến độ giảm dần'
    ];

    const tabItems = [
        { id: 'all', label: 'Tất Cả' },
        { id: 'favorites', label: 'Yêu Thích' },
        { id: 'archived', label: 'Đã Lưu Trữ' },
    ];

    const { toLearningPathDetails } = useRouteNavigation();

    const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
    const [tagsMap, setTagsMap] = useState<Record<string, Tag[]>>({});
    const [selectedPathIds, setSelectedPathIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<string>('Sắp xếp');
    const [isListMode, setIsListMode] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showCreateLearningPathModalContent, setshowCreateLearningPathModalContent] = useState(false);
    const [showConfirmDeletePath, setShowConfirmDeletePath] = useState(false);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
    const [isLoadingListPath, setIsLoadingListPath] = useState(false);

    const listRef = useRef<HTMLDivElement | null>(null);

    // --------------------- Fetch Data ---------------------
    const fetchLearningPathsByTab = async (tabId: string) => {
        try {
            setIsLoadingListPath(true);
            let res;
            if (tabId === 'all') {
                res = await learningPathService.getAllLearningPath();
            } else if (tabId === 'favorites') {
                res = await learningPathService.getFavoriteLearningPaths();
            } else if (tabId === 'archived') {
                res = await learningPathService.getArchiveLearningPaths();
            }

            if (res?.success && res.data) {
                console.log(res.data);
                setIsLoadingListPath(false);
                const mappedPaths = mapLearningPathResponsesToLearningPaths(res.data);
                setLearningPaths(mappedPaths);

                // Lấy tags cho mỗi learning path
                const tagsMapTemp: Record<string, Tag[]> = {};
                await Promise.all(
                    res.data.map(async (lp: any) => {
                        const tagRes = await learningPathService.getTagsByLearningPathId(lp.pathId);
                        if (tagRes.success && tagRes.data) {
                            tagsMapTemp[lp.pathId] = mapTagResponsesToTags(tagRes.data);
                        } else {
                            tagsMapTemp[lp.pathId] = [];
                        }
                    })
                );
                setTagsMap(tagsMapTemp);
            }
        } catch (err) {
            // toast.error("Có lỗi khi lấy dữ liệu lộ trình!");
        }
    };

    useEffect(() => {
        fetchLearningPathsByTab(activeTab);
    }, [activeTab]);

    // --------------------- Handlers ---------------------
    const handleTabClick = (tabId: string) => setActiveTab(tabId);

    const handleSearch = (val: string) => setSearchTerm(val);
    const handleSortChange = (val: string) => setSortOption(val);
    const handleChangeViewMode = (viewMode: string) => setIsListMode(viewMode === 'list');

    const handleStatusFilter = (val: string) => {
        switch (val) {
            case "Chưa bắt đầu":
                setStatusFilter(LearningStatus.NOT_STARTED);
                break;
            case "Đang học":
                setStatusFilter(LearningStatus.IN_PROGRESS);
                break;
            case "Đã hoàn thành":
                setStatusFilter(LearningStatus.COMPLETED);
                break;
            default:
                setStatusFilter(null);
                break;
        }
    };

    const handleSelectPath = (pathId: string, event: React.MouseEvent) => {
        if (event.ctrlKey) {
            setSelectedPathIds(prev =>
                prev.includes(pathId)
                    ? prev.filter(id => id !== pathId)
                    : [...prev, pathId]
            );
        } else {
            setSelectedPathIds(prev =>
                prev.includes(pathId) ? [] : [pathId]
            );
        }
    };

    const toggleFavorite = async (e: React.MouseEvent, pathId: string) => {
        e.stopPropagation();
        const current = learningPaths.find(lp => lp.id === pathId);
        if (!current) return;

        try {
            if (!current.favourite) {
                const res = await learningPathService.favouriteLearningPathByPathId(pathId);
            } else {
                const res = await learningPathService.unFavouriteLearningPathByPathId(pathId);
            }

            setLearningPaths(prev =>
                prev.map(lp => lp.id === pathId ? { ...lp, favourite: !lp.favourite } : lp)
            );
        } catch {
            toast.error("Có lỗi khi thay đổi yêu thích!");
        }
    };

    const handleDeleteLearningPath = (id: string) => {
        setLearningPaths(prev => prev.filter(lp => lp.id !== id));
    };

    const handleArchiveLearningPath = (id: string) => {
        setLearningPaths(prev => prev.filter(lp => lp.id !== id));
    };

    const handleDeleteMultiPaths = async () => {
        if (!selectedPathIds.length) return;
        try {
            const res = await learningPathService.deleteLearningPath({ pathIds: selectedPathIds });
            if (res.success) {
                setLearningPaths(prev => prev.filter(lp => !selectedPathIds.includes(lp.id)));
                setSelectedPathIds([]);
                setShowConfirmDeletePath(false);
                toast.success("Xóa lộ trình thành công!");
            }
        } catch {
            toast.error("Có lỗi khi xóa nhiều lộ trình");
        }
    };

    const handleExportJsonLearningPath = async () => {
        if (!selectedPathIds.length) return;
        try {
            const res = await learningPathService.exportLearningPaths({ pathIds: selectedPathIds });
            if (res.status === 200) {
                const blob = res.data;
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `learning_path_export.json`;
                link.click();
                window.URL.revokeObjectURL(url);
                setSelectedPathIds([]);
            } else {
                toast.error("Có lỗi khi export!");
            }
        } catch {
            toast.error("Có lỗi khi export lộ trình!");
        }
    };

    const handleImportPath = async (paths: LearningPath[]) => {
        setLearningPaths(prev => [...prev, ...paths]);
        setShouldScrollToBottom(true);
    };

    // --------------------- Click outside để clear selection ---------------------
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.path-card')) {
                setSelectedPathIds([]);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        if (shouldScrollToBottom) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            setShouldScrollToBottom(false);
        }
    }, [shouldScrollToBottom]);

    // --------------------- Render ---------------------
    const filteredAndSortedPaths = learningPaths
        .filter(lp => {
            // ----- Search filter -----
            const matchSearch =
                lp.title.toLowerCase().includes(searchTerm.toLowerCase());

            // ----- Status filter -----
            const matchStatus =
                statusFilter ? lp.status === statusFilter : true;

            return matchSearch && matchStatus;
        })
        .slice()
        .sort((a, b) => {
            switch (sortOption) {
                case 'Tên A-Z':
                    return a.title.localeCompare(b.title);

                case 'Tên Z-A':
                    return b.title.localeCompare(a.title);

                case 'Thời gian tăng dần':
                    return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();

                case 'Thời gian giảm dần':
                    return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();

                case 'Tiến độ tăng dần':
                    return a.progressPercent - b.progressPercent;

                case 'Tiến độ giảm dần':
                    return b.progressPercent - a.progressPercent;

                default:
                    return 0;
            }
        });

    return (
        <div className='learning-path-container'>
            <div className='lpc-header'>
                <h2 className='lpc-header-title'>Lộ trình học tập</h2>
                <div className='header-btn'>
                    <Button
                        text='Import lộ trình'
                        variant='secondary'
                        icon='fa-solid fa-file-import'
                        size='small'
                        onClick={() => setShowImportModal(true)}
                        border='1px solid #ccc'
                        textColor='#514848'
                        fullWidth={false}
                    />

                    <Button
                        text='Tạo mới lộ trình'
                        variant='primary'
                        icon='fa-solid fa-plus'
                        size='small'
                        onClick={() => setshowCreateLearningPathModalContent(true)}
                        backgroundColor='#4361ee'
                        fullWidth={false}
                    />
                </div>
            </div>

            <div className='horizontal-line'></div>

            <FilterTabs
                items={tabItems}
                activeTabId={activeTab}
                onTabClick={handleTabClick}
                margin="20px 0 10px 0"
            />

            <div className='list-path-functions'>
                <SearchBar onSearch={handleSearch} />
                <DropDown options={statusOptions} placeholder="Trạng thái" onSelect={handleStatusFilter} />
                <DropDown options={sortOptions} placeholder="Sắp xếp" onSelect={handleSortChange} />
                <ViewToggle onChange={handleChangeViewMode} />
            </div>

            {selectedPathIds.length > 0 && (
                <div className='selected-items-actions' onClick={(e) => e.stopPropagation()}>
                    <ButtonIcon icon='fas fa-times' onClick={() => setSelectedPathIds([])} size={14} />
                    <span className='slected-count'> {selectedPathIds.length} đã chọn</span>
                    <ButtonIcon icon='fas fa-trash-alt' text='Xóa lộ trình' size={14} onClick={() => setShowConfirmDeletePath(true)} />
                    <ButtonIcon icon='fas fa-file-export' text='Export lộ trình' size={14} onClick={handleExportJsonLearningPath} />
                </div>
            )}

            {isLoadingListPath ?
                (<div className='contain-loading-pathlist'>
                    <LoadingSpinner size="medium" />
                </div>
                ) :
                (
                    <>
                        {filteredAndSortedPaths.length > 0 ? (
                            <div className={`list-card ${isListMode ? 'list-mode' : 'grid-mode'}`} ref={listRef}>
                                {filteredAndSortedPaths.map(lp => (
                                    <LearningPathItem
                                        key={lp.id}
                                        learningPath={lp}
                                        tags={tagsMap[lp.id]}
                                        onClick={(e) => handleSelectPath(lp.id, e)}
                                        onDoubleClick={() => toLearningPathDetails(lp.id)}
                                        onToggleFavorite={(e) => toggleFavorite(e, lp.id)}
                                        onViewDetails={() => toLearningPathDetails(lp.id)}
                                        onDelete={handleDeleteLearningPath}
                                        onArchive={handleArchiveLearningPath}
                                        isSelected={selectedPathIds.includes(lp.id)}
                                        viewMode={isListMode ? "list" : "grid"}
                                        isArchivedView={activeTab === "archived"}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='empty-path-list'>
                                <i className="fa-solid fa-road"></i>
                                <h3>Chưa có lộ trình học tập nào</h3>
                                <p>Bắt đầu bằng cách thêm chủ đề đầu tiên vào lộ trình của bạn</p>
                            </div>
                        )}
                    </>
                )}

            {/* Import Modal */}
            <ImportModalContent
                isOpen={showImportModal}
                omImportPath={handleImportPath}
                onClose={() => setShowImportModal(false)}
            />

            {/* Create Modal */}
            <CreateLearningPathModalContent
                isOpen={showCreateLearningPathModalContent}
                onCreateLearningPath={(newPath) => {
                    setLearningPaths(prev => [newPath, ...prev]);
                    setShouldScrollToBottom(true);
                }}
                onClose={() => setshowCreateLearningPathModalContent(false)}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={showConfirmDeletePath}
                title="Xác nhận xóa lộ trình"
                message="Bạn có chắc chắn muốn xóa lộ trình này không?"
                onCancel={() => setShowConfirmDeletePath(false)}
                onConfirm={handleDeleteMultiPaths}
            />
        </div>
    );
};

export default LearningPathPage;