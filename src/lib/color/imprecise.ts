export type Imprecise<Value> = {
  ignoringPrecision: Value;
  map: <NewValue>(f: (v: Value) => NewValue) => Imprecise<NewValue>;
} & (
  | {
      precise: Value;
      approximation?: undefined;
    }
  | {
      precise?: undefined;
      approximation: Value;
    }
);

export function makeApproximate<Value>(value: Value): Imprecise<Value> {
  return {
    approximation: value,
    ignoringPrecision: value,
    map: (f) => makeApproximate(f(value)),
    precise: undefined,
  };
}

export function makePrecise<Value>(value: Value): Imprecise<Value> {
  return {
    approximation: undefined,
    ignoringPrecision: value,
    map: (f) => makePrecise(f(value)),
    precise: value,
  };
}
