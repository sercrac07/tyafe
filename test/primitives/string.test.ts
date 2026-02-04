import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";
import type { Expect } from "../utils";

const _schema = t.string();
const _input: Expect<T.Input<typeof _schema>, string> = null as any;
const _output: Expect<T.Output<typeof _schema>, string> = null as any;

describe("string schema", () => {
  it("should be defined", () => {
    expect(t.string).toBeDefined();
  });

  it("should parse", () => {
    expect(t.string().parse("john")).toBe("john");

    expect(t.string().nonEmpty().parse("john")).toBe("john");
    expect(t.string().min(4).parse("john")).toBe("john");
    expect(t.string().max(4).parse("john")).toBe("john");
    expect(t.string().regex(/john/).parse("john")).toBe("john");
    expect(t.string().email().parse("john@exam.ple")).toBe("john@exam.ple");
    expect(t.string().url().parse("https://exam.ple")).toBe("https://exam.ple");
    expect(
      t
        .string()
        .url({ allowedProtocols: ["https"] })
        .parse("https://exam.ple"),
    ).toBe("https://exam.ple");
    expect(t.string().json().parse('{"name":"john"}')).toBe('{"name":"john"}');
    expect(
      t.string().uuid().parse("550e8400-e29b-41d4-a716-446655440000"),
    ).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(
      t
        .string()
        .uuid({ version: "v4" })
        .parse("550e8400-e29b-41d4-a716-446655440000"),
    ).toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  it("should not parse", () => {
    expect(() => t.string().parse()).toThrow();
    expect(() => t.string().parse(1)).toThrow();
    expect(() => t.string().parse(1n)).toThrow();
    expect(() => t.string().parse(true)).toThrow();
    expect(() => t.string().parse(null)).toThrow();
    expect(() => t.string().parse(undefined)).toThrow();

    expect(() => t.string().nonEmpty().parse("")).toThrow();
    expect(() => t.string().min(5).parse("john")).toThrow();
    expect(() => t.string().max(3).parse("john")).toThrow();
    expect(() => t.string().regex(/doe/).parse("john")).toThrow();
    expect(() => t.string().email().parse("john")).toThrow();
    expect(() => t.string().url().parse("john")).toThrow();
    expect(() =>
      t
        .string()
        .url({ allowedProtocols: ["http"] })
        .parse("https://exam.ple"),
    ).toThrow();
    expect(() => t.string().json().parse("john")).toThrow();
    expect(() => t.string().uuid().parse("john")).toThrow();
    expect(() =>
      t
        .string()
        .uuid({ version: "v1" })
        .parse("550e8400-e29b-41d4-a716-446655440000"),
    ).toThrow();
  });
});
