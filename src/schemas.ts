import { TyafeBigint } from "./primitives/bigint";
import { TyafeBoolean } from "./primitives/boolean";
import { TyafeDate } from "./primitives/date";
import { TyafeLiteral } from "./primitives/literal";
import { TyafeNull } from "./primitives/null";
import { TyafeNumber } from "./primitives/number";
import { TyafeString } from "./primitives/string";
import { TyafeSymbol } from "./primitives/symbol";
import { TyafeUndefined } from "./primitives/undefined";
import type { LiteralParts } from "./types";

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

export { undefined_s as undefined, null_s as null };
