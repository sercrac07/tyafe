import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import type { Input, Issue, Output } from "../types";

export class TyafeRecord<
  Key extends TyafeBase<string, string>,
  Value extends TyafeBase<any, any>,
> extends TyafeBase<
  Record<Input<Key>, Input<Value>>,
  Record<Output<Key>, Output<Value>>,
  { error: string }
> {
  public override readonly kind: "record" = "record";
  public readonly key: Key;
  public readonly value: Value;

  constructor(key: Key, value: Value, error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: record was expected",
    });

    this.key = key.clone() as Key;
    this.value = value.clone() as Value;
  }

  protected override parseFunction(
    input: unknown,
  ): Record<Output<Key>, Output<Value>> {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    const result = {} as Record<Output<Key>, Output<Value>>;
    const issues: Issue[] = [];

    for (const [key, value] of Object.entries(input)) {
      const parsedKey = this.key.safeParse(key);
      const parsedValue = this.value.safeParse(value);

      if (!parsedKey.success || !parsedValue.success) {
        if (!parsedKey.success) {
          issues.push(
            ...parsedKey.issues.map((issue) => ({
              ...issue,
              path: [key, ...issue.path],
            })),
          );
        }
        if (!parsedValue.success) {
          issues.push(
            ...parsedValue.issues.map((issue) => ({
              ...issue,
              path: [key, ...issue.path],
            })),
          );
        }
      } else {
        result[parsedKey.data as Output<Key>] = parsedValue.data;
      }
    }

    if (issues.length > 0) {
      throw new TyafeIssue(issues);
    }

    return deepCopy(result);
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<Record<Output<Key>, Output<Value>>> {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    const result = {} as Record<Output<Key>, Output<Value>>;
    const issues: Issue[] = [];

    for (const [key, value] of Object.entries(input)) {
      const parsedKey = await this.key.safeParseAsync(key);
      const parsedValue = await this.value.safeParseAsync(value);

      if (!parsedKey.success || !parsedValue.success) {
        if (!parsedKey.success) {
          issues.push(
            ...parsedKey.issues.map((issue) => ({
              ...issue,
              path: [key, ...issue.path],
            })),
          );
        }
        if (!parsedValue.success) {
          issues.push(
            ...parsedValue.issues.map((issue) => ({
              ...issue,
              path: [key, ...issue.path],
            })),
          );
        }
      } else {
        result[parsedKey.data as Output<Key>] = parsedValue.data;
      }
    }

    if (issues.length > 0) {
      throw new TyafeIssue(issues);
    }

    return deepCopy(result);
  }

  public override clone(): TyafeRecord<Key, Value> {
    const newThis = new TyafeRecord(this.key, this.value);
    newThis._config = deepCopy(this._config);
    return newThis;
  }
}
