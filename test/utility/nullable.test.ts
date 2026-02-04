import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.nullable(t.string());
const _input: Expect<T.Input<typeof _schema>, string | null> = null as any;
const _output: Expect<T.Output<typeof _schema>, string | null> = null as any;

describe("nullable schema", () => {
  it("should be defined", () => {
    expect(t.nullable).toBeDefined();
  });

  it("should parse", () => {
    expect(t.nullable(t.string()).parse("john")).toBe("john");
    expect(t.nullable(t.string()).parse(null)).toBe(null);
  });

  it("should not parse", () => {
    expect(() => t.nullable(t.string()).parse()).toThrow();
    expect(() => t.nullable(t.string()).parse(1)).toThrow();
    expect(() => t.nullable(t.string()).parse(1n)).toThrow();
    expect(() => t.nullable(t.string()).parse(true)).toThrow();
    expect(() => t.nullable(t.string()).parse(undefined)).toThrow();
  });
});
