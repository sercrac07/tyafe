import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.union([t.string(), t.number()]);
const _input: Expect<T.Input<typeof _schema>, string | number> = null as any;
const _output: Expect<T.Output<typeof _schema>, string | number> = null as any;

describe("union schema", () => {
  it("should be defined", () => {
    expect(t.union).toBeDefined();
  });

  it("should parse", () => {
    expect(t.union([t.string(), t.number()]).parse("john")).toBe("john");
    expect(t.union([t.string(), t.number()]).parse(12)).toBe(12);
  });

  it("should not parse", () => {
    expect(() => t.union([t.string(), t.number()]).parse()).toThrow();
    expect(() => t.union([t.string(), t.number()]).parse(1n)).toThrow();
    expect(() => t.union([t.string(), t.number()]).parse(true)).toThrow();
    expect(() => t.union([t.string(), t.number()]).parse(null)).toThrow();
    expect(() => t.union([t.string(), t.number()]).parse(undefined)).toThrow();
  });
});
