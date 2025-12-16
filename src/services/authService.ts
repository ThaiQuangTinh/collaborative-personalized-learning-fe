import {
    LoginRequest, LoginResponse, RegisterRequest, RegisterResponse,
    ResetPasswordRequest, VerifyEmailRequest, VerifyForgotPwdRequest
} from "../types/auth";
import { ApiResponse } from "../types/common";
import api from "./api";

const AUTH_BASE = "/api/auth";

class AuthService {

    async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return api.post(`${AUTH_BASE}/login`, data);
    }

    async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
        return api.post(`${AUTH_BASE}/registrations`, data);
    }

    async sendCodeToVerifyEmail(data: { userId: string }): Promise<ApiResponse<null>> {
        return api.post(`${AUTH_BASE}/email-verifications`, data);
    }

    async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<null>> {
        return api.post(`${AUTH_BASE}/email-verifications/verify`, data);
    }

    async sendCodeToForgotPwd(data: { email: string }): Promise<ApiResponse<null>> {
        return api.post(`${AUTH_BASE}/password-resets`, data);
    }

    async verifyForgotPwd(data: VerifyForgotPwdRequest): Promise<ApiResponse<{ token: string }>> {
        return api.post(`${AUTH_BASE}/password-resets/verify`, data);
    }

    async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<null>> {
        return api.patch(`${AUTH_BASE}/password-resets/reset`, data);
    }

}

const authService = new AuthService();

export default authService;