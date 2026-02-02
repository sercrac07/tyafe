import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.file();
const _input: Expect<T.Input<typeof _schema>, File> = null as any;
const _output: Expect<T.Output<typeof _schema>, File> = null as any;

describe("file schema", () => {
  it("should be defined", () => {
    expect(t.file).toBeDefined();
  });

  it("should parse", () => {
    expect(
      t.file().parse(new File(["john"], "doe", { lastModified: 0 })),
    ).toEqual(new File(["john"], "doe", { lastModified: 0 }));

    expect(
      t
        .file()
        .min(4)
        .parse(new File(["john"], "doe", { lastModified: 0 })),
    ).toEqual(new File(["john"], "doe", { lastModified: 0 }));
    expect(
      t
        .file()
        .max(4)
        .parse(new File(["john"], "doe", { lastModified: 0 })),
    ).toEqual(new File(["john"], "doe", { lastModified: 0 }));
    expect(
      t
        .file()
        .mime(["plain"])
        .parse(new File(["john"], "doe", { lastModified: 0, type: "plain" })),
    ).toEqual(new File(["john"], "doe", { lastModified: 0, type: "plain" }));
  });

  it("should not parse", () => {
    expect(() => t.file().parse()).toThrow();
    expect(() => t.file().parse("john")).toThrow();
    expect(() => t.file().parse(1)).toThrow();
    expect(() => t.file().parse(1n)).toThrow();
    expect(() => t.file().parse(true)).toThrow();
    expect(() => t.file().parse(null)).toThrow();
    expect(() => t.file().parse(undefined)).toThrow();

    expect(() =>
      t
        .file()
        .min(5)
        .parse(new File(["john"], "doe", { lastModified: 0 })),
    ).toThrow();
    expect(() =>
      t
        .file()
        .max(3)
        .parse(new File(["john"], "doe", { lastModified: 0 })),
    ).toThrow();
    expect(() =>
      t
        .file()
        .mime(["plain"])
        .parse(new File(["john"], "doe", { lastModified: 0 })),
    ).toThrow();
  });
});
