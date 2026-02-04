import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import type { Input, Issue, Output, ValidatorConfig } from "../types";

export class TyafeArray<T extends TyafeBase<any, any>> extends TyafeBase<
  Input<T>[],
  Output<T>[],
  { error: string }
> {
  public override readonly kind: "array" = "array";
  public readonly schema: T;

  constructor(schema: T, error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: array was expected",
    });
    this.schema = schema.clone() as T;
  }

  protected override parseFunction(input: unknown): Output<T>[] {
    if (typeof input !== "object" || !Array.isArray(input)) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    const result: Output<T>[] = [];
    const issues: Issue[] = [];

    for (let i = 0; i < input.length; i++) {
      const parsed = this.schema.safeParse(input[i]);

      if (parsed.success) {
        result.push(parsed.data);
      } else {
        issues.push(
          ...parsed.issues.map((issue) => ({
            ...issue,
            path: [i, ...issue.path],
          })),
        );
      }
    }

    if (issues.length > 0) {
      throw new TyafeIssue(issues);
    }

    return result;
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<Output<T>[]> {
    if (typeof input !== "object" || !Array.isArray(input)) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    const result: Output<T>[] = [];
    const issues: Issue[] = [];

    for (let i = 0; i < input.length; i++) {
      const parsed = await this.schema.safeParseAsync(input[i]);

      if (parsed.success) {
        result.push(parsed.data);
      } else {
        issues.push(
          ...parsed.issues.map((issue) => ({
            ...issue,
            path: [i, ...issue.path],
          })),
        );
      }
    }

    if (issues.length > 0) {
      throw new TyafeIssue(issues);
    }

    return result;
  }

  public override clone(): TyafeArray<T> {
    const newThis = new TyafeArray(this.schema);
    newThis._config = this.copyConfig();
    return newThis;
  }

  /**
   * Ensures array is non-empty.
   */
  public nonEmpty(config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.ARRAY.NON_EMPTY,
      "Array must not be empty",
      config,
    );

    this.validate((value) => (value.length === 0 ? issue : null));
    return this;
  }
  /**
   * Ensures array length is at least `length`.
   */
  public min(length: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.ARRAY.MIN,
      `Array must be at least ${length} items long`,
      config,
    );

    this.validate((value) => (value.length >= length ? null : issue));
    return this;
  }
  /**
   * Ensures array length is at most `length`.
   */
  public max(length: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.ARRAY.MAX,
      `Array must be at most ${length} items long`,
      config,
    );

    this.validate((value) => (value.length <= length ? null : issue));
    return this;
  }
}
