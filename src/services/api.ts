import axios from "axios";
import { ApiError, ApiResponse } from "../types/common";
import { STORAGE_KEY } from "../constants/storageKey";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN)!;

    if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => {
        const contentType = response.headers["content-type"];
        const isBlob = response.config.responseType === "blob";

        // Nếu là file download → giữ nguyên response
        if (isBlob || contentType?.includes("application/octet-stream")) {
            return response; 
        }

        // API bình thường → vẫn trả về response.data
        return response.data;
    },
    (error) => {
        if (error.response) {
            const err = error.response.data;

            return Promise.reject({
                status: err.status,
                success: false,
                message: err.message,
                data: err.data,
                error: {
                    code: err.error?.code || "UNKNOWN",
                    name: err.error?.name || "UnknownError",
                    message: err.error?.message || "Unexpected error occurred",
                } as ApiError,
                timestamp: err.timestamp,
                path: err.path,
            } satisfies ApiResponse<null>);
        }

        return Promise.reject({
            status: 0,
            success: false,
            message: "Cannot connect to server",
            error: {
                code: "NETWORK_ERROR",
                name: "Network Error",
                message: "Cannot connect to server",
            } as ApiError,
            timestamp: new Date().toISOString(),
            path: "",
        } satisfies ApiResponse<null>);
    }
);

export default api;