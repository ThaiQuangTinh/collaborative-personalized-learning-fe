import { ApiResponse } from "../types/common";
import { UpdateUserSettingsRequest, UserSettingsResponse } from "../types/userSettings";
import api from "./api";

const USER_BASE = "/api/user-settings";

class UserSettingsService {

    // Get setting of user.
    async getUserSettings(): Promise<ApiResponse<UserSettingsResponse>> {
        return api.get(`${USER_BASE}/me`);
    }

    // Set default settings for user.
    async setDefaultUserSettings(): Promise<ApiResponse<UserSettingsResponse>> {
        return api.post(`${USER_BASE}/default`);
    }

    // Update user settings.
    async updateUserSettings(data: UpdateUserSettingsRequest):
        Promise<ApiResponse<UserSettingsResponse>> {

        return api.patch(`${USER_BASE}/me`, data);
    }

}

const userSettingsService = new UserSettingsService();

export default userSettingsService;