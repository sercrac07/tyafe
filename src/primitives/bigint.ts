import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import type { ValidatorConfig } from "../types";

export class TyafeBigint extends TyafeBase<bigint, bigint, { error: string }> {
  public override readonly kind: "bigint" = "bigint";

  constructor(error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: bigint was expected",
    });
  }

  protected override parseFunction(input: unknown): bigint {
    if (typeof input !== "bigint") {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return input;
  }
  protected override async parseFunctionAsync(input: unknown): Promise<bigint> {
    return this.parseFunction(input);
  }

  public override clone(): TyafeBigint {
    const newThis = new TyafeBigint();
    newThis._config = this.copyConfig();
    return newThis;
  }

  /**
   * Ensures bigint is greater than or equal to `min`.
   */
  public min(min: bigint, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.BIGINT.MIN,
      `Bigint must be at least ${min}`,
      config,
    );

    this.validate((value) => (value >= min ? null : issue));
    return this;
  }
  /**
   * Ensures bigint is less than or equal to `max`.
   */
  public max(max: bigint, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.BIGINT.MAX,
      `Bigint must be at most ${max}`,
      config,
    );

    this.validate((value) => (value <= max ? null : issue));
    return this;
  }
  /**
   * Ensures bigint is strictly greater than `0n`.
   */
  public positive(config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.BIGINT.POSITIVE,
      "Bigint must be a positive number",
      config,
    );

    this.validate((value) => (value > 0n ? null : issue));
    return this;
  }
  /**
   * Ensures bigint is strictly less than `0n`.
   */
  public negative(config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.BIGINT.NEGATIVE,
      "Bigint must be a negative number",
      config,
    );

    this.validate((value) => (value < 0n ? null : issue));
    return this;
  }
}
