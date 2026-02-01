import { TyafeString } from "./primitives/string";

export function string(error?: string) {
  return new TyafeString(error);
}
