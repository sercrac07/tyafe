import { ERROR_CODES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import type { MaybePromise, ValidatorConfig } from "../types";

export class TyafeFile extends TyafeBase<File, File, { error: string }> {
  public override readonly kind: "file" = "file";

  constructor(error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: file was expected",
    });
  }

  protected override parseFunction(input: unknown): MaybePromise<File> {
    if (!(input instanceof File)) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error),
      ]);
    }

    return deepCopy(input);
  }

  public override clone(): TyafeFile {
    const newThis = new TyafeFile();
    newThis._config = deepCopy(this._config);
    return newThis;
  }

  /**
   * Ensures file size is greater than or equal to `bytes`.
   */
  min(bytes: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.FILE.MIN,
      `File must be at least ${bytes} bytes`,
      config,
    );

    this.validate((value) => (value.size >= bytes ? null : issue));
    return this;
  }
  /**
   * Ensures file size is less than or equal to `bytes`.
   */
  max(bytes: number, config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.FILE.MAX,
      `File must be at most ${bytes} bytes`,
      config,
    );

    this.validate((value) => (value.size <= bytes ? null : issue));
    return this;
  }
  /**
   * Ensures file type is one of the provided mime types.
   */
  mime(mimeTypes: string[], config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.FILE.MIME,
      `File type must be one of ${mimeTypes.join(", ")}`,
      config,
    );

    this.validate((value) => (mimeTypes.includes(value.type) ? null : issue));
    return this;
  }
}
