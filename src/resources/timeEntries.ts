import { AxiosInstance } from "axios";
import { TimeEntry } from "../types/timeEntry";
import { ApiResponse } from "../types/apiResponse";
import { toSnakeCase } from "../utils/toSnakeCase";

export interface StartTimerOptions {
  /**
   * Project reference e.g.: '/projects/1'
   */
  project: string;

  /**
   * Title of the time entry
   */
  title?: string;

  /**
   * Notes for the time entry
   */
  notes?: string;

  /**
   * Start date of the timer
   * Defaults to "now"
   * Example: '2023-01-01T00:00:00+00:00'
   */
  startDate?: string;

  /**
   * If true, any existing time entries that overlap with the new time entry
   * will be adjusted or deleted altogether. Defaults to false.
   */
  replaceExisting?: boolean;

  /**
   * Custom fields
   */
  customFields?: Record<string, string>;
}

export interface CreateTimeEntryOptions {
  /**
   * Project reference e.g.: '/projects/1'
   */
  project: string;

  /**
   * Start date of the time entry
   * Example: '2023-01-01T00:00:00+00:00'
   */
  startDate: string;

  /**
   * End date of the time entry
   * Example: '2023-01-01T01:00:00+00:00'
   */
  endDate: string;

  /**
   * Title of the time entry
   */
  title?: string;

  /**
   * Notes for the time entry
   */
  notes?: string;

  /**
   * If true, any existing time entries that overlap with the new time entry
   * will be adjusted or deleted altogether. Defaults to false.
   */
  replaceExisting?: boolean;

  /**
   * Custom fields
   */
  customFields?: Record<string, string>;
}

export interface ListTimeEntriesQuery {
  /**
   * Start date for filtering time entries
   */
  startDateMin?: string;
  /**
   * End date for filtering time entries
   */
  startDateMax?: string;

  /**
   * Project reference e.g.: '/projects/1'
   */
  projects?: string[];

  /**
   * Include child projects in the search
   */
  includeChildProjects?: boolean;

  /**
   * Search query for filtering time entries
   */
  searchQuery?: string;

  /**
   * Return only time entries that are currently running or not
   */
  isRunning?: boolean;

  /**
   * Include project data in the response
   */
  includeProjectData: boolean;
}

/**
 * API resource for time entries
 */
export class TimeEntriesResource {
  constructor(private readonly axios: AxiosInstance) { }

  /**
   * Start a timer
   * @param options Timer start options
   * @returns Created time entry
   */
  public async start(options: StartTimerOptions): Promise<TimeEntry> {
    const response = await this.axios.post<ApiResponse<TimeEntry>>(
      "/time-entries/start",
      toSnakeCase(options),
    );
    return response.data.data;
  }

  /**
   * Stop the currently running timer
   * @returns Stopped time entry
   */
  public async stop(): Promise<TimeEntry> {
    const response = await this.axios.put<ApiResponse<TimeEntry>>(
      "/time-entries/stop",
      {},
    );
    return response.data.data;
  }

  /**
   * Create a new time entry
   * @param options Time entry creation options
   * @returns Created time entry
   */
  public async create(options: CreateTimeEntryOptions): Promise<TimeEntry> {
    const response = await this.axios.post<ApiResponse<TimeEntry>>(
      "/time-entries",
      toSnakeCase(options),
    );
    return response.data.data;
  }

  /**
   * Get a list of time entries
   * @param query Query parameters
   * @returns List of time entries
   */
  public async list(query?: Record<string, any>): Promise<TimeEntry[]> {
    const response = await this.axios.get<ApiResponse<TimeEntry[]>>(
      "/time-entries",
      {
        params: query ? toSnakeCase(query) : undefined,
      },
    );
    return response.data.data;
  }

  /**
   * Get a specific time entry
   * @param id Time entry ID
   * @returns Time entry
   */
  public async get(id: string): Promise<TimeEntry> {
    const response = await this.axios.get<ApiResponse<TimeEntry>>(
      `/time-entries/${id}`,
    );
    return response.data.data;
  }

  /**
   * Update a specific time entry
   * @param id Time entry ID
   * @param data Update data
   * @returns Updated time entry
   */
  public async update(
    id: string,
    data: Partial<TimeEntry>,
  ): Promise<TimeEntry> {
    const response = await this.axios.put<ApiResponse<TimeEntry>>(
      `/time-entries/${id}`,
      toSnakeCase(data),
    );
    return response.data.data;
  }

  /**
   * Delete a specific time entry
   * @param id Time entry ID
   * @returns Result of the delete operation
   */
  public async delete(id: string): Promise<void> {
    await this.axios.delete(`/time-entries/${id}`);
  }
}
