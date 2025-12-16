export interface ApiError {
  code: string,
  name: string,
  message: string
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
  timestamp: string;
  path: string;
}