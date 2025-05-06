import { AxiosInstance } from "axios";
import { Project } from "../types/project";
import { ApiResponse } from "../types/apiResponse";
import { TimeEntry } from "../types/timeEntry";
import { toSnakeCase } from "../utils/toSnakeCase";

export interface CreateProjectOptions {
  /**
   * Project title
   */
  title: string;

  /**
   * Project color
   * Example: '#FF0000'
   */
  color?: string;

  /**
   * Parent project reference
   * Example: '/projects/1'
   */
  parent?: string;

  /**
   * Project notes
   */
  notes?: string;

  /**
   * Project productivity score
   * Example: 0.8
   */
  productivityScore?: number;

  /**
   * Custom fields
   */
  customFields?: Record<string, string>;
}

export interface ListProjectsQuery {
  /**
   * Filter by project title
   */
  title?: string;

  /**
   * Hide archived projects
   */
  hideArchived?: boolean;
}

/**
 * API resource for projects
 */
export class ProjectsResource {
  constructor(private readonly axios: AxiosInstance) { }

  /**
   * Get a list of projects
   * @param query Query parameters
   * @returns List of projects
   */
  public async list(query?: ListProjectsQuery): Promise<Project[]> {
    const response = await this.axios.get<ApiResponse<Project[]>>("/projects", {
      params: query ? toSnakeCase(query) : undefined,
    });
    return response.data.data;
  }

  /**
   * Get a specific project
   * @param id Project ID
   * @returns Project
   */
  public async get(id: string): Promise<Project> {
    const response = await this.axios.get<ApiResponse<Project>>(
      `/projects/${id}`,
    );
    return response.data.data;
  }

  /**
   * Create a new project
   * @param options Project creation options
   * @returns Created project
   */
  public async create(options: CreateProjectOptions): Promise<Project> {
    const response = await this.axios.post<ApiResponse<Project>>(
      "/projects",
      toSnakeCase(options),
    );
    return response.data.data;
  }

  /**
   * Update a specific project
   * @param id Project ID
   * @param data Update data
   * @returns Updated project
   */
  public async update(
    id: string,
    data: Partial<CreateProjectOptions>,
  ): Promise<Project> {
    const response = await this.axios.put<ApiResponse<Project>>(
      `/projects/${id}`,
      toSnakeCase(data),
    );
    return response.data.data;
  }

  /**
   * Delete a specific project
   * @param id Project ID
   * @returns Result of the delete operation
   */
  public async delete(id: string): Promise<void> {
    await this.axios.delete(`/projects/${id}`);
  }
}
