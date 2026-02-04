import { describe, expect, it } from "vitest";
import { TyafeIssue, t } from "../../src";

describe("Multiple Error Collection", () => {
  it("should collect all validation errors in objects", () => {
    const schema = t.object({
      name: t.string().min(3),
      email: t.string().email(),
      age: t.number().positive(),
    });

    try {
      schema.parse({
        name: "ab", // Too short
        email: "invalid-email", // Invalid format
        age: -1, // Not positive
      });
    } catch (error) {
      if (error instanceof TyafeIssue) {
        expect(error.issues).toHaveLength(3);

        // Check that all error codes are present
        const codes = error.issues.map((issue) => issue.code);
        expect(codes).toContain("string.min");
        expect(codes).toContain("string.email");
        expect(codes).toContain("number.positive");
      }
    }
  });

  it("should collect all array element errors", () => {
    const schema = t.array(
      t.object({
        id: t.number().positive(),
        name: t.string().min(3),
      }),
    );

    try {
      schema.parse([
        { id: -1, name: "ab" }, // Invalid first element
        { id: 1, name: "valid" }, // Valid second element
        { id: 1, name: "cd" }, // Invalid third element
      ]);
    } catch (error) {
      if (error instanceof TyafeIssue) {
        expect(error.issues).toHaveLength(3); // Should have 3 errors

        // Check path structure for array elements
        const firstElementErrors = error.issues.filter(
          (issue) => issue.path[0] === 0,
        );
        const thirdElementErrors = error.issues.filter(
          (issue) => issue.path[0] === 2,
        );

        expect(firstElementErrors).toHaveLength(2);
        expect(thirdElementErrors).toHaveLength(1);
      }
    }
  });
});
