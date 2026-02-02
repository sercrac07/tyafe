export function deepCopy<T>(value: T): T {
  // Primitives
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }

  // Arrays
  if (Array.isArray(value)) {
    return value.map((v) => deepCopy(v)) as T;
  }

  // Dates
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (value instanceof File) {
    return new File([value], value.name, {
      lastModified: value.lastModified,
      type: value.type,
    }) as T;
  }

  // Objects
  const result = {} as T;
  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      result[key] = deepCopy(value[key]);
    }
  }
  return result;
}
