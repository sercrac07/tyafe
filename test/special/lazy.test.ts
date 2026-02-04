import { describe, expect, it } from "vitest";
import {
  type T,
  type TyafeArray,
  type TyafeLazy,
  type TyafeNumber,
  type TyafeObject,
  type TyafeOptional,
  type TyafeString,
  t,
} from "../../src";
import type { Expect } from "../utils";

const _schema = t.lazy(() => t.string());
const _input: Expect<T.Input<typeof _schema>, string> = null as any;
const _output: Expect<T.Output<typeof _schema>, string> = null as any;

describe("lazy schema", () => {
  it("should be defined", () => {
    expect(t.lazy).toBeDefined();
  });

  it("should parse", () => {
    expect(t.lazy(() => t.string()).parse("john")).toBe("john");
  });

  it("should not parse", () => {
    expect(() => t.lazy(() => t.string()).parse()).toThrow();
    expect(() => t.lazy(() => t.string()).parse(1)).toThrow();
    expect(() => t.lazy(() => t.string()).parse(1n)).toThrow();
    expect(() => t.lazy(() => t.string()).parse(true)).toThrow();
    expect(() => t.lazy(() => t.string()).parse(null)).toThrow();
    expect(() => t.lazy(() => t.string()).parse(undefined)).toThrow();
  });

  it("should handle direct circular references", () => {
    type Category = TyafeLazy<
      TyafeObject<{
        id: TyafeNumber;
        name: TyafeString;
        subcategories: TyafeOptional<TyafeArray<Category>>;
      }>
    >;

    const categorySchema: Category = t.lazy(() =>
      t.object({
        id: t.number(),
        name: t.string(),
        subcategories: t.optional(t.array(categorySchema)),
      }),
    );

    const categoryInput: T.Input<Category> = {
      id: 1,
      name: "Electronics",
      subcategories: [
        { id: 2, name: "Computers", subcategories: undefined },
        { id: 3, name: "Phones", subcategories: undefined },
      ],
    };

    expect(categorySchema.parse(categoryInput)).toBeDefined();
  });
});
