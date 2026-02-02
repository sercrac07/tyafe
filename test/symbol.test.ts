import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.symbol();
const _input: Expect<T.Input<typeof _schema>, symbol> = null as any;
const _output: Expect<T.Output<typeof _schema>, symbol> = null as any;

describe("symbol schema", () => {
  it("should be defined", () => {
    expect(t.symbol).toBeDefined();
  });

  const data = Symbol();

  it("should parse", () => {
    expect(t.symbol().parse(data)).toBe(data);
  });

  it("should not parse", () => {
    expect(() => t.symbol().parse()).toThrow();
    expect(() => t.symbol().parse("john")).toThrow();
    expect(() => t.symbol().parse(1)).toThrow();
    expect(() => t.symbol().parse(1n)).toThrow();
    expect(() => t.symbol().parse(true)).toThrow();
    expect(() => t.symbol().parse(null)).toThrow();
    expect(() => t.symbol().parse(undefined)).toThrow();
  });
});
