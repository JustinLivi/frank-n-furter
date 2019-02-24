import { Dictionary, fromPairs, isNil, map, toPairs } from 'lodash';

// TODO: consider moving these to own packages

interface Extractor<Target> {
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
