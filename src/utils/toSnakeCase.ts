/**
 * Converts a given object to snake_case.
 */
export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        acc[snakeKey] = toSnakeCase(value);
        return acc;
      },
      {} as Record<string, any>,
    );
  } else {
    return obj;
  }
};
