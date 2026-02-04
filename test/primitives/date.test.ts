import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.date();
const _input: Expect<T.Input<typeof _schema>, Date> = null as any;
const _output: Expect<T.Output<typeof _schema>, Date> = null as any;

describe("date schema", () => {
  it("should be defined", () => {
    expect(t.date).toBeDefined();
  });

  it("should parse", () => {
    const utcDate = new Date("2024-01-01T00:00:00.000Z");
    const localDate = new Date("2024-01-01T00:00:00.000");

    expect(t.date().parse(new Date("2000-06-01"))).toEqual(
      new Date("2000-06-01"),
    );
    expect(t.date().parse(new Date("1970-01-01"))).toEqual(
      new Date("1970-01-01"),
    );
    expect(t.date().parse(new Date("9999-12-31"))).toEqual(
      new Date("9999-12-31"),
    );
    expect(t.date().parse(new Date(8.64e15))).toEqual(new Date(8.64e15));

    expect(t.date().parse(utcDate)).toEqual(utcDate);
    expect(t.date().parse(localDate)).toEqual(localDate);

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
