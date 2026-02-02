import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.optional(t.string());
const _input: Expect<T.Input<typeof _schema>, string | undefined> = null as any;
const _output: Expect<
  T.Output<typeof _schema>,
  string | undefined
> = null as any;

describe("optional schema", () => {
  it("should be defined", () => {
    expect(t.optional).toBeDefined();
  });

  it("should parse", () => {
    expect(t.optional(t.string()).parse()).toBe(undefined);
    expect(t.optional(t.string()).parse("john")).toBe("john");
    expect(t.optional(t.string()).parse(undefined)).toBe(undefined);
  });

  it("should not parse", () => {
    expect(() => t.optional(t.string()).parse(1)).toThrow();
    expect(() => t.optional(t.string()).parse(1n)).toThrow();
    expect(() => t.optional(t.string()).parse(true)).toThrow();
    expect(() => t.optional(t.string()).parse(null)).toThrow();
  });
});
