export type Expect<T, Expected> = T extends Expected
  ? Expected extends T
    ? T
    : never
  : never;
