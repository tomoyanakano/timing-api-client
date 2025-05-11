import { ReportsResource } from "../src/resources/reports";
import { GenerateReportQuery, ReportRow } from "../src/types/report";
import { Project } from "../src/types/project";

// Mock Axios instance
const mockedAxios = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
} as any;

describe("ReportsResource", () => {
  let reportsResource: ReportsResource;

  beforeEach(() => {
    // Clear all mock implementations and calls before each test
    mockedAxios.get.mockClear();
    reportsResource = new ReportsResource(mockedAxios);
  });

  describe("generate", () => {
    it("should call GET /report without query parameters if none are provided", async () => {
      const mockReportData: ReportRow[] = [{ duration: 7200 }];
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockReportData }, // ApiResponse structure
      });

      const result = await reportsResource.generate();

      expect(mockedAxios.get).toHaveBeenCalledWith("/report", {
        params: undefined,
      });
      expect(result).toEqual(mockReportData);
    });

    it("should call GET /report with snake_cased query parameters when provided", async () => {
      const validQuery: GenerateReportQuery = {
        startDateMin: "2024-01-01",
        includeAppUsage: false,
        projectGroupingLevel: 1,
        columns: ["project", "title"],
      };

      const mockProject: Project = {
        self: "/projects/123",
        title: "Test Project",
      } as Project; // Cast for test
      const mockReportData: ReportRow[] = [
        { duration: 3600, project: mockProject, title: "Task A" },
      ];
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockReportData },
      });

      const result = await reportsResource.generate(validQuery);

      // toSnakeCase is an internal detail of the method implementation.
      // We verify that the `params` object sent to axios.get contains snake_cased keys.
      expect(mockedAxios.get).toHaveBeenCalledWith("/report", {
        params: {
          start_date_min: "2024-01-01",
          include_app_usage: false,
          project_grouping_level: 1,
          columns: ["project", "title"],
        },
      });
      expect(result).toEqual(mockReportData);
    });

    it("should correctly handle an API response with an empty data array", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [] },
      });

      const result = await reportsResource.generate();
      expect(result).toEqual([]);
      expect(mockedAxios.get).toHaveBeenCalledWith("/report", {
        params: undefined,
      });
    });

    it("should propagate errors if the axios request fails", async () => {
      const errorMessage = "API request failed";
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(reportsResource.generate()).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith("/report", {
        params: undefined,
      });
    });

    it("should handle various query parameter types correctly (e.g. arrays)", async () => {
      const query: GenerateReportQuery = {
        projects: ["/projects/1", "/projects/2"],
        sort: ["-duration", "project"],
      };
      const mockReportData: ReportRow[] = [{ duration: 100 }];
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockReportData },
      });

      await reportsResource.generate(query);

      expect(mockedAxios.get).toHaveBeenCalledWith("/report", {
        params: {
          projects: ["/projects/1", "/projects/2"],
          sort: ["-duration", "project"],
        },
      });
    });
  });
});
