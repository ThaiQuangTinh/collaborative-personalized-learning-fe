import { Gender } from "../constants/gender";

export interface UpdateAvatarRequest {
    file: File;
}

export interface UserInfoResponse {
    userId: string,
    email: string,
    fullname: string,
    avatarUrl: string,
    phone: string,
    address: string,
    gender: Gender,
    emailVerified: boolean,
    createdAt: string
}

export interface UserInfo {
    userId: string,
    email: string,
    fullname: string,
    avatarUrl: string,
    phone: string,
    address: string,
    gender: Gender,
    emailVerified: boolean,
    createdAt: string
}

export const mapUserInfoResponseToUserInfo = (
    res: UserInfoResponse
): UserInfo => {
    return {
        userId: res.userId,
        email: res.email,
        fullname: res.fullname,
        avatarUrl: res.avatarUrl,
        phone: res.phone,
        address: res.address,
        gender: res.gender,
        emailVerified: res.emailVerified,
        createdAt: res.createdAt
    };
};

export interface UpdateUserInfoRequest {
    email: string,
    fullname: string,
    phone: string,
    address: string,
    gender: Gender
}

export interface UpdateUserInfoResponse {
    email: string,
    fullname: string,
    phone: string,
    address: string,
    gender: Gender,
    emailVerified: boolean,
    createdAt: string
}

export interface UpdateAvatarResponse {
    avatarUrl: string
}

export interface UpdateUserPasswordRequest {
    currentPassword: string,
    newPassword: string
}
