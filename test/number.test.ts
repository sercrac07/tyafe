import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.number();
const _input: Expect<T.Input<typeof _schema>, number> = null as any;
const _output: Expect<T.Output<typeof _schema>, number> = null as any;

describe("number schema", () => {
  it("should be defined", () => {
    expect(t.number).toBeDefined();
  });

  it("should parse", () => {
    expect(t.number().parse(12)).toBe(12);

    expect(t.number().min(12).parse(12)).toBe(12);
    expect(t.number().max(12).parse(12)).toBe(12);
    expect(t.number().integer().parse(12)).toBe(12);
    expect(t.number().positive().parse(12)).toBe(12);
    expect(t.number().negative().parse(-12)).toBe(-12);
  });

  it("should not parse", () => {
    expect(() => t.number().parse()).toThrow();
    expect(() => t.number().parse("john")).toThrow();
    expect(() => t.number().parse(1n)).toThrow();
    expect(() => t.number().parse(true)).toThrow();
    expect(() => t.number().parse(null)).toThrow();
    expect(() => t.number().parse(undefined)).toThrow();

    expect(() => t.number().min(13).parse(12)).toThrow();
    expect(() => t.number().max(11).parse(12)).toThrow();
    expect(() => t.number().integer().parse(12.3)).toThrow();
    expect(() => t.number().positive().parse(-12)).toThrow();
    expect(() => t.number().negative().parse(12)).toThrow();
  });
});
