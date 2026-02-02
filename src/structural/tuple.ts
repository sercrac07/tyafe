import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import type { Input, Issue, Output } from "../types";

export class TyafeTuple<T extends TyafeBase<any, any>[]> extends TyafeBase<
  { [K in keyof T]: Input<T[K]> },
  { [K in keyof T]: Output<T[K]> },
  { error: string }
> {
  public override readonly kind: "tuple" = "tuple";
  public readonly schemas: [...T];

  constructor(schemas: [...T], error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: tuple was expected",
    });

    this.schemas = schemas.map((schema) => schema.clone()) as [...T];
  }

  protected override parseFunction(input: unknown): {
    [K in keyof T]: Output<T[K]>;
  } {
    if (
      typeof input !== "object" ||
      !Array.isArray(input) ||
      input.length !== this.schemas.length
    ) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    const result: Output<T[number]>[] = [];
    const issues: Issue[] = [];

    for (let i = 0; i < this.schemas.length; i++) {
      const schema = this.schemas[i];
      const parsed = schema.safeParse(input[i]);

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

    return deepCopy(result) as { [K in keyof T]: Output<T[K]> };
  }
  protected override async parseFunctionAsync(input: unknown): Promise<{
    [K in keyof T]: Output<T[K]>;
  }> {
    if (
      typeof input !== "object" ||
      !Array.isArray(input) ||
      input.length !== this.schemas.length
    ) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    const result: Output<T[number]>[] = [];
    const issues: Issue[] = [];

    for (let i = 0; i < this.schemas.length; i++) {
      const schema = this.schemas[i];
      const parsed = await schema.safeParseAsync(input[i]);

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

    return deepCopy(result) as { [K in keyof T]: Output<T[K]> };
  }

  public override clone(): TyafeTuple<T> {
    const newThis = new TyafeTuple(this.schemas);
    newThis._config = deepCopy(this._config);
    return newThis;
  }
}
