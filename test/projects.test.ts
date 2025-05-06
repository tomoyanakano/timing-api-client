import { ProjectsResource } from "../src/resources/projects";
import { Project } from "../src/types/project";
import axios, { AxiosError } from "axios";

// Mock Axios instance
const mockedAxios = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
} as any;

// Helper to create axios errors for testing
function createAxiosError(status: number, message: string): AxiosError {
  const error = new Error(message) as AxiosError;
  error.isAxiosError = true;
  error.response = {
    status,
    statusText: status === 404 ? "Not Found" : "Error",
    headers: {},
    config: {} as any,
    data: { error: message },
  };
  return error;
}

describe("ProjectsResource", () => {
  let projects: ProjectsResource;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create ProjectsResource instance
    projects = new ProjectsResource(mockedAxios);
  });

  describe("list", () => {
    test("should get a list of projects", async () => {
      const mockResponse = {
        data: [
          {
            self: "/projects/123",
            title: "Project 1",
            color: "#FF0000",
          },
          {
            self: "/projects/124",
            title: "Project 2",
            color: "#00FF00",
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await projects.list();

      expect(mockedAxios.get).toHaveBeenCalledWith("/projects", {
        params: undefined,
      });
      expect(result).toEqual(mockResponse.data);
      expect(result.length).toBe(2);
    });

    test("should get filtered projects", async () => {
      const query = {
        parent: "/projects/100",
      };

      const mockResponse = {
        data: [
          {
            self: "/projects/123",
            title: "Sub Project 1",
            color: "#FF0000",
            parent: "/projects/100",
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await projects.list(query);

      expect(mockedAxios.get).toHaveBeenCalledWith("/projects", {
        params: query,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("get", () => {
    test("should get a specific project", async () => {
      const id = "123";

      const mockResponse = {
        data: {
          self: "/projects/123",
          title: "Project 1",
          color: "#FF0000",
          notes: "Project notes",
          children: ["/projects/456", "/projects/457"],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await projects.get(id);

      expect(mockedAxios.get).toHaveBeenCalledWith(`/projects/${id}`);
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle non-existent project", async () => {
      const id = "non-existent";

      const errorResponse = createAxiosError(404, "Project not found");

      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      await expect(projects.get(id)).rejects.toThrow();
    });
  });

  describe("create", () => {
    test("should create a project with valid options", async () => {
      const options = {
        title: "New Project",
        color: "#0000FF",
        notes: "Project notes",
      };

      const mockResponse = {
        data: {
          self: "/projects/789",
          title: "New Project",
          color: "#0000FF",
          notes: "Project notes",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await projects.create(options);

      expect(mockedAxios.post).toHaveBeenCalledWith("/projects", options);
      expect(result).toEqual(mockResponse.data);
    });

    test("should create a sub-project", async () => {
      const options = {
        title: "Sub Project",
        parent: "/projects/123",
      };

      const mockResponse = {
        data: {
          self: "/projects/456",
          title: "Sub Project",
          parent: "/projects/123",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await projects.create(options);

      expect(mockedAxios.post).toHaveBeenCalledWith("/projects", options);
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle custom fields", async () => {
      const options = {
        title: "Project with Custom Fields",
        custom_fields: {
          client_id: "123",
          department: "Engineering",
        },
      };

      const mockResponse = {
        data: {
          self: "/projects/789",
          title: "Project with Custom Fields",
          custom_fields: {
            client_id: "123",
            department: "Engineering",
          },
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await projects.create(options);

      expect(mockedAxios.post).toHaveBeenCalledWith("/projects", options);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("update", () => {
    test("should update a project", async () => {
      const id = "123";
      const data = {
        title: "Updated Project",
        notes: "Updated notes",
      };

      const mockResponse = {
        data: {
          self: "/projects/123",
          title: "Updated Project",
          notes: "Updated notes",
          color: "#FF0000",
        },
      };

      mockedAxios.put.mockResolvedValueOnce(mockResponse);

      const result = await projects.update(id, data);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/projects/${id}`, data);
      expect(result).toEqual(mockResponse.data);
    });

    test("should update a project color", async () => {
      const id = "123";
      const data = {
        color: "#00FF00",
      };

      const mockResponse = {
        data: {
          self: "/projects/123",
          title: "Project 1",
          color: "#00FF00",
        },
      };

      mockedAxios.put.mockResolvedValueOnce(mockResponse);

      const result = await projects.update(id, data);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/projects/${id}`, data);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("delete", () => {
    test("should delete a project", async () => {
      const id = "123";

      mockedAxios.delete.mockResolvedValueOnce({});

      await projects.delete(id);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/projects/${id}`);
    });
  });

  describe("getTimeEntries", () => {
    test("should get time entries for a project", async () => {
      const id = "123";

      const mockResponse = {
        data: [
          {
            self: "/time-entries/456",
            project: "/projects/123",
            title: "Time Entry 1",
            start_date: "2023-01-01T10:00:00+00:00",
            end_date: "2023-01-01T12:00:00+00:00",
          },
          {
            self: "/time-entries/457",
            project: "/projects/123",
            title: "Time Entry 2",
            start_date: "2023-01-02T10:00:00+00:00",
            end_date: "2023-01-02T12:00:00+00:00",
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await projects.getTimeEntries(id);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/projects/${id}/time-entries`,
        { params: undefined },
      );
      expect(result).toEqual(mockResponse.data);
      expect(result.length).toBe(2);
    });

    test("should get filtered time entries for a project", async () => {
      const id = "123";
      const query = {
        from: "2023-01-01",
        to: "2023-01-31",
      };

      const mockResponse = {
        data: [
          {
            self: "/time-entries/456",
            project: "/projects/123",
            title: "Time Entry 1",
            start_date: "2023-01-01T10:00:00+00:00",
            end_date: "2023-01-01T12:00:00+00:00",
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await projects.getTimeEntries(id, query);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/projects/${id}/time-entries`,
        { params: query },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
