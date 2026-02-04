import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";

export class TyafeBooleanish extends TyafeBase<
  string,
  boolean,
  { error: string }
> {
  public override kind: "booleanish" = "booleanish";
  /**
   * String values interpreted as `true`.
   */
  public readonly trueValues: Set<string>;
  /**
   * String values interpreted as `false`.
   */
  public readonly falseValues: Set<string>;

  constructor(trueValues: string[], falseValues: string[], error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: booleanish was expected",
    });

    this.trueValues = new Set(trueValues);
    this.falseValues = new Set(falseValues);
  }

  protected override parseFunction(input: unknown): boolean {
    if (typeof input !== "string") {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    if (this.trueValues.has(input)) {
      return true;
    } else if (this.falseValues.has(input)) {
      return false;
    } else {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<boolean> {
    return this.parseFunction(input);
  }

  public override clone(): TyafeBooleanish {
    const newThis = new TyafeBooleanish(
      Array.from(this.trueValues),
      Array.from(this.falseValues),
    );
    newThis._config = this.copyConfig();
    return newThis;
  }
}
