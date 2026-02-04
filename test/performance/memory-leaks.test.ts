import { afterEach, describe, expect, it } from "vitest";
import { t } from "../../src";

describe("Memory Leak Detection", () => {
  afterEach(() => {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  });

  it("should not leak memory on repeated parsing", () => {
    const schema = t.object({
      items: t.array(t.string()),
      nested: t.object({
        deep: t.object({
          value: t.string(),
        }),
      }),
    });

    const initialMemory = process.memoryUsage().heapUsed;

    // Perform many parse operations
    for (let i = 0; i < 1000; i++) {
      const result = schema.parse({
        items: Array.from({ length: 10 }, (_, i) => `item-${i}`),
        nested: { deep: { value: `test-${i % 10}` } },
      });

      expect(result).toBeDefined();
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be minimal (< 1MB for 1000 operations)
    expect(memoryIncrease).toBeLessThan(1024 * 1024);
  });
});
