import type { TyafeBase } from "./core/base";

/**
 * Infers the input type of the given schema.
 */
export type Input<T extends TyafeBase<any, any>> =
  T extends TyafeBase<infer I, any, any> ? I : never;
/**
 * Infers the output type of the given schema.
 */
export type Output<T extends TyafeBase<any, any>> =
  T extends TyafeBase<any, infer O, any> ? O : never;

/**
 * Result of a safe parse execution.
 */
export type Result<O> = Success<O> | Fail;
/**
 * Successful parse result holding the parsed data.
 */
export type Success<O> = { success: true; data: O };
/**
 * Failed parse result holding a list of issues.
 */
export type Fail = { success: false; issues: Issue[] };

/**
 * A single validation issue reported by a schema.
 */
export type Issue = {
  /**
   * Machine-readable error code.
   */
  code: string;
  /**
   * Human-readable error message.
   */
  error: string;
  /**
   * Path segments to the offending value.
   */
  path: Array<string | number>;
};

/**
 * Default value or lazy factory used by `.default()`/`.fallback()`.
 */
export type Default<O> = O | (() => MaybePromise<O>);
/**
 * Validator function that checks an output-typed value.
 * Returns `undefined`/`null` when valid, or a string/partial `Issue` when invalid.
 */
export type Validator<O> = (
  value: O,
) => MaybePromise<string | Partial<Issue> | undefined | null>;
/**
 * Processor function that transforms an output-typed value and returns the new value with the same type.
 */
export type Processor<O> = (value: O) => MaybePromise<O>;
export type Preprocessor<T, I> = (value: T) => MaybePromise<I>;

export type TyafeBaseConfig<
  I,
  O,
  ExtraConfig extends Record<string, unknown>,
> = {
  default: Default<O> | undefined;
  fallback: Default<O> | undefined;
  validators: Validator<O>[];
  processors: Processor<O>[];
  preprocessors: Preprocessor<any, I>[];
} & ExtraConfig;

// biome-ignore lint/complexity/noBannedTypes: This references an empty object
export type ValidatorConfig<ExtraConfig extends Record<string, unknown> = {}> =
  Partial<Omit<Issue, "path">> & ExtraConfig;

/**
 * Utility type representing a value or a promise of a value.
 */
export type MaybePromise<T> = T | Promise<T>;
