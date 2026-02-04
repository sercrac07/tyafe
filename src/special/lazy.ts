import { TyafeBase } from "../core/base";
import type { Input, Output } from "../types";

export class TyafeLazy<T extends TyafeBase<any, any>> extends TyafeBase<
  Input<T>,
  Output<T>
> {
  public override readonly kind: "lazy" = "lazy";
  public readonly schema: () => T;

  constructor(schema: () => T) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
    });

    this.schema = () => schema().clone() as T;
  }

  protected override parseFunction(input: unknown): Output<T> {
    return this.schema().parse(input);
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<Output<T>> {
    return await this.schema().parseAsync(input);
  }

  public override clone(): TyafeLazy<T> {
    const newThis = new TyafeLazy(this.schema);
    newThis._config = this.copyConfig();
    return newThis;
  }
}
