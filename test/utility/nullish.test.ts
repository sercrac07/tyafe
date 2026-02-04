import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.nullish(t.string());
const _input: Expect<
  T.Input<typeof _schema>,
  string | undefined | null
> = null as any;
const _output: Expect<
  T.Output<typeof _schema>,
  string | undefined | null
> = null as any;

describe("nullish schema", () => {
  it("should be defined", () => {
    expect(t.nullish).toBeDefined();
  });

  it("should parse", () => {
    expect(t.nullish(t.string()).parse()).toBe(undefined);
    expect(t.nullish(t.string()).parse("john")).toBe("john");
    expect(t.nullish(t.string()).parse(null)).toBe(null);
    expect(t.nullish(t.string()).parse(undefined)).toBe(undefined);
  });

  it("should not parse", () => {
    expect(() => t.nullish(t.string()).parse(1)).toThrow();
    expect(() => t.nullish(t.string()).parse(1n)).toThrow();
    expect(() => t.nullish(t.string()).parse(true)).toThrow();
  });
});
