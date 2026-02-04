import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import type { Input, Issue, Output } from "../types";

export class TyafeObject<
  T extends Record<string, TyafeBase<any, any>>,
> extends TyafeBase<
  { [K in keyof T]: Input<T[K]> },
  { [K in keyof T]: Output<T[K]> },
  { error: string }
> {
  public override readonly kind: "object" = "object";
  /**
   * Object shape definition: maps each key to its corresponding schema type.
   */
  public readonly shape: T = {} as T;

  constructor(shape: T, error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: object was expected",
    });

    Object.keys(shape).forEach((key) => {
      const schema = shape[key];
      if (schema === undefined) return;

      this.shape[key as keyof T] = schema.clone() as T[keyof T];
    });
  }

  protected override parseFunction(input: unknown): {
    [K in keyof T]: Output<T[K]>;
  } {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    const result = {} as { [K in keyof T]: Output<T[K]> };
    const issues: Issue[] = [];

    for (const [key, schema] of Object.entries(this.shape)) {
      const parsed = schema.safeParse(input[key as keyof typeof input]);

      if (parsed.success) {
        result[key as keyof T] = parsed.data;
      } else {
        issues.push(
          ...parsed.issues.map((issue) => ({
            ...issue,
            path: [key, ...issue.path],
          })),
        );
      }
    }

    if (issues.length > 0) {
      throw new TyafeIssue(issues);
    }

    return result;
  }
  protected override async parseFunctionAsync(input: unknown): Promise<{
    [K in keyof T]: Output<T[K]>;
  }> {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    const result = {} as { [K in keyof T]: Output<T[K]> };
    const issues: Issue[] = [];

    for (const [key, schema] of Object.entries(this.shape)) {
      const parsed = await schema.safeParseAsync(
        input[key as keyof typeof input],
      );

      if (parsed.success) {
        result[key as keyof T] = parsed.data;
      } else {
        issues.push(
          ...parsed.issues.map((issue) => ({
            ...issue,
            path: [key, ...issue.path],
          })),
        );
      }
    }

    if (issues.length > 0) {
      throw new TyafeIssue(issues);
    }

    return result;
  }

  public override clone(): TyafeObject<T> {
    const newThis = new TyafeObject(this.shape);
    newThis._config = this.copyConfig();
    return newThis;
  }
}
