import { describe, expect, it } from "vitest";
import { type TyafeBase, t } from "../../src";

describe("Deep Nesting Performance", () => {
  it("should handle deeply nested objects efficiently", () => {
    let deepSchema: TyafeBase<any, any> = t.string();
    let deepInput: unknown = "deep value";

    // Build 20 levels of nesting
    for (let i = 0; i < 20; i++) {
      deepSchema = t.object({ [`level-${i}`]: deepSchema });
      deepInput = { [`level-${i}`]: deepInput };
    }

    const startTime = performance.now();
    const result = deepSchema.parse(deepInput);
    const endTime = performance.now();

    expect(result).toBeDefined();

    // Should complete within reasonable time (< 100ms for 20 levels)
    const parseTime = endTime - startTime;
    expect(parseTime).toBeLessThan(100);
  });

  it("should handle deeply nested arrays efficiently", () => {
    const arraySchema = t.array(t.array(t.array(t.string())));

    const deepInput = Array.from({ length: 10 }, (_, i) =>
      Array.from({ length: 10 }, (_, j) =>
        Array.from({ length: 10 }, (_, k) => `item-${i}-${j}-${k}`),
      ),
    );

    const startTime = performance.now();
    const result = arraySchema.parse(deepInput);
    const endTime = performance.now();

    expect(result).toHaveLength(10);
    expect(result[0]).toHaveLength(10);
    expect(result[0][0]).toHaveLength(10);

    // Should handle 1000 elements efficiently (< 50ms)
    const parseTime = endTime - startTime;
    console.log(parseTime);
    expect(parseTime).toBeLessThan(50);
  });
});
