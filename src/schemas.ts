import type { TyafeBase } from "./core/base";
import { TyafeBigint } from "./primitives/bigint";
import { TyafeBoolean } from "./primitives/boolean";
import { TyafeDate } from "./primitives/date";
import { TyafeFile } from "./primitives/file";
import { TyafeLiteral } from "./primitives/literal";
import { TyafeNull } from "./primitives/null";
import { TyafeNumber } from "./primitives/number";
import { TyafeString } from "./primitives/string";
import { TyafeSymbol } from "./primitives/symbol";
import { TyafeUndefined } from "./primitives/undefined";
import { TyafeArray } from "./structural/array";
import type { LiteralParts } from "./types";

/**
 * Creates a string schema validator optionally configured with a custom error message.
 *
 * @param error - Optional error message to use when validation fails
 * @returns A TyafeString instance configured with the provided `error`
 */
export function string(error?: string): TyafeString {
  return new TyafeString(error);
}

export function number(error?: string): TyafeNumber {
  return new TyafeNumber(error);
}

export function bigint(error?: string): TyafeBigint {
  return new TyafeBigint(error);
}

export function boolean(error?: string): TyafeBoolean {
  return new TyafeBoolean(error);
}

export function symbol(error?: string): TyafeSymbol {
  return new TyafeSymbol(error);
}

function undefined_s(error?: string): TyafeUndefined {
  return new TyafeUndefined(error);
}

function null_s(error?: string): TyafeNull {
  return new TyafeNull(error);
}

export function literal<T extends LiteralParts>(
  value: T,
  error?: string,
): TyafeLiteral<T> {
  return new TyafeLiteral(value, error);
}

export function date(error?: string): TyafeDate {
  return new TyafeDate(error);
}

/**
 * Creates a file schema configured with an optional custom error message.
 *
 * @param error - Optional custom error message used when validation fails
 * @returns A TyafeFile schema instance configured with the provided `error`
 */
export function file(error?: string): TyafeFile {
  return new TyafeFile(error);
}

/**
 * Creates an array schema for elements matching the given schema.
 *
 * @param schema - Schema that each array element must satisfy
 * @param error - Optional custom error message to use when validation fails
 * @returns A `TyafeArray` configured with the provided element schema and error message
 */
export function array<T extends TyafeBase<any, any>>(
  schema: T,
  error?: string,
): TyafeArray<T> {
  return new TyafeArray(schema, error);
}

export { undefined_s as undefined, null_s as null };