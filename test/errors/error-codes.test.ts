import { describe, expect, it } from "vitest";
import { TyafeIssue, t } from "../../src";

describe("Error Code Validation", () => {
  it("should use correct error codes for primitives", () => {
    const stringSchema = t.string().min(5);
    const numberSchema = t.number().positive();
    const arraySchema = t.array(t.string()).nonEmpty();

    try {
      stringSchema.parse("abc");
    } catch (error) {
      if (error instanceof TyafeIssue) {
        expect(error.issues[0].code).toBe("string.min");
      }
    }

    try {
      numberSchema.parse(-1);
    } catch (error) {
      if (error instanceof TyafeIssue) {
        expect(error.issues[0].code).toBe("number.positive");
      }
    }

    try {
      arraySchema.parse([]);
    } catch (error) {
      if (error instanceof TyafeIssue) {
        expect(error.issues[0].code).toBe("array.non_empty");
      }
    }
  });
});
