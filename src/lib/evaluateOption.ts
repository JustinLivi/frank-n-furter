import { map, mapValues } from 'lodash';

import { ArrayConfig, ConfigOption, GeneratorFunction, Template, TreeConfig } from '../interfaces/template';

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
  async <Result extends object>(option: TreeConfig<Answers, Result>) => {
    try {
      const value = await (typeof option === 'function'
        ? (option as GeneratorFunction<Answers, Result>)(answers, template)
        : option);
      const typeofValue = typeof value;
      (() => {
        switch (typeofValue) {
          case 'object':
            return mapValues(value, evaluateOptionTree(answers, template));
          case 'number':
          case 'string':
          case 'boolean':
            return evaluateOption(answers, template)(value);
        }
      })();
    } catch (error) {
      throw error;
    }
  };
