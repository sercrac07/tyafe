import { ERROR_CODES } from "../constants";
import { TyafeError, TyafeIssue } from "../errors";
import type {
  Default,
  Issue,
  MaybePromise,
  Preprocessor,
  Processor,
  Result,
  TyafeBaseConfig,
  Validator,
} from "../types";

export abstract class TyafeBase<
  I,
  O,
  // biome-ignore lint/complexity/noBannedTypes: This references an empty object
  ExtraConfig extends Record<string, unknown> = {},
> {
  /**
   * Unique identifier for the schema used internally for discrimination and debugging.
   */
  public abstract readonly kind: string;

  /**
   * Schema configuration
   */
  protected _config: TyafeBaseConfig<I, O, ExtraConfig>;

  constructor(config: TyafeBaseConfig<I, O, ExtraConfig>) {
    this._config = config;
  }

  /**
   * Function that contains all the main logic and asserts that the input type is the wanted one.
   */
  protected abstract parseFunction(input: unknown): O;
  /**
   * Function that contains all the main asynchronous logic and asserts that the input type is the wanted one.
   */
  protected abstract parseFunctionAsync(input: unknown): Promise<O>;

  /**
   * Parses the input and returns the output type.
   * Throws `TyafeIssue` if any validator fails.
   *
   * Note: Using async validators/processors will throw `TyafeError`.
   * Use `parseAsync` when async behavior is required.
   */
  public parse(input?: unknown): O {
    try {
      if (input === undefined && this._config.default !== undefined) {
        return this.runDefault();
      }

      const preprocessed = this.runPreprocessors(this.deepCopy(input));

      const result = this.parseFunction(preprocessed);

      const issues = this.runValidators(result);
      if (issues.length > 0) {
        throw new TyafeIssue(issues);
      }

      const processed = this.runProcessors(result);
      return processed;
    } catch (error) {
      if (error instanceof TyafeIssue && this._config.fallback !== undefined) {
        return this.runFallback();
      }
      throw error;
    }
  }
  /**
   * Asynchronously parses the input and returns the output type.
   * Throws `TyafeIssue` if any validator fails.
   */
  public async parseAsync(input?: unknown): Promise<O> {
    try {
      if (input === undefined && this._config.default !== undefined) {
        return await this.runDefaultAsync();
      }

      const preprocessed = await this.runPreprocessorsAsync(
        this.deepCopy(input),
      );

      const result = await this.parseFunctionAsync(preprocessed);

      const issues = await this.runValidatorsAsync(result);
      if (issues.length > 0) {
        throw new TyafeIssue(issues);
      }

      const processed = await this.runProcessorsAsync(result);
      return processed;
    } catch (error) {
      if (error instanceof TyafeIssue && this._config.fallback !== undefined) {
        return await this.runFallbackAsync();
      }
      throw error;
    }
  }

  /**
   * Safely parses the input and returns a `Result` instead of throwing.
   * Wraps `parse` in a try-catch block.
   *
   * Note: Using async validators/processors will throw `TyafeError`.
   * Use `safeParseAsync` when async behavior is required.
   */
  public safeParse(input?: unknown): Result<O> {
    try {
      const data = this.parse(input);
      return { success: true, data };
    } catch (error) {
      if (error instanceof TyafeIssue) {
        return { success: false, issues: error.issues };
      }
      throw error;
    }
  }
  /**
   * Asynchronously and safely parses the input and returns a `Result` instead of throwing.
   * Wraps `parseAsync` in a try-catch block.
   */
  public async safeParseAsync(input?: unknown): Promise<Result<O>> {
    try {
      const data = await this.parseAsync(input);
      return { success: true, data };
    } catch (error) {
      if (error instanceof TyafeIssue) {
        return { success: false, issues: error.issues };
      }
      throw error;
    }
  }

  /**
   * Appends a validator function to the schema.
   * Validator receives the output-typed value and returns `undefined` when valid or an error string/partial `Issue` when invalid.
   *
   * @example
   *
   * ```ts
   * const schema = t.string()
   *   .validate(value => value.length > 0 ? undefined : "String is empty")
   *   .validate(value => value.length <= 10 ? undefined : { code: "string.tooLong", error: "String must be at most 10 characters long", path: [] });
   * ```
   */
  public validate(validator: Validator<O>): this {
    this._config.validators.push(validator);
    return this;
  }
  /**
   * Appends a processor function to the schema.
   * Processor receives the output-typed value and returns the transformed value of the same type.
   *
   * @example
   *
   * ```ts
   * const schema = t.string().process(value => value.toUpperCase());
   * ```
   */
  public process(processor: Processor<O>): this {
    this._config.processors.push(processor);
    return this;
  }
  /**
   * Appends a preprocessor function to the schema.
   * Preprocessor receives the raw input value and returns the input-typed value.
   *
   * By default, the given value will be typed as `unknown` but you can override it by specifying the input type.
   *
   * @example
   *
   * ```ts
   * const schema = t.string()
   *   .preprocess(value => String(value))
   *   .preprocess<string>(value => value.trim());
   * ```
   */
  public preprocess<T = unknown>(preprocessor: Preprocessor<T, I>): this {
    this._config.preprocessors.push(preprocessor);
    return this;
  }
  /**
   * Configures a default value that will be used when the input is undefined.
   * The default can be supplied either as a static value or as a function that will be invoked lazily (only when needed) to produce the value at runtime.
   *
   * @example
   *
   * ```ts
   * const schema = t.string().default("default value");
   * // or
   * const schema = t.string().default(() => "default value");
   * ```
   */
  public default(value: Default<O>): this {
    this._config.default = value;
    return this;
  }
  /**
   * Configures a default value that will be used when the parsing fails.
   * The fallback can be supplied either as a static value or as a function that will be invoked lazily (only when needed) to produce the value at runtime.
   *
   * @example
   *
   * ```ts
   * const schema = t.string().fallback("fallback value");
   * // or
   * const schema = t.string().fallback(() => "fallback value");
   * ```
   */
  public fallback(value: Default<O>): this {
    this._config.fallback = value;
    return this;
  }

  /**
   * Deeply clones the schema, including configuration and pipelines (validators, processors, preprocessors, defaults and fallbacks).
   */
  public abstract clone(): TyafeBase<I, O, ExtraConfig>;

  protected buildIssue(
    code: string,
    error: string,
    replacer?: string | Partial<Issue>,
  ): Issue {
    const c = typeof replacer === "string" ? code : replacer?.code || code;
    const e =
      typeof replacer === "string" ? replacer : replacer?.error || error;
    const p = typeof replacer === "string" ? [] : replacer?.path || [];

    return { code: c, error: e, path: p };
  }
  protected deepCopy<T>(value: T): T {
    // Primitives
    if (value === null || typeof value !== "object") {
      return value;
    }

    // Dates
    if (value instanceof Date) {
      return new Date(value.getTime()) as T;
    }

    // Files
    if (value instanceof File) {
      return new File([value], value.name, {
        lastModified: value.lastModified,
        type: value.type,
      }) as T;
    }

    // Empty array
    if (Array.isArray(value) && value.length === 0) {
      return [] as T;
    }

    // Empty object
    if (!Array.isArray(value) && Object.keys(value).length === 0) {
      return {} as T;
    }

    // Array
    if (Array.isArray(value)) {
      return value.map((v) => this.deepCopy(v)) as T;
    }

    // Objects
    return Object.fromEntries(
      Object.keys(value).map((key) => [
        key,
        this.deepCopy(value[key as keyof typeof value]),
      ]),
    ) as T;
  }
  protected copyConfig(): TyafeBaseConfig<I, O, ExtraConfig> {
    return this.deepCopy(this._config);
  }

  protected runValidators(input: O): Issue[] {
    const issues: Issue[] = [];

    for (const validator of this._config.validators) {
      const result = validator(input);

      if (result instanceof Promise) {
        throw new TyafeError(
          "Async validator must be parsed with an async parser",
        );
      }

      if (result) {
        issues.push(
          this.buildIssue(
            ERROR_CODES.CORE.VALIDATOR_ERROR,
            "Validator failed",
            result,
          ),
        );
      }
    }

    return issues;
  }
  protected async runValidatorsAsync(input: O): Promise<Issue[]> {
    const issues: Issue[] = [];

    for (const validator of this._config.validators) {
      const result = await validator(input);

      if (result) {
        issues.push(
          this.buildIssue(
            ERROR_CODES.CORE.VALIDATOR_ERROR,
            "Validator failed",
            result,
          ),
        );
      }
    }

    return issues;
  }
  protected runProcessors(input: O): O {
    let processed = input;

    for (const processor of this._config.processors) {
      const value = processor(processed);

      if (value instanceof Promise) {
        throw new TyafeError(
          "Async processor must be parsed with an async parser",
        );
      }

      processed = value;
    }

    return processed;
  }
  protected async runProcessorsAsync(input: O): Promise<O> {
    let processed = input;

    for (const processor of this._config.processors) {
      const value = await processor(processed);
      processed = value;
    }

    return processed;
  }
  protected runPreprocessors(input: unknown): unknown {
    let preprocessed = input;

    for (const preprocessor of this._config.preprocessors) {
      const value = preprocessor(preprocessed);

      if (value instanceof Promise) {
        throw new TyafeError(
          "Async preprocessor must be parsed with an async parser",
        );
      }

      preprocessed = value;
    }

    return preprocessed;
  }
  protected async runPreprocessorsAsync(input: unknown): Promise<unknown> {
    let preprocessed = input;

    for (const preprocessor of this._config.preprocessors) {
      const value = await preprocessor(preprocessed);
      preprocessed = value;
    }

    return preprocessed;
  }
  protected runDefault(): O {
    if (typeof this._config.default === "function") {
      const value = (this._config.default as () => MaybePromise<O>)();

      if (value instanceof Promise) {
        throw new TyafeError(
          "Async default value must be parsed with an async parser",
        );
      }

      return this.deepCopy(value);
    }

    return this.deepCopy(this._config.default) as O;
  }
  protected async runDefaultAsync(): Promise<O> {
    if (typeof this._config.default === "function") {
      const value = await (this._config.default as () => MaybePromise<O>)();
      return this.deepCopy(value);
    }

    return this.deepCopy(this._config.default) as O;
  }
  protected runFallback(): O {
    if (typeof this._config.fallback === "function") {
      const value = (this._config.fallback as () => MaybePromise<O>)();

      if (value instanceof Promise) {
        throw new TyafeError(
          "Async default value must be parsed with an async parser",
        );
      }

      return this.deepCopy(value);
    }

    return this.deepCopy(this._config.fallback) as O;
  }
  protected async runFallbackAsync(): Promise<O> {
    if (typeof this._config.fallback === "function") {
      const value = await (this._config.fallback as () => MaybePromise<O>)();
      return this.deepCopy(value);
    }

    return this.deepCopy(this._config.fallback) as O;
  }
}
