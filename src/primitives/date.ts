import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import type { MaybePromise, ValidatorConfig } from "../types";

export class TyafeDate extends TyafeBase<Date, Date, { error: string }> {
  public override readonly kind: "date" = "date";

  constructor(error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: date was expected",
    });
  }

  protected override parseFunction(input: unknown): MaybePromise<Date> {
    if (!(input instanceof Date) || Number.isNaN(input.getTime())) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return input;
  }

  public override clone(): TyafeDate {
    const newThis = new TyafeDate();
    newThis._config = deepCopy(this._config);
    return newThis;
  }

  /**
   * Ensures date is greater than or equal to `value`
   */
  public min(date: Date, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.DATE.MIN,
      `Date must be after ${date.toDateString()}`,
      config,
    );

    this.validate((value) =>
      value.getTime() >= date.getTime() ? null : issue,
    );
    return this;
  }
  /**
   * Ensures date is less than or equal to `value`.
   */
  public max(date: Date, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.DATE.MAX,
      `Date must be before ${date.toDateString()}`,
      config,
    );

    this.validate((value) =>
      value.getTime() <= date.getTime() ? null : issue,
    );
    return this;
  }
}
