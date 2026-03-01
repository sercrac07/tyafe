import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";

export class TyafeEnum<T extends Array<string | number>> extends TyafeBase<
  T[number],
  T[number],
  { error: string }
> {
  public override readonly kind: "enum" = "enum";
  /**
   * Array of valid values.
   */
  public readonly values: [...T];

  constructor(values: [...T], error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error:
        error ||
        `Invalid input type: value must be one of: ${values.join(", ")}`,
    });
    this.values = [...values];
  }

  protected override parseFunction(input: unknown): T[number] {
    if (!this.values.includes(input as T[number])) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return input as T[number];
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<T[number]> {
    return this.parseFunction(input);
  }

  public override clone(): TyafeEnum<T> {
    const newThis = new TyafeEnum(this.values);
    newThis._config = this.copyConfig();
    return newThis;
  }
}
