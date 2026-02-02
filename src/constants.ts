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
    URL: "string.url",
  },
  NUMBER: {
    MIN: "number.min",
    MAX: "number.max",
    INTEGER: "number.integer",
    POSITIVE: "number.positive",
    NEGATIVE: "number.negative",
  },
  BIGINT: {
    MIN: "bigint.min",
    MAX: "bigint.max",
    POSITIVE: "bigint.positive",
    NEGATIVE: "bigint.negative",
  },
} as const;

export const REGEXES = {
  EMAIL:
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
} as const;
