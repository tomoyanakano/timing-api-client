import {
  validateRequiredFields,
  isValidISODateString,
  validateISODateString,
  isValidProjectReference,
  validateProjectReference,
  validateCustomFields,
} from "../../src/utils/validation";

describe("Validation Utils", () => {
  describe("validateRequiredFields", () => {
    test("should not throw for valid objects", () => {
      const obj = { field1: "value1", field2: "value2" };

      expect(() =>
        validateRequiredFields(obj, ["field1", "field2"]),
      ).not.toThrow();
    });

    test("should throw for missing fields", () => {
      const obj = { field1: "value1" };

      expect(() => validateRequiredFields(obj, ["field1", "field2"])).toThrow(
        "Missing required fields: field2",
      );
    });

    test("should throw for empty fields", () => {
      const obj = { field1: "value1", field2: "" };

      expect(() => validateRequiredFields(obj, ["field1", "field2"])).toThrow(
        "Missing required fields: field2",
      );
    });

    test("should throw for null fields", () => {
      const obj = { field1: "value1", field2: null };

      expect(() => validateRequiredFields(obj, ["field1", "field2"])).toThrow(
        "Missing required fields: field2",
      );
    });

    test("should combine multiple missing fields in error message", () => {
      const obj = { field3: "value3" };

      expect(() => validateRequiredFields(obj, ["field1", "field2"])).toThrow(
        "Missing required fields: field1, field2",
      );
    });
  });

  describe("isValidISODateString", () => {
    test("should return true for valid ISO 8601 date strings", () => {
      expect(isValidISODateString("2023-01-01T10:00:00Z")).toBe(true);
      expect(isValidISODateString("2023-01-01T10:00:00+00:00")).toBe(true);
      expect(isValidISODateString("2023-01-01T10:00:00.123Z")).toBe(true);
    });

    test("should return false for invalid date strings", () => {
      expect(isValidISODateString("")).toBe(false);
      expect(isValidISODateString("invalid")).toBe(false);
      expect(isValidISODateString("2023-01-01")).toBe(false); // Missing time part
      expect(isValidISODateString("10:00:00")).toBe(false); // Missing date part
    });
  });

  describe("validateISODateString", () => {
    test("should not throw for valid ISO 8601 date strings", () => {
      expect(() =>
        validateISODateString("2023-01-01T10:00:00Z", "testField"),
      ).not.toThrow();
    });

    test("should throw for invalid date strings", () => {
      expect(() => validateISODateString("invalid", "testField")).toThrow(
        "testField must be a valid ISO 8601 format",
      );
    });
  });

  describe("isValidProjectReference", () => {
    test("should return true for valid project references", () => {
      expect(isValidProjectReference("/projects/123")).toBe(true);
      expect(isValidProjectReference("/projects/456789")).toBe(true);
    });

    test("should return false for invalid project references", () => {
      expect(isValidProjectReference("")).toBe(false);
      expect(isValidProjectReference("projects/123")).toBe(false); // Missing leading slash
      expect(isValidProjectReference("/project/123")).toBe(false); // Incorrect path
      expect(isValidProjectReference("/projects/")).toBe(false); // Missing ID
      expect(isValidProjectReference("/projects/abc")).toBe(false); // Non-numeric ID
    });
  });

  describe("validateProjectReference", () => {
    test("should not throw for valid project references", () => {
      expect(() => validateProjectReference("/projects/123")).not.toThrow();
    });

    test("should throw for invalid project references", () => {
      expect(() => validateProjectReference("invalid")).toThrow(
        "Invalid project reference format",
      );
    });
  });

  describe("validateCustomFields", () => {
    test("should not throw for valid custom fields", () => {
      const customFields = {
        client_id: "123",
        department: "Engineering",
        "priority-level": "High",
        task_number: "456",
      };

      expect(() => validateCustomFields(customFields)).not.toThrow();
    });

    test("should not throw for null values", () => {
      const customFields = {
        client_id: null,
      };

      expect(() => validateCustomFields(customFields)).not.toThrow();
    });

    test("should throw for invalid key format - special characters", () => {
      const customFields = {
        "client@id": "123",
      };

      expect(() => validateCustomFields(customFields)).toThrow(
        "contains invalid characters",
      );
    });

    test("should throw for key starting with underscore", () => {
      const customFields = {
        _client_id: "123",
      };

      expect(() => validateCustomFields(customFields)).toThrow(
        "cannot start with an underscore",
      );
    });

    test("should throw for key with only digits", () => {
      const customFields = {
        "12345": "123",
      };

      expect(() => validateCustomFields(customFields)).toThrow(
        "cannot contain only digits",
      );
    });
  });
});
