import { TyafeNumber } from "./primitives/number";
import { TyafeString } from "./primitives/string";

export function string(error?: string): TyafeString {
  return new TyafeString(error);
}

export function number(error?: string): TyafeNumber {
  return new TyafeNumber(error);
}
