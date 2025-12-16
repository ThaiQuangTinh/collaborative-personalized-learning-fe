import { useEffect, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminUserService from '../../services/adminUser';
import './UserManagement.css';
import { ROLE } from '../../constants/role';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import AppModal from '../../components/Modal/AppModal/AppModal';
import ConfirmModal from '../../components/Modal/ConfirmModal/ConfirmModal';
import { AdminUserResponse } from '../../types/adminUser';

const UserManagement = () => {
    const [users, setUsers] = useState<AdminUserResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<AdminUserResponse | null>(null);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<ROLE | 'ALL'>('ALL');
    
    // Modal states
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch all users
    const fetchAllUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminUserService.getAllUsers();
            if (res.success && res.data) {
                setUsers(res.data);
            }
        } catch {
            toast.error("Có lỗi khi lấy danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch user by ID
    const getUserById = async (userId: string) => {
        try {
            const res = await adminUserService.getUserById(userId);
            if (res.success && res.data) {
                setSelectedUser(res.data);
                setIsDetailModalOpen(true);
            }
        } catch {
            toast.error("Có lỗi khi lấy người dùng theo id");
        }
    };

    // Delete user by ID
    const deleteUserById = async (userId: string) => {
        try {
            const res = await adminUserService.deleteUserById(userId);
            if (res.success) {
                toast.success("Xóa người dùng thành công!");
                // Remove deleted user from state
                setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
            }
        } catch {
            toast.error("Có lỗi khi xóa người dùng!");
        } finally {
            setIsConfirmModalOpen(false);
            setUserToDelete(null);
        }
    };

    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        // Update URL search params
        const params: Record<string, string> = {};
        if (value) params.search = value;
        if (selectedRole !== 'ALL') params.role = selectedRole;
        
        setSearchParams(params);
    };

    // Handle role filter change
    const handleRoleChange = (role: ROLE | 'ALL') => {
        setSelectedRole(role);
        
        // Update URL search params
        const params: Record<string, string> = {};
        if (searchTerm) params.search = searchTerm;
        if (role !== 'ALL') params.role = role;
        
        setSearchParams(params);
    };

    // Filter users based on search term and role
    const filteredUsers = users.filter(user => {
        // Filter by role
        const roleMatch = selectedRole === 'ALL' || user.role === selectedRole;
        
        // Filter by search term
        const searchMatch = !searchTerm || 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullname.toLowerCase().includes(searchTerm.toLowerCase());
        
        return roleMatch && searchMatch;
    });

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

    // Format role display
    const getRoleDisplay = (role: ROLE) => {
        switch (role) {
            case ROLE.ADMIN:
                return { text: 'Quản trị viên', color: '#dc2626', bgColor: '#fef2f2' };
            case ROLE.USER:
                return { text: 'Người dùng', color: '#2563eb', bgColor: '#eff6ff' };
            default:
                return { text: role, color: '#6b7280', bgColor: '#f3f4f6' };
        }
    };

    // Get role statistics
    const getRoleStats = () => {
        const total = users.length;
        const adminCount = users.filter(user => user.role === ROLE.ADMIN).length;
        const userCount = users.filter(user => user.role === ROLE.USER).length;
        
        return { total, adminCount, userCount };
    };

    const roleStats = getRoleStats();

    // Handle delete confirmation
    const handleDeleteClick = (userId: string) => {
        setUserToDelete(userId);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            deleteUserById(userToDelete);
        }
    };

    // Initialize filters from URL
    useEffect(() => {
        const searchParam = searchParams.get('search');
        const roleParam = searchParams.get('role') as ROLE | null;
        
        if (searchParam) {
            setSearchTerm(searchParam);
        }
        
        if (roleParam && Object.values(ROLE).includes(roleParam)) {
            setSelectedRole(roleParam);
        }
    }, [searchParams]);

    // Fetch users on component mount
    useEffect(() => {
        fetchAllUsers();
    }, [location.pathname, fetchAllUsers]);

    return (
        <div className="user-management-container">
            <div className="user-management-header">
                <h1 className="user-management-title">Quản lý người dùng</h1>
                <div className="user-management-stats">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-label">Tổng số:</span>
                            <span className="stat-value total">{roleStats.total}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Quản trị viên:</span>
                            <span className="stat-value admin">{roleStats.adminCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Người dùng:</span>
                            <span className="stat-value user">{roleStats.userCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="user-filters-section">
                {/* Search Bar */}
                <div className="user-search-bar">
                    <div className="search-input-container">
                        <i className="fa-solid fa-magnifying-glass search-icon"></i>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm kiếm người dùng theo tên, email hoặc họ tên..."
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

                {/* Role Filter */}
                <div className="role-filter">
                    <div className="filter-label">
                        <i className="fa-solid fa-filter"></i>
                        Lọc theo vai trò:
                    </div>
                    <div className="role-buttons">
                        <button
                            className={`role-btn ${selectedRole === 'ALL' ? 'active' : ''}`}
                            onClick={() => handleRoleChange('ALL')}
                        >
                            Tất cả
                        </button>
                        <button
                            className={`role-btn ${selectedRole === ROLE.ADMIN ? 'active' : ''}`}
                            onClick={() => handleRoleChange(ROLE.ADMIN)}
                        >
                            Quản trị viên
                        </button>
                        <button
                            className={`role-btn ${selectedRole === ROLE.USER ? 'active' : ''}`}
                            onClick={() => handleRoleChange(ROLE.USER)}
                        >
                            Người dùng
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="loading-container">
                    <LoadingSpinner size="small" />
                    <p className="loading-text">Đang tải danh sách người dùng...</p>
                </div>
            ) : (
                <>
                    {/* Users Table */}
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th className="text-center">STT</th>
                                    <th>Tên đăng nhập</th>
                                    <th>Email</th>
                                    <th>Họ và tên</th>
                                    <th>Vai trò</th>
                                    <th>Xác thực email</th>
                                    <th>Ngày tạo</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => {
                                        const roleInfo = getRoleDisplay(user.role);
                                        return (
                                            <tr key={user.userId} className="user-row">
                                                <td className="text-center">{index + 1}</td>
                                                <td className="user-username">
                                                    <div 
                                                        className="username-link"
                                                        onClick={() => getUserById(user.userId)}
                                                    >
                                                        {user.username}
                                                    </div>
                                                </td>
                                                <td className="user-email">
                                                    <div className="email-container">
                                                        <i className="fa-solid fa-envelope email-icon"></i>
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td>{user.fullname}</td>
                                                <td>
                                                    <span 
                                                        className="role-badge"
                                                        style={{
                                                            backgroundColor: roleInfo.bgColor,
                                                            color: roleInfo.color
                                                        }}
                                                    >
                                                        {roleInfo.text}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    {user.emailVerified ? (
                                                        <span className="verified-badge">
                                                            <i className="fa-solid fa-check-circle"></i>
                                                            Đã xác thực
                                                        </span>
                                                    ) : (
                                                        <span className="unverified-badge">
                                                            <i className="fa-solid fa-times-circle"></i>
                                                            Chưa xác thực
                                                        </span>
                                                    )}
                                                </td>
                                                <td>{formatDate(user.createdAt)}</td>
                                                <td className="text-center">
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-action btn-view"
                                                            onClick={() => getUserById(user.userId)}
                                                            title="Xem chi tiết"
                                                        >
                                                            <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                        <button
                                                            className="btn-action btn-delete"
                                                            onClick={() => handleDeleteClick(user.userId)}
                                                            title="Xóa người dùng"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="no-data">
                                            {searchTerm || selectedRole !== 'ALL' 
                                                ? 'Không tìm thấy người dùng phù hợp' 
                                                : 'Không có người dùng nào'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* User Detail Modal */}
            <AppModal
                isOpen={isDetailModalOpen}
                title="Chi tiết người dùng"
                onClose={() => setIsDetailModalOpen(false)}
                padding="30px"
            >
                {selectedUser && (
                    <div className="user-detail-content">
                        <div className="user-detail-header">
                            <div className="user-avatar-section">
                                <div className="user-avatar">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <div className="user-basic-info">
                                    <h2 className="user-fullname">{selectedUser.fullname}</h2>
                                    <p className="user-username">@{selectedUser.username}</p>
                                </div>
                            </div>
                            
                            <div className="user-detail-meta">
                                <span className="meta-item">
                                    <i className="fa-solid fa-user-tag"></i>
                                    <span 
                                        className="detail-role-badge"
                                        style={{
                                            backgroundColor: getRoleDisplay(selectedUser.role).bgColor,
                                            color: getRoleDisplay(selectedUser.role).color
                                        }}
                                    >
                                        {getRoleDisplay(selectedUser.role).text}
                                    </span>
                                </span>
                                <span className="meta-item">
                                    <i className="fa-solid fa-calendar"></i>
                                    {formatDate(selectedUser.createdAt)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="user-detail-info">
                            <div className="info-section">
                                <h3 className="info-title">
                                    <i className="fa-solid fa-id-card"></i>
                                    Thông tin tài khoản
                                </h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Email:</span>
                                        <span className="info-value email-value">
                                            <i className="fa-solid fa-envelope"></i>
                                            {selectedUser.email}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Trạng thái email:</span>
                                        <span className={`info-value ${selectedUser.emailVerified ? 'verified' : 'unverified'}`}>
                                            {selectedUser.emailVerified ? (
                                                <>
                                                    <i className="fa-solid fa-check-circle"></i>
                                                    Đã xác thực
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-times-circle"></i>
                                                    Chưa xác thực
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">ID người dùng:</span>
                                        <span className="info-value user-id">
                                            <i className="fa-solid fa-fingerprint"></i>
                                            {selectedUser.userId}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="user-detail-footer">
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
                message="Bạn có chắc chắn muốn xóa người dùng này? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác."
                onCancel={() => {
                    setIsConfirmModalOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default UserManagement;