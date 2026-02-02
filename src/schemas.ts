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
import { TyafeBooleanish } from "./special/booleanish";
import { TyafeIntersection } from "./special/intersection";
import { TyafeLazy } from "./special/lazy";
import { TyafeMutate } from "./special/mutate";
import { TyafeUnion } from "./special/union";
import { TyafeArray } from "./structural/array";
import { TyafeObject } from "./structural/object";
import { TyafeRecord } from "./structural/record";
import { TyafeTuple } from "./structural/tuple";
import type { Input, LiteralParts, Mutator, Output } from "./types";
import { TyafeNullable } from "./utility/nullable";
import { TyafeNullish } from "./utility/nullish";
import { TyafeOptional } from "./utility/optional";

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

export function file(error?: string): TyafeFile {
  return new TyafeFile(error);
}

export function array<T extends TyafeBase<any, any>>(
  schema: T,
  error?: string,
): TyafeArray<T> {
  return new TyafeArray(schema, error);
}

export function object<T extends Record<string, TyafeBase<any, any>>>(
  shape: T,
  error?: string,
): TyafeObject<T> {
  return new TyafeObject(shape, error);
}

export function record<
  Key extends TyafeBase<string, string>,
  Value extends TyafeBase<any, any>,
>(key: Key, value: Value, error?: string): TyafeRecord<Key, Value> {
  return new TyafeRecord(key, value, error);
}

export function tuple<T extends TyafeBase<any, any>[]>(
  schemas: [...T],
  error?: string,
): TyafeTuple<T> {
  return new TyafeTuple(schemas, error);
}

export function optional<T extends TyafeBase<any, any>>(
  schema: T,
): TyafeOptional<T> {
  return new TyafeOptional(schema);
}

export function nullable<T extends TyafeBase<any, any>>(
  schema: T,
): TyafeNullable<T> {
  return new TyafeNullable(schema);
}

export function nullish<T extends TyafeBase<any, any>>(
  schema: T,
): TyafeNullish<T> {
  return new TyafeNullish(schema);
}

export function booleanish(
  trueValues: string[],
  falseValues: string[],
  error?: string,
): TyafeBooleanish {
  return new TyafeBooleanish(trueValues, falseValues, error);
}

export function union<T extends TyafeBase<any, any>[]>(
  schemas: [...T],
): TyafeUnion<T> {
  return new TyafeUnion(schemas);
}

export function intersection<T extends TyafeBase<any, any>[]>(
  schemas: [...T],
): TyafeIntersection<T> {
  return new TyafeIntersection(schemas);
}

export function lazy<T extends TyafeBase<any, any>>(
  schema: () => T,
): TyafeLazy<T> {
  return new TyafeLazy(schema);
}

export function mutate<
  From extends TyafeBase<any, any>,
  To extends TyafeBase<any, any>,
>(
  from: From,
  to: To,
  mutator: Mutator<Output<From>, Input<To>>,
): TyafeMutate<From, To> {
  return new TyafeMutate(from, to, mutator);
}

export { undefined_s as undefined, null_s as null };
