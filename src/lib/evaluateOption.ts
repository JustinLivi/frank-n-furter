import { map, mapValues } from 'lodash';
import { isArray } from 'util';

import { ArrayConfig, ConfigOption, ConfigOptionUnion, GeneratorFunction, Template } from '../interfaces/template';
import { awaitMap } from './utils';

/**
 * Returns a function which can be used to evaluate standard config options
 * @param answers All provided answers
 * @param template The overall template
 */
export const evaluateOption = <Answers>(
  answers: Answers,
  template: Template<Answers>
) =>
  /**
   * Evaluate an option based on the enclosed answers
   * @param option The option to evaluate
   */
  async <Result>(option: ConfigOption<Answers, Result>) => {
    try {
      return typeof option === 'function'
        ? await (option as GeneratorFunction<Answers, Result>)(
            answers,
            template
          )
        : Promise.resolve(option);
    } catch (error) {
      throw error;
    }
  };

/**
 * Returns a function which can be used to evaluate a standard config options array
 * @param answers All provided answers
 * @param template The overall template
 */
export const evaluateOptionArray = <Answers>(
  answers: Answers,
  template: Template<Answers>
) =>
  /**
   * Evaluate an option based on the enclosed answers
   * @param option The option to evaluate
   */
  async <Result>(option: ArrayConfig<Answers, Result>) => {
    try {
      const evaluate = evaluateOption(answers, template);
      const array =
        typeof option === 'function'
          ? await (option as GeneratorFunction<Answers, Result[]>)(
              answers,
              template
            )
          : option;
      return Promise.all(map(array, evaluate));
    } catch (error) {
      throw error;
    }
  };

/**
 * Returns a function which can be used to evaluate a standard config options array
 * @param answers All provided answers
 * @param template The overall template
 */
export const evaluateOptionTree = <Answers>(
  answers: Answers,
  template: Template<Answers>
) =>
  /**
   * Evaluate an option based on the enclosed answers
   * @param option The option to evaluate
   */
  async <Result>(
    option: ConfigOptionUnion<Answers, Result>
  ): Promise<Result> => {
    try {
      const value = await (typeof option === 'function'
        ? (option as GeneratorFunction<Answers, Result>)(answers, template)
        : option);
      const evaluateTree = evaluateOptionTree(answers, template);
      if (isArray(value)) {
        return (Promise.all(map(value, evaluateTree)) as unknown) as Promise<
          Result
        >;
      }
      return (await (typeof value === 'object'
        ? awaitMap(mapValues(value as any, evaluateTree))
        : value)) as Promise<Result>;
    } catch (error) {
      throw error;
    }
  };
