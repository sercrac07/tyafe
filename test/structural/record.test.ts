import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.record(t.string(), t.string());
const _input: Expect<
  T.Input<typeof _schema>,
  Record<string, string>
> = null as any;
const _output: Expect<
  T.Output<typeof _schema>,
  Record<string, string>
> = null as any;

describe("record schema", () => {
  it("should be defined", () => {
    expect(t.record).toBeDefined();
  });

  it("should parse", () => {
    expect(t.record(t.string(), t.string()).parse({ name: "john" })).toEqual({
      name: "john",
    });
  });

  it("should not parse", () => {
    expect(() => t.record(t.string(), t.string()).parse()).toThrow();
    expect(() => t.record(t.string(), t.string()).parse("doe")).toThrow();
    expect(() => t.record(t.string(), t.string()).parse(1)).toThrow();
    expect(() => t.record(t.string(), t.string()).parse(1n)).toThrow();
    expect(() => t.record(t.string(), t.string()).parse(true)).toThrow();
    expect(() => t.record(t.string(), t.string()).parse(null)).toThrow();
    expect(() => t.record(t.string(), t.string()).parse(undefined)).toThrow();
    expect(() =>
      t.record(t.string(), t.string()).parse({ name: 12 }),
    ).toThrow();
  });
});
