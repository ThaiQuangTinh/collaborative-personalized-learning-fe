import { ApiResponse } from "../types/common";
import { LearningPathStatisticResponse } from "../types/learningPath";
import { NotificationResponse } from "../types/notification";
import { UpdateAvatarRequest, UpdateAvatarResponse, UpdateUserInfoRequest, UpdateUserInfoResponse, UpdateUserPasswordRequest, UserInfoResponse } from "../types/user";
import api from "./api";

const USER_BASE = "/api/users";

class UserService {

    // Get avatar url of user.
    async getAvatarUrl(): Promise<ApiResponse<{ avatarUrl: string }>> {
        return api.get(`${USER_BASE}/me/avatar`);
    }

    // Update avatar of user.
    async updateAvatar(data: UpdateAvatarRequest):
        Promise<ApiResponse<UpdateAvatarResponse>> {

        const formData = new FormData();
        formData.append("file", data.file);

        return api.post(`${USER_BASE}/me/avatar`, formData);
    }

    // Get user info.
    async getUserInfo(): Promise<ApiResponse<UserInfoResponse>> {
        return api.get(`${USER_BASE}/me`);
    }

    // Update user info.
    async updateUserInfo(data: UpdateUserInfoRequest):
        Promise<ApiResponse<UserInfoResponse>> {

        return api.patch(`${USER_BASE}/me`, data);
    }

    // Change password.
    async changeUserPassword(data: UpdateUserPasswordRequest):
        Promise<ApiResponse<UserInfoResponse>> {

        return api.patch(`${USER_BASE}/me/password`, data);
    }

    // Get all notifications.
    async getAllNotifications():
        Promise<ApiResponse<NotificationResponse[]>> {

        return api.get(`${USER_BASE}/me/notifications`);
    }

    // Get all notifications.
    async getAllLearningPathsStatistic():
        Promise<ApiResponse<LearningPathStatisticResponse[]>> {

        return api.get(`${USER_BASE}/me/statistics`);
    }
}

const userService = new UserService();

export default userService;