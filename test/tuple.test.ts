import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.tuple([t.string(), t.number()]);
const _input: Expect<T.Input<typeof _schema>, [string, number]> = null as any;
const _output: Expect<T.Output<typeof _schema>, [string, number]> = null as any;

describe("tuple schema", () => {
  it("should be defined", () => {
    expect(t.tuple).toBeDefined();
  });

  it("should parse", () => {
    expect(t.tuple([t.string(), t.number()]).parse(["john", 12])).toEqual([
      "john",
      12,
    ]);
  });

  it("should not parse", () => {
    expect(() => t.tuple([t.string(), t.number()]).parse()).toThrow();
    expect(() => t.tuple([t.string(), t.number()]).parse("doe")).toThrow();
    expect(() => t.tuple([t.string(), t.number()]).parse(1)).toThrow();
    expect(() => t.tuple([t.string(), t.number()]).parse(1n)).toThrow();
    expect(() => t.tuple([t.string(), t.number()]).parse(true)).toThrow();
    expect(() => t.tuple([t.string(), t.number()]).parse(null)).toThrow();
    expect(() => t.tuple([t.string(), t.number()]).parse(undefined)).toThrow();
    expect(() => t.tuple([t.string(), t.number()]).parse(["john"])).toThrow();
    expect(() => t.tuple([t.string(), t.number()]).parse([12])).toThrow();
    expect(() =>
      t.tuple([t.string(), t.number()]).parse([12, "john"]),
    ).toThrow();
  });
});
