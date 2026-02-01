import { ERROR_CODES, REGEXES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import type { ValidatorConfig } from "../types";

export class TyafeString extends TyafeBase<string, string, { error: string }> {
  public override readonly kind: "string" = "string";

  constructor(error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: string was expected",
    });
  }

  protected override parseFunction(input: unknown): string {
    if (typeof input !== "string") {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return input;
  }

  public override clone(): TyafeString {
    const newThis = new TyafeString();
    newThis._config = deepCopy(this._config);
    return newThis;
  }

  /**
   * Ensures string is nom-empty.
   * The string is considered empty if it is an empty string or only contains whitespace characters.
   */
  public nonEmpty(config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.STRING.NON_EMPTY,
      "String must not be empty",
      config,
    );

    this.validate((value) => (value.trim().length === 0 ? issue : null));
    return this;
  }
  /**
   * Ensures string length is at least `length`.
   */
  public min(length: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.STRING.MIN,
      `String must be at least ${length} characters long`,
      config,
    );

    this.validate((value) => (value.length < length ? issue : null));
    return this;
  }
  /**
   * Ensures string length is at most `length`.
   */
  public max(length: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.STRING.MAX,
      `String must be at most ${length} characters long`,
      config,
    );

    this.validate((value) => (value.length > length ? issue : null));
    return this;
  }
  /**
   * Ensures string matches the provided regex pattern.
   */
  public regex(pattern: RegExp, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.STRING.REGEX,
      `String must match regex pattern`,
      config,
    );

    this.validate((value) => (pattern.test(value) ? null : issue));
    return this;
  }
  /**
   * Ensures string is a valid email address.
   */
  public email(config?: string | ValidatorConfig<{ pattern?: RegExp }>): this {
    const issue = this.buildIssue(
      ERROR_CODES.STRING.EMAIL,
      "String must be a valid email address",
      config,
    );
    const pattern =
      typeof config === "string"
        ? REGEXES.EMAIL
        : config?.pattern || REGEXES.EMAIL;

    return this.regex(pattern, issue);
  }
  /**
   * Ensures string is a valid URL.
   */
  public url(config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.STRING.URL,
      "String must be a valid URL",
      config,
    );

    this.validate((value) => {
      try {
        new URL(value);
        return null;
      } catch (_error) {
        return issue;
      }
    });
    return this;
  }
}
