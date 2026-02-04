export const ERROR_CODES = {
  CORE: {
    INVALID_TYPE: "invalid_type",
    VALIDATOR_ERROR: "validator_error",
  },
  STRING: {
    NON_EMPTY: "string.non_empty",
    MIN: "string.min",
    MAX: "string.max",
    REGEX: "string.regex",
    EMAIL: "string.email",
    URL: {
      BASE: "string.url",
      PROTOCOL: "string.url.protocol",
    },
    JSON: "string.json",
    UUID: "string.uuid",
  },
  NUMBER: {
    MIN: "number.min",
    MAX: "number.max",
    INTEGER: "number.integer",
    POSITIVE: "number.positive",
    NEGATIVE: "number.negative",
    SAFE_INTEGER: "number.safe_integer",
    STEP: "number.step",
  },
  BIGINT: {
    MIN: "bigint.min",
    MAX: "bigint.max",
    POSITIVE: "bigint.positive",
    NEGATIVE: "bigint.negative",
  },
  DATE: {
    MIN: "date.min",
    MAX: "date.max",
  },
  FILE: {
    MIN: "file.min",
    MAX: "file.max",
    MIME: "file.mime",
  },
  ARRAY: {
    NON_EMPTY: "array.non_empty",
    MIN: "array.min",
    MAX: "array.max",
  },
} as const;

export const REGEXES = {
  EMAIL:
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
  UUID: {
    V1: /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    V2: /^[0-9a-f]{8}-[0-9a-f]{4}-2[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    V3: /^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    V4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    V5: /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    ANY: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
} as const;
