import { TyafeBase } from "../core/base";
import { deepCopy } from "../lib/copy";
import type { Input, Output } from "../types";

export class TyafeNullable<T extends TyafeBase<any, any>> extends TyafeBase<
  Input<T> | null,
  Output<T> | null
> {
  public override readonly kind: "optional" = "optional";
  public readonly schema: T;

  constructor(schema: T) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
    });

    this.schema = schema.clone() as T;
  }

  protected override parseFunction(input: unknown): Output<T> | null {
    if (input === null) {
      return null;
    }

    return this.schema.parse(input);
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<Output<T> | null> {
    if (input === null) {
      return null;
    }

    return await this.schema.parseAsync(input);
  }

  public override clone(): TyafeNullable<T> {
    const newThis = new TyafeNullable(this.schema);
    newThis._config = deepCopy(this._config);
    return newThis;
  }
}
