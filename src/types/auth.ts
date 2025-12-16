import { ROLE } from "../constants/role"

// LOGIN
export interface LoginRequest {
  usernameOrEmail: string,
  password: string
}

export interface UserInfo {
  userId: string,
  username: string,
  role: ROLE,
  email: string,
  fullName: string,
  avatarUrl: string,
  verifiedEmail: boolean
}

export interface LoginResponse {
  accessToken: string,
  refreshToken: string,
  tokenType: string,
  expiresIn: number,
  user: UserInfo
}

// REGISTER
export interface RegisterRequest {
  username: string,
  email: string,
  password: string
}

export interface RegisterResponse {
  userId: string,
  username: string,
  email: string,
}

// Verify email
export interface VerifyEmailRequest {
  userId: string,
  code: string
}

// Forgot password
export interface VerifyForgotPwdRequest {
  email: string,
  code: string
}

export interface ResetPasswordRequest {
  email: string,
  newPassword: string,
  token: string
}