import { ROLE } from "../constants/role";

export interface AdminUserResponse {
    userId: string,
    username: string,
    email: string,
    fullname: string,
    role: ROLE,
    emailVerified: boolean,
    createdAt: string
}