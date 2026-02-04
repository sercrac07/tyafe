import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";

export class TyafeNull extends TyafeBase<null, null, { error: string }> {
  public override readonly kind: "null" = "null";

  constructor(error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: null was expected",
    });
  }

  protected override parseFunction(input: unknown): null {
    if (input !== null) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return input;
  }
  protected override async parseFunctionAsync(input: unknown): Promise<null> {
    return this.parseFunction(input);
  }

  public override clone(): TyafeNull {
    const newThis = new TyafeNull();
    newThis._config = this.copyConfig();
    return newThis;
  }
}
