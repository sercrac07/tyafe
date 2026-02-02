import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import type { MaybePromise } from "../types";

export class TyafeSymbol extends TyafeBase<symbol, symbol, { error: string }> {
  public override readonly kind: "symbol" = "symbol";

  constructor(error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: symbol was expected",
    });
  }

  protected override parseFunction(input: unknown): MaybePromise<symbol> {
    if (typeof input !== "symbol") {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return input;
  }

  public override clone(): TyafeSymbol {
    const newThis = new TyafeSymbol();
    newThis._config = deepCopy(this._config);
    return newThis;
  }
}
