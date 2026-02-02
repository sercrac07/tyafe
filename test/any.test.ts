import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.any();
const _input: Expect<T.Input<typeof _schema>, any> = null as any;
const _output: Expect<T.Output<typeof _schema>, any> = null as any;

describe("any schema", () => {
  it("should be defined", () => {
    expect(t.any).toBeDefined();
  });

  it("should parse", () => {
    expect(t.any().parse()).toBe(undefined);
    expect(t.any().parse("john")).toBe("john");
    expect(t.any().parse(1)).toBe(1);
    expect(t.any().parse(1n)).toBe(1n);
    expect(t.any().parse(true)).toBe(true);
    expect(t.any().parse(null)).toBe(null);
    expect(t.any().parse(undefined)).toBe(undefined);
    expect(t.any().parse({})).toEqual({});
    expect(t.any().parse([])).toEqual([]);
  });
});
