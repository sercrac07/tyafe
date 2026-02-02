export type Expect<Target, Value> =
  (<T>() => T extends Target ? 1 : 2) extends <T>() => T extends Value ? 1 : 2
    ? Target
    : never;
