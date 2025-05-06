import { TimeEntriesResource } from "../src/resources/timeEntries";
import { TimeEntry } from "../src/types/timeEntry";
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

describe("TimeEntriesResource", () => {
  let timeEntries: TimeEntriesResource;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create TimeEntriesResource instance
    timeEntries = new TimeEntriesResource(mockedAxios);
  });

  describe("start", () => {
    test("should start a timer with valid options", async () => {
      const options = {
        project: "/projects/123",
        title: "Test Timer",
        notes: "Test Notes",
      };

      const mockResponse = {
        data: {
          self: "/time-entries/456",
          project: "/projects/123",
          title: "Test Timer",
          notes: "Test Notes",
          start_date: "2023-01-01T10:00:00+00:00",
          end_date: null,
          is_running: true,
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await timeEntries.start(options);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/time-entries/start",
        options,
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle optional parameters", async () => {
      const now = new Date().toISOString();
      const options = {
        project: "/projects/123",
        title: "Test Timer",
        notes: "Test Notes",
        startDate: now,
        replaceExisting: true,
      };

      const mockResponse = {
        data: {
          self: "/time-entries/456",
          project: "/projects/123",
          title: "Test Timer",
          notes: "Test Notes",
          start_date: now,
          end_date: null,
          is_running: true,
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await timeEntries.start(options);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/time-entries/start",
        options,
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle API errors", async () => {
      const options = {
        project: "/projects/123",
      };

      const errorResponse = createAxiosError(404, "Project not found");

      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      await expect(timeEntries.start(options)).rejects.toThrow();
    });
  });

  describe("stop", () => {
    test("should stop the current timer", async () => {
      const mockResponse = {
        data: {
          self: "/time-entries/456",
          project: "/projects/123",
          title: "Test Timer",
          notes: "Test Notes",
          start_date: "2023-01-01T10:00:00+00:00",
          end_date: "2023-01-01T12:00:00+00:00",
          is_running: false,
        },
      };

      mockedAxios.put.mockResolvedValueOnce(mockResponse);

      const result = await timeEntries.stop();

      expect(mockedAxios.put).toHaveBeenCalledWith("/time-entries/stop", {});
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when no timer is running", async () => {
      const errorResponse = createAxiosError(
        400,
        "No timer is currently running",
      );

      mockedAxios.put.mockRejectedValueOnce(errorResponse);

      await expect(timeEntries.stop()).rejects.toThrow();
    });
  });

  describe("create", () => {
    test("should create a time entry with valid options", async () => {
      const options = {
        project: "/projects/123",
        startDate: "2023-01-01T10:00:00+00:00",
        endDate: "2023-01-01T12:00:00+00:00",
        title: "Test Entry",
        notes: "Test Notes",
      };

      const mockResponse = {
        data: {
          self: "/time-entries/789",
          project: "/projects/123",
          title: "Test Entry",
          notes: "Test Notes",
          start_date: "2023-01-01T10:00:00+00:00",
          end_date: "2023-01-01T12:00:00+00:00",
          is_running: false,
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await timeEntries.create(options);

      expect(mockedAxios.post).toHaveBeenCalledWith("/time-entries", options);
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle overlapping entries with replaceExisting=true", async () => {
      const options = {
        project: "/projects/123",
        startDate: "2023-01-01T10:00:00+00:00",
        endDate: "2023-01-01T12:00:00+00:00",
        replaceExisting: true,
      };

      const mockResponse = {
        data: {
          self: "/time-entries/789",
          project: "/projects/123",
          start_date: "2023-01-01T10:00:00+00:00",
          end_date: "2023-01-01T12:00:00+00:00",
          is_running: false,
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await timeEntries.create(options);

      expect(mockedAxios.post).toHaveBeenCalledWith("/time-entries", options);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("list", () => {
    test("should get a list of time entries", async () => {
      const mockResponse = {
        data: [
          {
            self: "/time-entries/123",
            project: "/projects/456",
            title: "Entry 1",
            start_date: "2023-01-01T10:00:00+00:00",
            end_date: "2023-01-01T12:00:00+00:00",
          },
          {
            self: "/time-entries/124",
            project: "/projects/456",
            title: "Entry 2",
            start_date: "2023-01-02T10:00:00+00:00",
            end_date: "2023-01-02T12:00:00+00:00",
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await timeEntries.list();

      expect(mockedAxios.get).toHaveBeenCalledWith("/time-entries", {
        params: undefined,
      });
      expect(result).toEqual(mockResponse.data);
      expect(result.length).toBe(2);
    });

    test("should get filtered time entries", async () => {
      const query = {
        from: "2023-01-01",
        to: "2023-01-31",
        project: "/projects/456",
      };

      const mockResponse = {
        data: [
          {
            self: "/time-entries/123",
            project: "/projects/456",
            title: "Entry 1",
            start_date: "2023-01-01T10:00:00+00:00",
            end_date: "2023-01-01T12:00:00+00:00",
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await timeEntries.list(query);

      expect(mockedAxios.get).toHaveBeenCalledWith("/time-entries", {
        params: query,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("get", () => {
    test("should get a specific time entry", async () => {
      const id = "123";

      const mockResponse = {
        data: {
          self: "/time-entries/123",
          project: "/projects/456",
          title: "Entry 1",
          start_date: "2023-01-01T10:00:00+00:00",
          end_date: "2023-01-01T12:00:00+00:00",
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await timeEntries.get(id);

      expect(mockedAxios.get).toHaveBeenCalledWith(`/time-entries/${id}`);
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle non-existent time entry", async () => {
      const id = "non-existent";

      const errorResponse = createAxiosError(404, "Time entry not found");

      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      await expect(timeEntries.get(id)).rejects.toThrow();
    });
  });

  describe("update", () => {
    test("should update a time entry", async () => {
      const id = "123";
      const data = {
        title: "Updated Title",
        notes: "Updated Notes",
      };

      const mockResponse = {
        data: {
          self: "/time-entries/123",
          project: "/projects/456",
          title: "Updated Title",
          notes: "Updated Notes",
          start_date: "2023-01-01T10:00:00+00:00",
          end_date: "2023-01-01T12:00:00+00:00",
        },
      };

      mockedAxios.put.mockResolvedValueOnce(mockResponse);

      const result = await timeEntries.update(id, data);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/time-entries/${id}`, data);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("delete", () => {
    test("should delete a time entry", async () => {
      const id = "123";

      mockedAxios.delete.mockResolvedValueOnce({});

      await timeEntries.delete(id);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/time-entries/${id}`);
    });
  });
});
