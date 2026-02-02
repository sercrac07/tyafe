import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.bigint();
const _input: Expect<T.Input<typeof _schema>, bigint> = null as any;
const _output: Expect<T.Output<typeof _schema>, bigint> = null as any;

describe("bigint schema", () => {
  it("should be defined", () => {
    expect(t.bigint).toBeDefined();
  });

  it("should parse", () => {
    expect(t.bigint().parse(12n)).toBe(12n);

    expect(t.bigint().min(12n).parse(12n)).toBe(12n);
    expect(t.bigint().max(12n).parse(12n)).toBe(12n);
    expect(t.bigint().positive().parse(12n)).toBe(12n);
    expect(t.bigint().negative().parse(-12n)).toBe(-12n);
  });

  it("should not parse", () => {
    expect(() => t.bigint().parse()).toThrow();
    expect(() => t.bigint().parse("john")).toThrow();
    expect(() => t.bigint().parse(1)).toThrow();
    expect(() => t.bigint().parse(true)).toThrow();
    expect(() => t.bigint().parse(null)).toThrow();
    expect(() => t.bigint().parse(undefined)).toThrow();

    expect(() => t.bigint().min(13n).parse(12n)).toThrow();
    expect(() => t.bigint().max(11n).parse(12n)).toThrow();
    expect(() => t.bigint().positive().parse(-12n)).toThrow();
    expect(() => t.bigint().negative().parse(12n)).toThrow();
  });
});
