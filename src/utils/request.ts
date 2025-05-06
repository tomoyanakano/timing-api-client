import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * Details of an API error
 */
export interface ApiErrorDetail {
  /**
   * HTTP status code
   */
  status: number;

  /**
   * Error message
   */
  message: string;

  /**
   * Error code (if returned by the API)
   */
  code?: string;

  /**
   * The original Axios error
   */
  originalError: AxiosError;
}

/**
 * API request error
 */
export class ApiError extends Error {
  /**
   * HTTP status code
   */
  public readonly status: number;

  /**
   * Error code (if returned by the API)
   */
  public readonly code?: string;

  /**
   * The original Axios error
   */
  public readonly originalError: AxiosError;

  constructor(details: ApiErrorDetail) {
    super(details.message);
    this.name = "ApiError";
    this.status = details.status;
    this.code = details.code;
    this.originalError = details.originalError;

    // Add part of the error message to the error stack
    if (details.originalError.response?.data) {
      this.message = `${this.message}: ${details.originalError.response.data}`;
    }

    // Restore prototype chain (for TypeScript class inheritance)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Performs an API request and processes the response
 * @param axiosInstance Axios instance
 * @param config Request configuration
 * @returns Response data
 * @throws ApiError If a request error occurs
 */
export async function performRequest<T>(
  axiosInstance: AxiosInstance,
  config: AxiosRequestConfig,
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status || 500;
      const errorData = axiosError.response?.data as any;
      const errorMessage =
        errorData?.error ||
        errorData?.message ||
        axiosError.message ||
        "An unknown error occurred";
      const errorCode = errorData?.code;

      throw new ApiError({
        status: statusCode,
        message: errorMessage,
        code: errorCode,
        originalError: axiosError,
      });
    }

    // If it's not an Axios error, re-throw it
    throw error;
  }
}

/**
 * Checks if an error is an instance of ApiError
 * @param error The error to check
 * @returns True if the error is an ApiError, false otherwise
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof Error &&
    (error as ApiError).status !== undefined &&
    (error as ApiError).originalError !== undefined
  );
}
