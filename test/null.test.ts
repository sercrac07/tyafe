import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.null();
const _input: Expect<T.Input<typeof _schema>, null> = null as any;
const _output: Expect<T.Output<typeof _schema>, null> = null as any;

describe("null schema", () => {
  it("should be defined", () => {
    expect(t.null).toBeDefined();
  });

  it("should parse", () => {
    expect(t.null().parse(null)).toBe(null);
  });

  it("should not parse", () => {
    expect(() => t.null().parse()).toThrow();
    expect(() => t.null().parse("john")).toThrow();
    expect(() => t.null().parse(1)).toThrow();
    expect(() => t.null().parse(1n)).toThrow();
    expect(() => t.null().parse(true)).toThrow();
    expect(() => t.null().parse(undefined)).toThrow();
  });
});
