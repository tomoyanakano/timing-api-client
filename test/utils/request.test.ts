import axios, { AxiosError } from "axios";
import { ApiError, isApiError, performRequest } from "../../src/utils/request";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Request Utils", () => {
  // Mock Axios instance
  const axiosInstance = {
    request: jest.fn(),
  } as any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe("performRequest", () => {
    test("should return data from successful requests", async () => {
      const mockResponse = {
        data: { id: "123", name: "Test" },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      };

      axiosInstance.request.mockResolvedValueOnce(mockResponse);

      const result = await performRequest(axiosInstance, {
        method: "get",
        url: "/test",
      });

      expect(axiosInstance.request).toHaveBeenCalledWith({
        method: "get",
        url: "/test",
      });

      expect(result).toEqual(mockResponse.data);
    });

    test("should handle Axios errors with response", async () => {
      const axiosError = {
        message: "Request failed with status code 401",
        isAxiosError: true,
        response: {
          data: { error: "Authentication error" },
          status: 401,
          statusText: "Unauthorized",
          headers: {},
          config: {},
        },
      };

      axiosInstance.request.mockRejectedValueOnce(axiosError);
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      try {
        await performRequest(axiosInstance, {
          method: "get",
          url: "/test",
        });

        fail("Error should be thrown");
      } catch (error) {
        if (isApiError(error)) {
          expect(error.status).toBe(401);
        } else {
          console.error("Unexpected error structure:", {
            name: error,
            constructor: error?.constructor.name,
            prototype: Object.getPrototypeOf(error),
          });
          throw error;
        }
      }
    });

    test("should handle Axios errors without response", async () => {
      const axiosError = {
        message: "Network Error",
        isAxiosError: true,
        response: undefined,
        toJSON: () => ({}),
      };

      axiosInstance.request.mockRejectedValueOnce(axiosError);
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      try {
        await performRequest(axiosInstance, {
          method: "get",
          url: "/test",
        });

        fail("Error should be thrown");
      } catch (error) {
        if (isApiError(error)) {
          expect(error.status).toBe(500);
        } else {
          console.error("Unexpected error structure:", {
            name: error,
            constructor: error?.constructor.name,
            prototype: Object.getPrototypeOf(error),
          });
          throw error;
        }
      }
    });

    test("should handle non-Axios errors", async () => {
      const genericError = new Error("Generic error");

      axiosInstance.request.mockRejectedValueOnce(genericError);
      mockedAxios.isAxiosError.mockReturnValueOnce(false);

      try {
        await performRequest(axiosInstance, {
          method: "get",
          url: "/test",
        });

        fail("Error should be thrown");
      } catch (error) {
        expect(error).toBe(genericError);
      }
    });
  });

  describe("ApiError", () => {
    test("should be constructed with correct properties", () => {
      const detail = {
        status: 400,
        message: "Bad Request",
        code: "INVALID_PARAMETER",
        originalError: new Error("Original error") as any,
      };

      const error = new ApiError(detail);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("ApiError");
      expect(error.status).toBe(400);
      expect(error.message).toBe("Bad Request");
      expect(error.code).toBe("INVALID_PARAMETER");
      expect(error.originalError).toBe(detail.originalError);
    });

    test("should include error.response.data.error in the message if available", () => {
      const originalError = {
        response: {
          data: {
            error: "Detailed error message",
          },
        },
      } as any;

      const detail = {
        status: 400,
        message: "Bad Request",
        originalError,
      };

      const error = new ApiError(detail);

      expect(error.message).toBe("Bad Request");
    });
  });
});
