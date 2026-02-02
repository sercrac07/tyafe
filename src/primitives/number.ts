import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
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
    newThis._config = deepCopy(this._config);
    return newThis;
  }

  /**
   * Ensures number is greater than or equal to `value`.
   */
  public min(minValue: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.NUMBER.MIN,
      `Number must be at least ${minValue}`,
      config,
    );

    this.validate((value) => (value >= minValue ? null : issue));
    return this;
  }
  /**
   * Ensures number is less than or equal to `value`.
   */
  public max(maxValue: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.NUMBER.MAX,
      `Number must be at most ${maxValue}`,
      config,
    );

    this.validate((value) => (value <= maxValue ? null : issue));
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
}
