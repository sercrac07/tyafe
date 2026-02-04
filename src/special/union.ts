import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import type { Input, Issue, Output } from "../types";

export class TyafeUnion<T extends TyafeBase<any, any>[]> extends TyafeBase<
  Input<T[number]>,
  Output<T[number]>
> {
  public override readonly kind: "union" = "union";
  /**
   * Array of candidate schemas evaluated until one succeds.
   */
  public readonly schemas: [...T];

  constructor(schemas: [...T]) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
    });

    this.schemas = schemas.map((schema) => schema.clone()) as [...T];
  }

  protected override parseFunction(input: unknown): Output<T[number]> {
    const issues: Issue[] = [];

    for (const schema of this.schemas) {
      const parsed = schema.safeParse(input);

      if (parsed.success) {
        return parsed.data;
      } else {
        issues.push(...parsed.issues);
      }
    }

    throw new TyafeIssue(issues);
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<Output<T[number]>> {
    const issues: Issue[] = [];

    for (const schema of this.schemas) {
      const parsed = await schema.safeParseAsync(input);

      if (parsed.success) {
        return parsed.data;
      } else {
        issues.push(...parsed.issues);
      }
    }

    throw new TyafeIssue(issues);
  }

  public override clone(): TyafeUnion<T> {
    const newThis = new TyafeUnion(this.schemas);
    newThis._config = this.copyConfig();
    return newThis;
  }
}
