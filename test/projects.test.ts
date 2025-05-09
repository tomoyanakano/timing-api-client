import { ProjectsResource, ListProjectsQuery } from "../src/resources/projects"; // Import ListProjectsQuery
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
      const expectedProjects: Project[] = [
        {
          self: "/projects/123",
          title: "Project 1",
          color: "#FF0000",
          // Add other required Project fields if necessary, e.g., from Project type
          title_chain: ["Project 1"],
          productivity_score: 1,
          is_archived: false,
          notes: null,
          children: [],
          parent: null,
          custom_fields: {},
          team_id: null,
        },
        {
          self: "/projects/124",
          title: "Project 2",
          color: "#00FF00",
          title_chain: ["Project 2"],
          productivity_score: 1,
          is_archived: false,
          notes: null,
          children: [],
          parent: null,
          custom_fields: {},
          team_id: null,
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: { data: expectedProjects } });

      const result = await projects.list();

      expect(mockedAxios.get).toHaveBeenCalledWith("/projects", {
        params: undefined,
      });
      expect(result).toEqual(expectedProjects);
      expect(result.length).toBe(2);
    });

    test("should get filtered projects using valid query parameters", async () => {
      const query: ListProjectsQuery = { // Use ListProjectsQuery type
        title: "Sub Project", // Use a valid query param like 'title'
        hideArchived: true,   // camelCase input
      };
      const expectedProjects: Project[] = [
        {
          self: "/projects/123",
          title: "Sub Project 1",
          color: "#FF0000",
          parent: null, // parent is part of Project type, not query for list
          title_chain: ["Sub Project 1"],
          productivity_score: 1,
          is_archived: false,
          notes: null,
          children: [],
          custom_fields: {},
          team_id: null,
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: { data: expectedProjects } });

      const result = await projects.list(query);

      expect(mockedAxios.get).toHaveBeenCalledWith("/projects", {
        params: { // Expect snake_case params
          title: "Sub Project",
          hide_archived: true,
        },
      });
      expect(result).toEqual(expectedProjects);
    });
  });

  describe("get", () => {
    test("should get a specific project", async () => {
      const id = "123";
      const expectedProject: Project = {
        self: "/projects/123",
        title: "Project 1",
        color: "#FF0000",
        notes: "Project notes",
        children: [{ self: "/projects/456" }, { self: "/projects/457" }], // children are usually Project references
        title_chain: ["Project 1"],
        productivity_score: 1,
        is_archived: false,
        parent: null,
        custom_fields: {},
        team_id: null,
      };

      mockedAxios.get.mockResolvedValueOnce({ data: { data: expectedProject } });

      const result = await projects.get(id);

      expect(mockedAxios.get).toHaveBeenCalledWith(`/projects/${id}`);
      expect(result).toEqual(expectedProject);
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
        notes: "Project notes", // camelCase
      };
      const expectedProject: Project = {
        self: "/projects/789",
        title: "New Project",
        color: "#0000FF",
        notes: "Project notes",
        title_chain: ["New Project"], productivity_score: 1, is_archived: false, children: [], parent: null, custom_fields: {}, team_id: null,
      };

      mockedAxios.post.mockResolvedValueOnce({ data: { data: expectedProject } });

      const result = await projects.create(options);

      expect(mockedAxios.post).toHaveBeenCalledWith("/projects", { // Expect snake_case
        title: "New Project",
        color: "#0000FF",
        notes: "Project notes",
      });
      expect(result).toEqual(expectedProject);
    });

    test("should create a sub-project", async () => {
      const options = {
        title: "Sub Project",
        parent: "/projects/123", // parent is a valid field for create options
      };
      const expectedProject: Project = {
        self: "/projects/456",
        title: "Sub Project",
        parent: { self: "/projects/123" },
        title_chain: ["Parent Project", "Sub Project"], productivity_score: 1, is_archived: false, children: [], color: "#FFFFFF", notes: null, custom_fields: {}, team_id: null,
      };

      mockedAxios.post.mockResolvedValueOnce({ data: { data: expectedProject } });

      const result = await projects.create(options);

      expect(mockedAxios.post).toHaveBeenCalledWith("/projects", { // Expect snake_case (parent is already snake_case like)
        title: "Sub Project",
        parent: "/projects/123",
      });
      expect(result).toEqual(expectedProject);
    });

    test("should handle custom fields", async () => {
      const options = {
        title: "Project with Custom Fields",
        customFields: { // camelCase
          client_id: "123",
          department: "Engineering",
        },
      };
      const expectedProject: Project = {
        self: "/projects/789",
        title: "Project with Custom Fields",
        custom_fields: {
          client_id: "123",
          department: "Engineering",
        },
        title_chain: ["Project with Custom Fields"], productivity_score: 1, is_archived: false, children: [], parent: null, color: "#FFFFFF", notes: null, team_id: null,
      };

      mockedAxios.post.mockResolvedValueOnce({ data: { data: expectedProject } });

      const result = await projects.create(options);

      expect(mockedAxios.post).toHaveBeenCalledWith("/projects", { // Expect snake_case
        title: "Project with Custom Fields",
        custom_fields: {
          client_id: "123",
          department: "Engineering",
        },
      });
      expect(result).toEqual(expectedProject);
    });
  });

  describe("update", () => {
    test("should update a project", async () => {
      const id = "123";
      const data = {
        title: "Updated Project", // camelCase (though title is often same)
        notes: "Updated notes",   // camelCase
      };
      const expectedProject: Project = {
        self: "/projects/123",
        title: "Updated Project",
        notes: "Updated notes",
        color: "#FF0000",
        title_chain: ["Updated Project"], productivity_score: 1, is_archived: false, children: [], parent: null, custom_fields: {}, team_id: null,
      };

      mockedAxios.put.mockResolvedValueOnce({ data: { data: expectedProject } });

      const result = await projects.update(id, data);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/projects/${id}`, { // Expect snake_case
        title: "Updated Project",
        notes: "Updated notes",
      });
      expect(result).toEqual(expectedProject);
    });

    test("should update a project color", async () => {
      const id = "123";
      const data = {
        color: "#00FF00",
      };
      const expectedProject: Project = {
        self: "/projects/123",
        title: "Project 1",
        color: "#00FF00",
        title_chain: ["Project 1"], productivity_score: 1, is_archived: false, children: [], parent: null, notes: null, custom_fields: {}, team_id: null,
      };

      mockedAxios.put.mockResolvedValueOnce({ data: { data: expectedProject } });

      const result = await projects.update(id, data);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/projects/${id}`, { // color is already snake_case like
        color: "#00FF00",
      });
      expect(result).toEqual(expectedProject);
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

  // Removed describe("getTimeEntries", ...) as the method does not exist
});
