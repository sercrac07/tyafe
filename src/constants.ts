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
} as const;

export const REGEXES = {
  EMAIL:
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
} as const;
