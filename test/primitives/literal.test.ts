import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.literal("john");
const _input: Expect<T.Input<typeof _schema>, "john"> = null as any;
const _output: Expect<T.Output<typeof _schema>, "john"> = null as any;

describe("literal schema", () => {
  it("should be defined", () => {
    expect(t.literal).toBeDefined();
  });

  it("should parse", () => {
    expect(t.literal("john").parse("john")).toBe("john");
    expect(t.literal(12).parse(12)).toBe(12);
    expect(t.literal(12n).parse(12n)).toBe(12n);
    expect(t.literal(true).parse(true)).toBe(true);

    expect(t.literal("john").value).toBe("john");
  });

  it("should not parse", () => {
    expect(() => t.literal("john").parse()).toThrow();
    expect(() => t.literal("john").parse("doe")).toThrow();
    expect(() => t.literal("john").parse(1)).toThrow();
    expect(() => t.literal("john").parse(1n)).toThrow();
    expect(() => t.literal("john").parse(true)).toThrow();
    expect(() => t.literal("john").parse(null)).toThrow();
    expect(() => t.literal("john").parse(undefined)).toThrow();
  });
});
