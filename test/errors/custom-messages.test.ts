import { describe, expect, it } from "vitest";
import { t } from "../../src";

describe("Custom Error Messages", () => {
  it("should use custom string error messages", () => {
    const schema = t.string().min(5, "Custom: must be at least 5 chars");

    expect(schema.safeParse("abc")).toEqual({
      success: false,
      issues: [
        {
          code: "string.min",
          error: "Custom: must be at least 5 chars",
          path: [],
        },
      ],
    });
  });

  it("should use 'ValidatorConfig' error messages", () => {
    const schema = t.string().min(5, {
      error: "Custom validator failed",
      code: "custom.min.length",
    });

    expect(schema.safeParse("abc")).toEqual({
      success: false,
      issues: [
        {
          code: "custom.min.length",
          error: "Custom validator failed",
          path: [],
        },
      ],
    });
  });

  it("should merge 'ValidatorConfig' with existing error codes", () => {
    const schema = t.string().min(5, { error: "Custom validator failed" });

    expect(schema.safeParse("abc")).toEqual({
      success: false,
      issues: [
        {
          code: "string.min",
          error: "Custom validator failed",
          path: [],
        },
      ],
    });
  });
});
