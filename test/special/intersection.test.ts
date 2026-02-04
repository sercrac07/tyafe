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

  it("should handle intersection of complex objects", () => {
    const userSchema = t.object({
      id: t.number(),
      name: t.string(),
      email: t.string(),
    });

    const userProfileSchema = t.object({
      bio: t.string(),
      avatar: t.string().url(),
    });

    const combinedSchema = t.intersection([userSchema, userProfileSchema]);

    const validUser: T.Input<typeof combinedSchema> = {
      id: 1,
      name: "John",
      email: "john@example.com",
      bio: "Software developer",
      avatar: "https://example.com/avatar.jpg",
    };

    const result = combinedSchema.parse(validUser);
    expect(result).toEqual(validUser);
  });

  it("should handle intersection with conflicts", () => {
    const schema1 = t.object({
      id: t.number(),
      name: t.string(),
    });

    const schema2 = t.object({
      id: t.string(), // Different type - should cause conflict
      name: t.string(),
    });

    const intersectionSchema = t.intersection([schema1, schema2]);

    expect(() =>
      intersectionSchema.parse({
        id: 1,
        name: "test",
      }),
    ).toThrow();
  });
});
