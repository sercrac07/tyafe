import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.booleanish(["y"], ["n"]);
const _input: Expect<T.Input<typeof _schema>, string> = null as any;
const _output: Expect<T.Output<typeof _schema>, boolean> = null as any;

describe("booleanish schema", () => {
  it("should be defined", () => {
    expect(t.booleanish).toBeDefined();
  });

  it("should parse", () => {
    expect(t.booleanish(["y"], ["n"]).parse("y")).toBe(true);
    expect(t.booleanish(["y"], ["n"]).parse("n")).toBe(false);
  });

  it("should not parse", () => {
    expect(() => t.booleanish(["y"], ["n"]).parse()).toThrow();
    expect(() => t.booleanish(["y"], ["n"]).parse("john")).toThrow();
    expect(() => t.booleanish(["y"], ["n"]).parse(1)).toThrow();
    expect(() => t.booleanish(["y"], ["n"]).parse(1n)).toThrow();
    expect(() => t.booleanish(["y"], ["n"]).parse(true)).toThrow();
    expect(() => t.booleanish(["y"], ["n"]).parse(false)).toThrow();
    expect(() => t.booleanish(["y"], ["n"]).parse(null)).toThrow();
    expect(() => t.booleanish(["y"], ["n"]).parse(undefined)).toThrow();
  });
});
