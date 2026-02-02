import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.object({ name: t.string() });
const _input: Expect<T.Input<typeof _schema>, { name: string }> = null as any;
const _output: Expect<T.Output<typeof _schema>, { name: string }> = null as any;

describe("object schema", () => {
  it("should be defined", () => {
    expect(t.object).toBeDefined();
  });

  it("should parse", () => {
    expect(t.object({ name: t.string() }).parse({ name: "john" })).toEqual({
      name: "john",
    });
  });

  it("should not parse", () => {
    expect(() => t.object({ name: t.string() }).parse()).toThrow();
    expect(() => t.object({ name: t.string() }).parse("doe")).toThrow();
    expect(() => t.object({ name: t.string() }).parse(1)).toThrow();
    expect(() => t.object({ name: t.string() }).parse(1n)).toThrow();
    expect(() => t.object({ name: t.string() }).parse(true)).toThrow();
    expect(() => t.object({ name: t.string() }).parse(null)).toThrow();
    expect(() => t.object({ name: t.string() }).parse(undefined)).toThrow();
    expect(() => t.object({ name: t.string() }).parse({})).toThrow();
    expect(() => t.object({ name: t.string() }).parse({ name: 12 })).toThrow();
  });
});
