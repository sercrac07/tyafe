import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import type { InputIntersection, Issue, OutputIntersection } from "../types";

export class TyafeIntersection<
  T extends TyafeBase<any, any>[],
> extends TyafeBase<InputIntersection<T>, OutputIntersection<T>> {
  public override readonly kind: "intersection" = "intersection";
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

  protected override parseFunction(input: unknown): OutputIntersection<T> {
    const issues: Issue[] = [];
    let merged = {} as OutputIntersection<T>;
    let hasMerged = false;

    for (const schema of this.schemas) {
      const parsed = schema.safeParse(input);

      if (parsed.success) {
        if (
          typeof parsed.data === "object" &&
          parsed.data !== null &&
          !Array.isArray(parsed.data)
        ) {
          merged = hasMerged
            ? { ...(merged as object), ...parsed.data }
            : parsed.data;
          hasMerged = true;
        } else {
          merged = parsed.data;
          hasMerged = true;
        }
      } else {
        issues.push(...parsed.issues);
      }
    }

    if (issues.length > 0) {
      throw new TyafeIssue(issues);
    }

    return merged;
  }
  protected override async parseFunctionAsync(
    input: unknown,
  ): Promise<OutputIntersection<T>> {
    const issues: Issue[] = [];
    let merged = {} as OutputIntersection<T>;
    let hasMerged = false;

    for (const schema of this.schemas) {
      const parsed = await schema.safeParseAsync(input);

      if (parsed.success) {
        if (
          typeof parsed.data === "object" &&
          parsed.data !== null &&
          !Array.isArray(parsed.data)
        ) {
          merged = hasMerged
            ? { ...(merged as object), ...parsed.data }
            : parsed.data;
          hasMerged = true;
        } else {
          merged = parsed.data;
          hasMerged = true;
        }
      } else {
        issues.push(...parsed.issues);
      }
    }

    if (issues.length > 0) {
      throw new TyafeIssue(issues);
    }

    return merged;
  }

  public override clone(): TyafeIntersection<T> {
    const newThis = new TyafeIntersection(this.schemas);
    newThis._config = this.copyConfig();
    return newThis;
  }
}
