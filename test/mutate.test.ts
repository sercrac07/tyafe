import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.mutate(t.string(), t.number(), (value) => value.length);
const _input: Expect<T.Input<typeof _schema>, string> = null as any;
const _output: Expect<T.Output<typeof _schema>, number> = null as any;

describe("mutate schema", () => {
  it("should be defined", () => {
    expect(t.mutate).toBeDefined();
  });

  it("should parse", async () => {
    expect(
      t.mutate(t.string(), t.number(), (value) => value.length).parse("john"),
    ).toBe(4);

    expect(() =>
      t
        .mutate(t.string(), t.number(), async (value) => value.length)
        .parse("john"),
    ).toThrow();

    await expect(
      t
        .mutate(t.string(), t.number(), async (value) => value.length)
        .parseAsync("john"),
    ).resolves.toBe(4);
  });

  it("should not parse", () => {
    expect(() =>
      t.mutate(t.string(), t.number(), (value) => value.length).parse(),
    ).toThrow();
    expect(() =>
      t.mutate(t.string(), t.number(), (value) => value.length).parse(1),
    ).toThrow();
    expect(() =>
      t.mutate(t.string(), t.number(), (value) => value.length).parse(1n),
    ).toThrow();
    expect(() =>
      t.mutate(t.string(), t.number(), (value) => value.length).parse(true),
    ).toThrow();
    expect(() =>
      t.mutate(t.string(), t.number(), (value) => value.length).parse(null),
    ).toThrow();
    expect(() =>
      t
        .mutate(t.string(), t.number(), (value) => value.length)
        .parse(undefined),
    ).toThrow();
  });
});
