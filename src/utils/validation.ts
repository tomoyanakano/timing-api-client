/**
 * Check for the existence of required fields
 * @param obj Object to check
 * @param fields Array of required field names
 * @throws Error if any of the fields are missing
 */
export function validateRequiredFields(
  obj: Record<string, any>,
  fields: string[],
): void {
  const missingFields = fields.filter((field) => {
    const value = obj[field];
    return value === undefined || value === null || value === "";
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
}

/**
 * Check if a date string is a valid ISO 8601 format
 * @param dateStr Date string to check
 * @returns true if valid, false otherwise
 */
export function isValidISODateString(dateStr: string): boolean {
  if (!dateStr) return false;

  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && dateStr.includes("T");
  } catch (e) {
    return false;
  }
}

/**
 * Check if a date string is a valid ISO 8601 format and throw an error if not
 * @param dateStr Date string to check
 * @param fieldName Field name (for error message)
 * @throws Error if the date format is invalid
 */
export function validateISODateString(
  dateStr: string,
  fieldName: string,
): void {
  if (!isValidISODateString(dateStr)) {
    throw new Error(
      `${fieldName} must be a valid ISO 8601 format (e.g., '2023-01-01T00:00:00+00:00')`,
    );
  }
}

/**
 * Check the format of a project reference
 * @param projectRef Project reference string
 * @returns true if valid, false otherwise
 */
export function isValidProjectReference(projectRef: string): boolean {
  return typeof projectRef === "string" && /^\/projects\/\d+$/.test(projectRef);
}

/**
 * Check the format of a project reference and throw an error if invalid
 * @param projectRef Project reference string
 * @throws Error if the format is invalid
 */
export function validateProjectReference(projectRef: string): void {
  if (!isValidProjectReference(projectRef)) {
    throw new Error(
      `Invalid project reference format. Correct format: '/projects/{id}'`,
    );
  }
}

/**
 * Check custom field names and values
 * @param customFields Custom fields object
 * @throws Error if any custom field is invalid
 */
export function validateCustomFields(
  customFields?: Record<string, string | null>,
): void {
  if (!customFields) return;

  Object.entries(customFields).forEach(([key, value]) => {
    // Check key
    if (!key || typeof key !== "string") {
      throw new Error("Custom field key must be a non-empty string");
    }

    // Check key format (only alphanumeric, dash, underscore allowed)
    if (!/^[a-zA-Z0-9\-_]+$/.test(key)) {
      throw new Error(
        `Custom field key '${key}' contains invalid characters (only alphanumeric, dash, underscore allowed)`,
      );
    }

    // Check key doesn't start with underscore
    if (key.startsWith("_")) {
      throw new Error(
        `Custom field key '${key}' cannot start with an underscore`,
      );
    }

    // Check key isn't just digits
    if (/^\d+$/.test(key)) {
      throw new Error(`Custom field key '${key}' cannot contain only digits`);
    }

    // Check value is null or string
    if (value !== null && typeof value !== "string") {
      throw new Error(`Custom field '${key}' value must be null or a string`);
    }
  });
}
