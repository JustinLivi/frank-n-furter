import { map, mapValues } from 'lodash';
import { isArray } from 'util';

import { ConfigOptionUnion, GeneratorFunction, Template } from '../interfaces/template';
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
  async <Result>(
    option: ConfigOptionUnion<Answers, Result>
  ): Promise<Result> => {
    try {
      const value =
        typeof option === 'function'
          ? await (option as GeneratorFunction<Answers, Result>)(
              answers,
              template
            )
          : typeof option === 'object' && option instanceof Promise
          ? await option
          : option;
      const evaluateTree = evaluateOption(answers, template);
      return isArray(value)
        ? (Promise.all(map(value, evaluateTree)) as any)
        : ((typeof value === 'object'
            ? awaitMap(mapValues(value as any, evaluateTree))
            : value) as Promise<Result>);
    } catch (error) {
      throw error;
    }
  };
