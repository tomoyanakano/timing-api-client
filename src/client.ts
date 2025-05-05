import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { TimeEntriesResource } from "./resources/timeEntries";
import { ProjectsResource } from "./resources/projects";

export interface TimingClientOptions {
  /**
   * API key for the Timing API
   */
  apiKey: string;

  /**
   * Base URL for the Timing API
   * @default 'https://web.timingapp.com/api/v1'
   */
  baseURL?: string;

  /**
   * Request timeout in milliseconds
   * @default 10000 (10 seconds)
   */
  timeout?: number;
}

/**
 * Main class for the Timing API client
 */
export class TimingClient {
  private readonly axiosInstance: AxiosInstance;

  /**
   * API resources for time entries
   */
  public readonly timeEntries: TimeEntriesResource;

  /**
   * API resources for projects
   */
  public readonly projects: ProjectsResource;

  /**
   * Create a Timing API client
   * @param options Client options
   */
  constructor(options: TimingClientOptions) {
    const {
      apiKey,
      baseURL = "https://web.timingapp.com/api/v1",
      timeout = 10000,
    } = options;

    if (!apiKey) {
      throw new Error("API key is required");
    }

    // Configure Axios instance
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Initialize resources
    this.timeEntries = new TimeEntriesResource(this.axiosInstance);
    this.projects = new ProjectsResource(this.axiosInstance);
  }

  /**
   * Send a custom request
   * @param config Axios request configuration
   * @returns Response body
   */
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.error || error.message;

        throw {
          status: statusCode,
          message: errorMessage,
          originalError: error,
        };
      }
      throw error;
    }
  }
}
