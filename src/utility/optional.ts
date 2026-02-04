import { TyafeBase } from "../core/base";
import type { Input, Output } from "../types";

export class TyafeOptional<T extends TyafeBase<any, any>> extends TyafeBase<
  Input<T> | undefined,
  Output<T> | undefined
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

  protected override parseFunction(input: unknown): Output<T> | undefined {
    if (input === undefined) {
      return undefined;
    }

    return this.schema.parse(input);
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<Output<T> | undefined> {
    if (input === undefined) {
      return undefined;
    }

    return await this.schema.parseAsync(input);
  }

  public override clone(): TyafeOptional<T> {
    const newThis = new TyafeOptional(this.schema);
    newThis._config = this.copyConfig();
    return newThis;
  }
}
