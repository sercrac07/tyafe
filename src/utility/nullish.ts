import { TyafeBase } from "../core/base";
import type { Input, Output } from "../types";

export class TyafeNullish<T extends TyafeBase<any, any>> extends TyafeBase<
  Input<T> | undefined | null,
  Output<T> | undefined | null
> {
  public override readonly kind: "nullish" = "nullish";
  /**
   * Wrapped schema whose input/output becomes `null | undefined`.
   */
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

  protected override parseFunction(
    input: unknown,
  ): Output<T> | undefined | null {
    if (input === undefined || input === null) {
      return input;
    }

    return this.schema.parse(input);
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<Output<T> | undefined | null> {
    if (input === undefined || input === null) {
      return input;
    }

    return await this.schema.parseAsync(input);
  }

  public override clone(): TyafeNullish<T> {
    const newThis = new TyafeNullish(this.schema);
    newThis._config = this.copyConfig();
    return newThis;
  }
}
