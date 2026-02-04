import { describe, expect, it } from "vitest";
import { TyafeIssue, t } from "../../src";

describe("Error Path Tracing", () => {
  it("should trace errors in nested objects correctly", () => {
    const schema = t.object({
      user: t.object({
        profile: t.object({
          name: t.string().min(3),
          email: t.string().email(),
        }),
        settings: t.object({
          theme: t.union([t.literal("light"), t.literal("dark")]),
        }),
      }),
    });

    try {
      schema.parse({
        user: {
          profile: {
            name: "ab", // Error path: ["user", "profile", "name"]
            email: "invalid-email", // Error path: ["user", "profile", "email"]
          },
          settings: {
            theme: "invalid", // Error path: ["user", "settings", "theme"]
          },
        },
      });
    } catch (error) {
      if (error instanceof TyafeIssue) {
        const paths = error.issues.map((issue) => issue.path);
        expect(paths).toContainEqual(["user", "profile", "name"]);
        expect(paths).toContainEqual(["user", "profile", "email"]);
        expect(paths).toContainEqual(["user", "settings", "theme"]);
      }
    }
  });

  it("should trace errors in deeply nested arrays", () => {
    const schema = t.object({
      items: t.array(
        t.object({
          id: t.number().positive(),
          data: t.array(t.string().min(2)),
        }),
      ),
    });
    try {
      schema.parse({
        items: [
          { id: -1, data: ["a"] }, // Multiple errors: id negative, data too short
          { id: 1, data: ["valid", "ok"] },
        ],
      });
    } catch (error) {
      if (error instanceof TyafeIssue) {
        // Expected paths: ["items", 0, "id"], ["items", 0, "data", 0]
        const paths = error.issues.map((issue) => issue.path);
        expect(paths).toContainEqual(["items", 0, "id"]);
        expect(paths).toContainEqual(["items", 0, "data", 0]);
      }
    }
  });
});
