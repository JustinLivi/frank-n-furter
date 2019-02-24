import { ConfigOption, GeneratorFunction } from '../interfaces/template';

/**
 * Returns a function which can be used to evaluate standard config options
 * @param answers All provided answers
 */
export const evaluateOption = <Answers>(answers: Answers) =>
  /**
   * Evaluate an option based on the enclosed answers
   * @param option The option to evaluate
   */
  async <Result>(option: ConfigOption<Answers, Result>) => {
    try {
      return typeof option === 'function'
        ? await (option as GeneratorFunction<Answers, Result>)(answers)
        : Promise.resolve(option);
    } catch (error) {
      throw error;
    }
  };
