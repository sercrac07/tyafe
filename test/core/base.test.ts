import { describe, expect, it } from "vitest";
import { ERROR_CODES, t } from "../../src";

describe("base functionality", () => {
  it("should parse", () => {
    expect(t.string().parse("john")).toBe("john");
    expect(() => t.string().parse(12)).toThrow();
  });

  it("should parse async", async () => {
    await expect(t.string().parseAsync("john")).resolves.toBe("john");
    await expect(t.string().parseAsync(12)).rejects.toThrow();
  });

  it("should safe parse", () => {
    expect(t.string().safeParse("john")).toEqual({
      success: true,
      data: "john",
    });
    expect(t.string().safeParse(12)).toEqual({
      success: false,
      issues: [
        {
          code: ERROR_CODES.CORE.INVALID_TYPE,
          error: "Invalid input type: string was expected",
          path: [],
        },
      ],
    });
  });

  it("should safe parse async", async () => {
    await expect(t.string().safeParseAsync("john")).resolves.toEqual({
      success: true,
      data: "john",
    });
    await expect(t.string().safeParseAsync(12)).resolves.toEqual({
      success: false,
      issues: [
        {
          code: ERROR_CODES.CORE.INVALID_TYPE,
          error: "Invalid input type: string was expected",
          path: [],
        },
      ],
    });
  });

  it("should handle default values", async () => {
    expect(t.string().default("john").parse()).toBe("john");
    expect(
      t
        .string()
        .default(() => "john")
        .parse(),
    ).toBe("john");
    expect(() =>
      t
        .string()
        .default(async () => "john")
        .parse(),
    ).toThrow();
    await expect(
      t
        .string()
        .default(async () => "john")
        .parseAsync(),
    ).resolves.toBe("john");

    expect(t.string().fallback("john").parse()).toBe("john");
    expect(
      t
        .string()
        .fallback(() => "john")
        .parse(),
    ).toBe("john");
    expect(() =>
      t
        .string()
        .fallback(async () => "john")
        .parse(),
    ).toThrow();
    await expect(
      t
        .string()
        .fallback(async () => "john")
        .parseAsync(),
    ).resolves.toBe("john");
  });

  it("should validate", async () => {
    expect(
      t
        .string()
        .validate((value) => (value !== "doe" ? null : "Invalid"))
        .parse("john"),
    ).toBe("john");

    expect(() =>
      t
        .string()
        .validate((value) => (value !== "john" ? null : "Invalid"))
        .parse("john"),
    ).toThrow();

    expect(() =>
      t
        .string()
        .validate(async (value) => (value !== "doe" ? null : "Invalid"))
        .parse("john"),
    ).toThrow();

    await expect(
      t
        .string()
        .validate(async (value) => (value !== "doe" ? null : "Invalid"))
        .parseAsync("john"),
    ).resolves.toBe("john");
  });

  it("should process", async () => {
    expect(
      t
        .string()
        .process((value) => value.toUpperCase())
        .parse("john"),
    ).toBe("JOHN");

    expect(() =>
      t
        .string()
        .process(async (value) => value.toUpperCase())
        .parse("john"),
    ).toThrow();

    await expect(
      t
        .string()
        .process(async (value) => value.toUpperCase())
        .parseAsync("john"),
    ).resolves.toBe("JOHN");
  });

  it("should preprocess", async () => {
    expect(
      t
        .string()
        .preprocess((value) => String(value))
        .preprocess<string>((value) => value.toUpperCase())
        .parse("john"),
    ).toBe("JOHN");

    expect(() =>
      t
        .string()
        .preprocess((value) => String(value))
        .preprocess<string>(async (value) => value.toUpperCase())
        .parse("john"),
    ).toThrow();

    await expect(
      t
        .string()
        .preprocess((value) => String(value))
        .preprocess<string>(async (value) => value.toUpperCase())
        .parseAsync("john"),
    ).resolves.toBe("JOHN");
  });

  it("should clone config", () => {
    const schema = t.string().email();
    const newSchema = schema.clone().min(4);

    expect(schema.parse("john@exam.ple")).toBe("john@exam.ple");
    expect(() => newSchema.parse("john")).toThrow();
  });
});
