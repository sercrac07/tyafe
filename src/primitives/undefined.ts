import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import type { MaybePromise } from "../types";

export class TyafeUndefined extends TyafeBase<
  undefined,
  undefined,
  { error: string }
> {
  public override readonly kind: "undefined" = "undefined";

  constructor(error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: undefined was expected",
    });
  }

  protected override parseFunction(input: unknown): MaybePromise<undefined> {
    if (typeof input !== "undefined") {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return input;
  }

  public override clone(): TyafeUndefined {
    const newThis = new TyafeUndefined();
    newThis._config = deepCopy(this._config);
    return newThis;
  }
}
