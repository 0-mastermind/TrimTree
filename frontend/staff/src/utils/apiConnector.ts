import axios, {
  type Method,
  type AxiosRequestHeaders,
  type AxiosResponse,
  AxiosError,
} from "axios";

export const axiosInstance = axios.create({
  withCredentials: true,
});

// Generic API response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  status?: number;
  data?: T;
}

export const apiConnector = async <T = unknown>(
  method: Method,
  url: string,
  bodyData?: Record<string, unknown> | FormData,
  headers?: AxiosRequestHeaders,
  params?: Record<string, string | number | boolean>
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance({
      method,
      url,
      data: bodyData ?? null,
      headers,
      params,
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiResponse<T>>;

    if (err.response) {
      return {
        success: false,
        message: err.response.data?.message ?? "Request failed",
        status: err.response.status,
      };
    }

    return {
      success: false,
      message: "Unexpected error",
    };
  }
};
