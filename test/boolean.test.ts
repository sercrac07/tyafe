import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.boolean();
const _input: Expect<T.Input<typeof _schema>, boolean> = null as any;
const _output: Expect<T.Output<typeof _schema>, boolean> = null as any;

describe("boolean schema", () => {
  it("should be defined", () => {
    expect(t.boolean).toBeDefined();
  });

  it("should parse", () => {
    expect(t.boolean().parse(true)).toBe(true);
    expect(t.boolean().parse(false)).toBe(false);
  });

  it("should not parse", () => {
    expect(() => t.boolean().parse()).toThrow();
    expect(() => t.boolean().parse("john")).toThrow();
    expect(() => t.boolean().parse(1)).toThrow();
    expect(() => t.boolean().parse(1n)).toThrow();
    expect(() => t.boolean().parse(null)).toThrow();
    expect(() => t.boolean().parse(undefined)).toThrow();
  });
});
