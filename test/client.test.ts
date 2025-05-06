import axios, { AxiosError } from "axios";
import { TimingClient } from "../src/client";
import { ApiError } from "../src/utils/request";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("TimingClient", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Default mock implementation for axios.create
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  test("should initialize client with correct options", () => {
    const apiKey = "test-api-key";

    // Create client
    new TimingClient({ apiKey });

    // Check if axios.create was called with correct options
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: "https://web.timingapp.com/api/v1",
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  });

  test("should initialize client with custom options", () => {
    const apiKey = "test-api-key";
    const baseURL = "https://custom-api.example.com";
    const timeout = 5000;

    // Create client with custom options
    new TimingClient({ apiKey, baseURL, timeout });

    // Check if axios.create was called with correct options
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL,
      timeout,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  });

  test("should throw error when initializing without API key", () => {
    // @ts-ignore - intentionally initialize without API key
    expect(() => new TimingClient({})).toThrow("API key is required");
  });

  test("request method should call axios instance request", async () => {
    const apiKey = "test-api-key";
    const responseData = { id: "123", name: "Test" };

    // Set up mock response
    mockedAxios.request.mockResolvedValueOnce({
      data: responseData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });

    const client = new TimingClient({ apiKey });
    const result = await client.request({ method: "get", url: "/test" });

    // Check correct result is returned
    expect(result).toEqual(responseData);
    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: "get",
      url: "/test",
    });
  });

  test("should properly handle axios errors", async () => {
    const apiKey = "test-api-key";
    const axiosError = new Error(
      "Request failed with status code 401",
    ) as AxiosError;
    axiosError.isAxiosError = true;
    axiosError.response = {
      data: { error: "Authentication error" },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: {} as any,
    };

    // Set up error mock
    mockedAxios.request.mockRejectedValueOnce(axiosError);
    mockedAxios.isAxiosError.mockReturnValueOnce(true);

    const client = new TimingClient({ apiKey });

    try {
      await client.request({ method: "get", url: "/test" });
      fail("Error should be thrown");
    } catch (error: any) {
      // Check error details are correct
      expect(error.status).toBe(401);
      expect(error.message).toBe("Authentication error");
    }
  });

  test("should handle network errors", async () => {
    const apiKey = "test-api-key";
    const networkError = new Error("Network Error") as AxiosError;
    networkError.isAxiosError = true;
    networkError.response = undefined;
    networkError.request = {} as any; // Network errors have request but no response

    // Set up network error mock
    mockedAxios.request.mockRejectedValueOnce(networkError);
    mockedAxios.isAxiosError.mockReturnValueOnce(true);

    const client = new TimingClient({ apiKey });

    try {
      await client.request({ method: "get", url: "/test" });
      fail("Error should be thrown");
    } catch (error: any) {
      // For network errors without response, we expect status 500
      expect(error.status).toBe(500);
      expect(error.message).toBe("Network Error");
    }
  });

  test("should expose resource instances", () => {
    const apiKey = "test-api-key";
    const client = new TimingClient({ apiKey });

    // Check if resource instances are exposed
    expect(client.timeEntries).toBeDefined();
    expect(client.projects).toBeDefined();
  });
});
