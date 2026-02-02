import { TyafeBigint } from "./primitives/bigint";
import { TyafeBoolean } from "./primitives/boolean";
import { TyafeNumber } from "./primitives/number";
import { TyafeString } from "./primitives/string";

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
