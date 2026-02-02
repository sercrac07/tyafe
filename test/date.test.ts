import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.date();
const _input: Expect<T.Input<typeof _schema>, Date> = null as any;
const _output: Expect<T.Output<typeof _schema>, Date> = null as any;

describe("date schema", () => {
  it("should be defined", () => {
    expect(t.date).toBeDefined();
  });

  it("should parse", () => {
    expect(t.date().parse(new Date("2000-06-01"))).toEqual(
      new Date("2000-06-01"),
    );

    expect(
      t.date().min(new Date("2000-06-01")).parse(new Date("2000-06-01")),
    ).toEqual(new Date("2000-06-01"));
    expect(
      t.date().max(new Date("2000-06-01")).parse(new Date("2000-06-01")),
    ).toEqual(new Date("2000-06-01"));
  });

  it("should not parse", () => {
    expect(() => t.date().parse()).toThrow();
    expect(() => t.date().parse("john")).toThrow();
    expect(() => t.date().parse(1)).toThrow();
    expect(() => t.date().parse(1n)).toThrow();
    expect(() => t.date().parse(true)).toThrow();
    expect(() => t.date().parse(null)).toThrow();
    expect(() => t.date().parse(undefined)).toThrow();
    expect(() => t.date().parse(new Date("invalid"))).toThrow();

    expect(() =>
      t.date().min(new Date("2000-07-01")).parse(new Date("2000-06-01")),
    ).toThrow();
    expect(() =>
      t.date().max(new Date("2000-05-01")).parse(new Date("2000-06-01")),
    ).toThrow();
  });
});
