import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.intersection([
  t.union([t.string(), t.number()]),
  t.union([t.string(), t.boolean()]),
]);
const _input: Expect<T.Input<typeof _schema>, string> = null as any;
const _output: Expect<T.Output<typeof _schema>, string> = null as any;

describe("intersection schema", () => {
  it("should be defined", () => {
    expect(t.intersection).toBeDefined();
  });

  it("should parse", () => {
    expect(
      t
        .intersection([
          t.union([t.string(), t.number()]),
          t.union([t.string(), t.boolean()]),
        ])
        .parse("john"),
    ).toBe("john");
  });

  it("should not parse", () => {
    expect(() =>
      t
        .intersection([
          t.union([t.string(), t.number()]),
          t.union([t.string(), t.boolean()]),
        ])
        .parse(),
    ).toThrow();
    expect(() =>
      t
        .intersection([
          t.union([t.string(), t.number()]),
          t.union([t.string(), t.boolean()]),
        ])
        .parse(1),
    ).toThrow();
    expect(() =>
      t
        .intersection([
          t.union([t.string(), t.number()]),
          t.union([t.string(), t.boolean()]),
        ])
        .parse(1n),
    ).toThrow();
    expect(() =>
      t
        .intersection([
          t.union([t.string(), t.number()]),
          t.union([t.string(), t.boolean()]),
        ])
        .parse(true),
    ).toThrow();
    expect(() =>
      t
        .intersection([
          t.union([t.string(), t.number()]),
          t.union([t.string(), t.boolean()]),
        ])
        .parse(null),
    ).toThrow();
    expect(() =>
      t
        .intersection([
          t.union([t.string(), t.number()]),
          t.union([t.string(), t.boolean()]),
        ])
        .parse(undefined),
    ).toThrow();
  });
});
