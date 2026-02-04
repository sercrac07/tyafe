import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import type { ValidatorConfig } from "../types";

export class TyafeNumber extends TyafeBase<number, number, { error: string }> {
  public override readonly kind: "number" = "number";

  constructor(error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: number was expected",
    });
  }

  protected override parseFunction(input: unknown): number {
    if (typeof input !== "number" || Number.isNaN(input)) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return input;
  }
  protected override async parseFunctionAsync(input: unknown): Promise<number> {
    return this.parseFunction(input);
  }

  public override clone(): TyafeNumber {
    const newThis = new TyafeNumber();
    newThis._config = this.copyConfig();
    return newThis;
  }

  /**
   * Ensures number is greater than or equal to `min`.
   */
  public min(min: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.NUMBER.MIN,
      `Number must be at least ${min}`,
      config,
    );

    this.validate((value) => (value >= min ? null : issue));
    return this;
  }
  /**
   * Ensures number is less than or equal to `max`.
   */
  public max(max: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.NUMBER.MAX,
      `Number must be at most ${max}`,
      config,
    );

    this.validate((value) => (value <= max ? null : issue));
    return this;
  }
  /**
   * Ensures number is an integer.
   */
  public integer(config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.NUMBER.INTEGER,
      "Number must be an integer",
      config,
    );

    this.validate((value) => (Number.isInteger(value) ? null : issue));
    return this;
  }
  /**
   * Ensures number is strictly greater than `0`.
   */
  public positive(config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.NUMBER.POSITIVE,
      "Number must be a positive number",
      config,
    );

    this.validate((value) => (value > 0 ? null : issue));
    return this;
  }
  /**
   * Ensures number is strictly less than `0`.
   */
  public negative(config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.NUMBER.NEGATIVE,
      "Number must be a negative number",
      config,
    );

    this.validate((value) => (value < 0 ? null : issue));
    return this;
  }
  /**
   * Ensures number is between the range of an safe integer (`Number.MIN_SAFE_INTEGER` - `Number.MAX_SAFE_INTEGER`).
   */
  public safeInteger(config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.NUMBER.SAFE_INTEGER,
      "Number must be in the range of an safe integer",
      config,
    );

    this.validate((value) =>
      value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER
        ? null
        : issue,
    );
    return this;
  }
  /**
   * Ensures number conforms to a step interval.
   */
  public step(stepSize: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.NUMBER.STEP,
      `Number must be a multiple of ${stepSize}`,
      config,
    );

    this.validate((value) => {
      // Handle floating-point precision with tolerance
      const tolerance =
        Number.EPSILON * Math.max(Math.abs(value), Math.abs(stepSize));
      const remainder = ((value % stepSize) + stepSize) % stepSize;
      return Math.abs(remainder) < tolerance ? null : issue;
    });
    return this;
  }
}
