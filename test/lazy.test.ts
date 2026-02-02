import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.lazy(() => t.string());
const _input: Expect<T.Input<typeof _schema>, string> = null as any;
const _output: Expect<T.Output<typeof _schema>, string> = null as any;

describe("lazy schema", () => {
  it("should be defined", () => {
    expect(t.lazy).toBeDefined();
  });

  it("should parse", () => {
    expect(t.lazy(() => t.string()).parse("john")).toBe("john");
  });

  it("should not parse", () => {
    expect(() => t.lazy(() => t.string()).parse()).toThrow();
    expect(() => t.lazy(() => t.string()).parse(1)).toThrow();
    expect(() => t.lazy(() => t.string()).parse(1n)).toThrow();
    expect(() => t.lazy(() => t.string()).parse(true)).toThrow();
    expect(() => t.lazy(() => t.string()).parse(null)).toThrow();
    expect(() => t.lazy(() => t.string()).parse(undefined)).toThrow();
  });
});
