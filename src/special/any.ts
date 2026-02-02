import { TyafeBase } from "../core/base";
import { deepCopy } from "../lib/copy";

export class TyafeAny extends TyafeBase<any, any> {
  public override readonly kind: "any" = "any";

  constructor() {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
    });
  }

  protected override parseFunction(input: unknown): any {
    return input;
  }
  protected override async parseFunctionAsync(input: unknown): Promise<any> {
    return this.parseFunction(input);
  }

  public override clone(): TyafeAny {
    const newThis = new TyafeAny();
    newThis._config = deepCopy(this._config);
    return newThis;
  }
}
