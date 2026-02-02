import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import type { MaybePromise } from "../types";

export class TyafeBoolean extends TyafeBase<
  boolean,
  boolean,
  { error: string }
> {
  public override readonly kind: "boolean" = "boolean";

  constructor(error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: boolean was expected",
    });
  }

  protected override parseFunction(input: unknown): MaybePromise<boolean> {
    if (typeof input !== "boolean") {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return input;
  }

  public override clone(): TyafeBoolean {
    const newThis = new TyafeBoolean();
    newThis._config = deepCopy(this._config);
    return newThis;
  }
}
