import { describe, expect, it } from "vitest";
import { type T, t } from "../../src";

describe("Schema Chain Performance", () => {
  it("should handle long validation chains efficiently", () => {
    const chainedSchema = t
      .string()
      .min(5)
      .max(100)
      .regex(/^[a-zA-Z0-9@.]+$/)
      .email()
      .process((value) => value.trim())
      .process((value) => value.toLowerCase())
      .validate((value) =>
        value.length > 3 ? null : "Too short after processing",
      );

    const testInputs: T.Input<typeof chainedSchema>[] = [
      "valid.email@example.com",
      "another.valid@test.org",
      "user@domain.co.uk",
    ];

    const startTime = performance.now();

    for (const input of testInputs) {
      const result = chainedSchema.parse(input);
      expect(result).toBeDefined();
    }

    const endTime = performance.now();

    // Chain validation should be efficient (< 5ms per validation)
    const totalTime = endTime - startTime;
    const avgTime = totalTime / testInputs.length;
    expect(avgTime).toBeLessThan(5);
  });

  it("should handle complex object chains efficiently", () => {
    const complexSchema = t.object({
      user: t.object({
        name: t
          .string()
          .min(2)
          .max(50)
          .process((n) => n.trim()),
        email: t.string().email(),
        age: t.number().min(18).max(120).positive(),
        profile: t.optional(
          t.object({
            bio: t.string().max(500),
            avatar: t.string().url(),
          }),
        ),
      }),
      settings: t.object({
        theme: t.union([t.literal("light"), t.literal("dark")]),
        notifications: t.boolean(),
        privacy: t.record(t.string(), t.boolean()),
      }),
      metadata: t.record(
        t.string(),
        t.union([t.string(), t.number(), t.boolean()]),
      ),
    });

    const complexInput: T.Input<typeof complexSchema> = {
      user: {
        name: "  John Doe  ",
        email: "john.doe@example.com",
        age: 30,
        profile: { bio: "Developer", avatar: "https://example.com/avatar.png" },
      },
      settings: {
        theme: "dark",
        notifications: true,
        privacy: { public: false, searchable: true },
      },
      metadata: {
        version: "1.0.0",
        build: 1234,
        beta: false,
      },
    };

    const startTime = performance.now();
    const result = complexSchema.parse(complexInput);
    const endTime = performance.now();

    expect(result).toBeDefined();
    expect(result.user.name).toBe("John Doe");

    // Complex validation should complete quickly (< 20ms)
    const parseTime = endTime - startTime;
    expect(parseTime).toBeLessThan(20);
  });
});
