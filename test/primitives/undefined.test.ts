import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.undefined();
const _input: Expect<T.Input<typeof _schema>, undefined> = null as any;
const _output: Expect<T.Output<typeof _schema>, undefined> = null as any;

describe("undefined schema", () => {
  it("should be defined", () => {
    expect(t.undefined).toBeDefined();
  });

  it("should parse", () => {
    expect(t.undefined().parse(undefined)).toBe(undefined);
  });

  it("should not parse", () => {
    expect(() => t.undefined().parse("john")).toThrow();
    expect(() => t.undefined().parse(1)).toThrow();
    expect(() => t.undefined().parse(1n)).toThrow();
    expect(() => t.undefined().parse(true)).toThrow();
    expect(() => t.undefined().parse(null)).toThrow();
  });
});
