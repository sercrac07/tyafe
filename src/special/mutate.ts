import { TyafeBase } from "../core/base";
import { TyafeError } from "../errors";
import { deepCopy } from "../lib/copy";
import type { Input, Mutator, Output } from "../types";

export class TyafeMutate<
  From extends TyafeBase<any, any>,
  To extends TyafeBase<any, any>,
> extends TyafeBase<Input<From>, Output<To>> {
  public override readonly kind: "mutate" = "mutate";
  public readonly from: From;
  public readonly to: To;
  public readonly mutator: Mutator<Output<From>, Input<To>>;

  constructor(from: From, to: To, mutator: Mutator<Output<From>, Input<To>>) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
    });

    this.from = from.clone() as From;
    this.to = to.clone() as To;
    this.mutator = mutator;
  }

  protected override parseFunction(input: unknown): Output<To> {
    const parsedFrom = this.from.parse(input);
    const transformed = this.mutator(parsedFrom);

    if (transformed instanceof Promise) {
      throw new TyafeError(
        "Async mutators must be parsed with an async parser",
      );
    }

    return this.to.parse(transformed);
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<Output<To>> {
    const parsedFrom = await this.from.parseAsync(input);
    const transformed = await this.mutator(parsedFrom);
    return await this.to.parseAsync(transformed);
  }

  public override clone(): TyafeMutate<From, To> {
    const newThis = new TyafeMutate(this.from, this.to, this.mutator);
    newThis._config = deepCopy(this._config);
    return newThis;
  }
}
