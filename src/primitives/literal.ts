import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import type { LiteralParts } from "../types";

export class TyafeLiteral<T extends LiteralParts> extends TyafeBase<
  T,
  T,
  { error: string }
> {
  public override readonly kind: "literal" = "literal";
  /**
   * Literal value enforced by this schema
   */
  public readonly value: T;

  constructor(value: T, error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || `Invalid input type: "${value}" was expected`,
    });
    this.value = value;
  }

  protected override parseFunction(input: unknown): T {
    if (input !== this.value) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return input as T;
  }
  protected override async parseFunctionAsync(input: unknown): Promise<T> {
    return this.parseFunction(input);
  }

  public override clone(): TyafeLiteral<T> {
    const newThis = new TyafeLiteral(this.value);
    newThis._config = deepCopy(this._config);
    return newThis;
  }
}
