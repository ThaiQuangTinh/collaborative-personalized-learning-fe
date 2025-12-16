import React, { createContext, useState } from "react";
import { LoginResponse, UserInfo } from "../types/auth";
import { Storage } from "../utils/storage";
import { STORAGE_KEY } from "../constants/storageKey";

interface AuthContextType {
    user: UserInfo | null;
    accessToken: string | null;
    refreshToken: string | null;
    setAuth: (data: LoginResponse) => void;
    clearAuth: () => void;
    updateUser: (user: Partial<UserInfo>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserInfo | null>(Storage.get("user"));
    const [accessToken, setAccessToken] = useState<string | null>(Storage.get("accessToken"));
    const [refreshToken, setRefreshToken] = useState<string | null>(Storage.get("refreshToken"));

    const setAuth = (data: LoginResponse) => {
        setUser(data.user);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        Storage.set(STORAGE_KEY.USER, data.user);
        Storage.set(STORAGE_KEY.ACCESS_TOKEN, data.accessToken);
        Storage.set(STORAGE_KEY.REFRESH_TOKEN, data.refreshToken);
    };

    const clearAuth = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        Storage.remove(STORAGE_KEY.USER);
        Storage.remove(STORAGE_KEY.ACCESS_TOKEN);
        Storage.remove(STORAGE_KEY.REFRESH_TOKEN);
    };

    const updateUser = (newUserData: Partial<UserInfo>) => {
        setUser(prev => {
            const updated = { ...prev, ...newUserData } as UserInfo;
            Storage.set(STORAGE_KEY.USER, updated);
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, refreshToken, setAuth, clearAuth, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
