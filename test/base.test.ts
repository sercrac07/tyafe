import { describe, expect, it } from "vitest";
import { t } from "../src";

describe("base functionality", () => {
  it("should safe parse", () => {
    expect(t.string().safeParse("john")).toEqual({
      success: true,
      data: "john",
    });

    expect(t.string().safeParse(12)).toEqual({
      success: false,
      issues: [
        {
          code: "invalid_type",
          error: "Invalid input type: string was expected",
          path: [],
        },
      ],
    });
  });

  it("should handle default values", () => {
    expect(t.string().default("john").parse()).toBe("john");
    expect(
      t
        .string()
        .default(() => "john")
        .parse(),
    ).toBe("john");
    expect(t.string().fallback("john").parse()).toBe("john");
    expect(
      t
        .string()
        .fallback(() => "john")
        .parse(),
    ).toBe("john");
  });

  it("should validate", () => {
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
  });

  it("should process", () => {
    expect(
      t
        .string()
        .process((value) => value.toUpperCase())
        .parse("john"),
    ).toBe("JOHN");
  });

  it("should preprocess", () => {
    expect(
      t
        .string()
        .preprocess((value) => String(value))
        .preprocess<string>((value) => value.toUpperCase())
        .parse("john"),
    ).toBe("JOHN");
  });

  it("should clone config", () => {
    expect(t.string().min(4).clone().parse("john")).toBe("john");

    expect(() => t.string().min(5).clone().parse("john")).toThrow();
  });
});
