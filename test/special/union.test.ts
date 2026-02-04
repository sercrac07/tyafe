import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.union([t.string(), t.number()]);
const _input: Expect<T.Input<typeof _schema>, string | number> = null as any;
const _output: Expect<T.Output<typeof _schema>, string | number> = null as any;

describe("union schema", () => {
  it("should be defined", () => {
    expect(t.union).toBeDefined();
  });

  it("should parse", () => {
    expect(t.union([t.string(), t.number()]).parse("john")).toBe("john");
    expect(t.union([t.string(), t.number()]).parse(12)).toBe(12);
  });

  it("should not parse", () => {
    expect(() => t.union([t.string(), t.number()]).parse()).toThrow();
    expect(() => t.union([t.string(), t.number()]).parse(1n)).toThrow();
    expect(() => t.union([t.string(), t.number()]).parse(true)).toThrow();
    expect(() => t.union([t.string(), t.number()]).parse(null)).toThrow();
    expect(() => t.union([t.string(), t.number()]).parse(undefined)).toThrow();
  });

  it("should handle deeply nested unions", () => {
    const schema = t.union([
      t.object({ type: t.literal("user"), data: t.string() }),
      t.object({
        type: t.literal("admin"),
        data: t.string(),
        permissions: t.array(t.string()),
      }),
      t.union([
        t.object({ type: t.literal("guest"), data: t.string() }),
        t.object({
          type: t.literal("bot"),
          data: t.string(),
          token: t.string(),
        }),
      ]),
    ]);

    const testCases: T.Input<typeof schema>[] = [
      { type: "user", data: "john" },
      { type: "admin", data: "admin", permissions: ["read", "write"] },
      { type: "guest", data: "guest" },
      { type: "bot", data: "bot", token: "abc123" },
    ];

    for (const testCase of testCases) {
      const result = schema.parse(testCase);
      expect(result).toEqual(testCase);
    }
  });
});
