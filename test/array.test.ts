import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.array(t.string());
const _input: Expect<T.Input<typeof _schema>, string[]> = null as any;
const _output: Expect<T.Output<typeof _schema>, string[]> = null as any;

describe("array schema", () => {
  it("should be defined", () => {
    expect(t.array).toBeDefined();
  });

  it("should parse", () => {
    expect(t.array(t.string()).parse([])).toEqual([]);
    expect(t.array(t.string()).parse(["john"])).toEqual(["john"]);
    expect(t.array(t.string()).parse(["john", "doe"])).toEqual(["john", "doe"]);

    expect(t.array(t.string()).nonEmpty().parse(["john"])).toEqual(["john"]);
    expect(t.array(t.string()).min(1).parse(["john"])).toEqual(["john"]);
    expect(t.array(t.string()).max(1).parse(["john"])).toEqual(["john"]);
  });

  it("should not parse", () => {
    expect(() => t.array(t.string()).parse()).toThrow();
    expect(() => t.array(t.string()).parse("doe")).toThrow();
    expect(() => t.array(t.string()).parse(1)).toThrow();
    expect(() => t.array(t.string()).parse(1n)).toThrow();
    expect(() => t.array(t.string()).parse(true)).toThrow();
    expect(() => t.array(t.string()).parse(null)).toThrow();
    expect(() => t.array(t.string()).parse(undefined)).toThrow();
    expect(() => t.array(t.string()).parse([12])).toThrow();

    expect(() => t.array(t.string()).nonEmpty().parse([])).toThrow();
    expect(() => t.array(t.string()).min(2).parse(["john"])).toThrow();
    expect(() => t.array(t.string()).max(0).parse(["john"])).toThrow();
  });
});
