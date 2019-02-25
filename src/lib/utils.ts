import { Dictionary, fromPairs, isNil, map, toPairs } from 'lodash';

// TODO: consider moving these to own packages

export interface Extractor<Target> {
  sub: <Property extends keyof Target>(
    property: Property
  ) => Extractor<Exclude<Target[Property], undefined>>;
  value: <Default extends Target | undefined>(
    defaultValue?: Default
  ) => Target | Default;
  map: <Res>(mapper: (target: Target) => Res) => Extractor<Res>;
}

export const ofExtractor = <Target>(target?: Target): Extractor<Target> => ({
  sub: property =>
    (isNil(target) ? ofExtractor() : ofExtractor(target[property])) as any,
  value: defaultValue => (isNil(target) ? defaultValue : target) as any,
  map: mapper => (isNil(target) ? ofExtractor() : ofExtractor(mapper(target)))
});

type ArgsType<T, R> = T extends (...args: infer U) => R ? U : never;

export const execNullable = <
  Target extends (...args: any[]) => any,
  Args extends ArgsType<Target, ReturnValue>,
  ReturnValue extends ReturnType<Target>,
  Default extends ReturnValue | undefined
>(
  target: Target | undefined,
  defaultValue?: Default
) => (...args: Args): ReturnValue | Default =>
  typeof target === 'function' ? target(...args) : defaultValue;

export const stringLiteralArray = <T extends string>(a: T[]) => a;

export const fromPromiseTuple: <T>(
  tuple: [string, Promise<T>]
) => Promise<[string, T]> = async ([key, promise]) => [key, await promise];

export const awaitMap = async <T>(
  dictionary: Dictionary<Promise<T>>
): Promise<Dictionary<T>> => {
  const pairs = await Promise.all(map(toPairs(dictionary), fromPromiseTuple));
  return fromPairs(pairs);
};
