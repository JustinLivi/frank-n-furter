import { Dictionary, fromPairs, isNil, map, toPairs } from 'lodash';
import { ArgsN } from 'tsargs';

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

export type NullableFunc = ((...args: any[]) => any) | undefined;
export type ReturnOfNullable<Target extends NullableFunc> =
  | ReturnType<Exclude<Target, undefined>>
  | undefined;
export type ArgsOfNullable<Target extends NullableFunc> = ArgsN<
  Exclude<Target, undefined>
>;
export type DefaultReturnOfNullable<
  Target extends NullableFunc,
  Default extends ReturnOfNullable<Target>
> = ReturnType<Exclude<Target, undefined>> | Default;

export const execNullable = <
  Target extends NullableFunc,
  Default extends ReturnOfNullable<Target>
>(
  target: Target,
  defaultValue?: Default
) => (
  ...args: ArgsOfNullable<Target>
): DefaultReturnOfNullable<Target, Default> =>
  typeof target === 'function' ? target(...args) : defaultValue;

export const execConditional = <
  Target extends NullableFunc,
  Default extends ReturnOfNullable<Target>
>(
  condition: boolean,
  target: Target,
  defaultValue?: Default
) => (
  ...args: ArgsOfNullable<Target>
): DefaultReturnOfNullable<Target, Default> =>
  condition && typeof target === 'function' ? target(...args) : defaultValue;

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
