type ObjectWithStringKeys = Record<string, unknown>;

const snakeToCamel = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
};

const camelToSnake = (str: string): string => {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
};

export const transformSnakeToCamel = <T extends ObjectWithStringKeys>(
  obj: T
): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformSnakeToCamel) as unknown as T;
  }

  const result: ObjectWithStringKeys = {};

  Object.keys(obj).forEach((key) => {
    const camelKey = snakeToCamel(key);
    const value = obj[key];

    if (value !== null && typeof value === "object") {
      result[camelKey] = transformSnakeToCamel(value as ObjectWithStringKeys);
    } else {
      result[camelKey] = value;
    }
  });

  return result as T;
};

export const transformCamelToSnake = <T extends ObjectWithStringKeys>(
  obj: T
): T => {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return obj;
  }

  const result: ObjectWithStringKeys = {};

  Object.keys(obj).forEach((key) => {
    const snakeKey = camelToSnake(key);
    const value = obj[key];

    if (value !== null && typeof value === "object") {
      result[snakeKey] = transformCamelToSnake(value as ObjectWithStringKeys);
    } else {
      result[snakeKey] = value;
    }
  });

  return result as T;
};
