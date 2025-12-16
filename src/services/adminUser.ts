import { AdminUserResponse } from "../types/adminUser";
import { ApiResponse } from "../types/common";
import api from "./api";

const NOTE_BASE = "/api/admin/users";

class AdminUserService {

    // Get all users.
    async getAllUsers():
        Promise<ApiResponse<AdminUserResponse[]>> {

        return api.get(`${NOTE_BASE}`);
    }

    // Get user by id.
    async getUserById(userId: string):
        Promise<ApiResponse<AdminUserResponse>> {

        return api.get(`${NOTE_BASE}/${userId}`);
    }

    // Delete user by id.
    async deleteUserById(userId: string):
        Promise<ApiResponse<null>> {

        return api.delete(`${NOTE_BASE}/${userId}`);
    }

}

const adminUserService = new AdminUserService();

export default adminUserService;