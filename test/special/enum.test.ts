import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.enum(["john", 12]);
const _input: Expect<T.Input<typeof _schema>, "john" | 12> = null as any;
const _output: Expect<T.Output<typeof _schema>, "john" | 12> = null as any;

describe("enum schema", () => {
  it("should be defined", () => {
    expect(t.enum).toBeDefined();
  });

  it("should parse", () => {
    expect(t.enum(["john", 12]).parse("john")).toBe("john");
    expect(t.enum(["john", 12]).parse(12)).toBe(12);

    expect(t.enum(["john", 12]).values).toEqual(["john", 12]);
  });

  it("should not parse", () => {
    expect(() => t.enum(["john", 12]).parse()).toThrow();
    expect(() => t.enum(["john", 12]).parse("doe")).toThrow();
    expect(() => t.enum(["john", 12]).parse(1)).toThrow();
    expect(() => t.enum(["john", 12]).parse(1n)).toThrow();
    expect(() => t.enum(["john", 12]).parse(true)).toThrow();
    expect(() => t.enum(["john", 12]).parse(null)).toThrow();
    expect(() => t.enum(["john", 12]).parse(undefined)).toThrow();
  });
});
