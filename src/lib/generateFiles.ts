import { outputFile } from 'fs-extra';
import { map } from 'lodash';

import { FileConfig, Template } from '../interfaces/template';
import { evaluateOption } from './evaluateOption';
import { execNullable } from './utils';

/**
 * Returns a function which generates a file
 * based on the configuration and answers
 * @param answers All provided answers
 * @param template The overall template
 */
export const generateFile = <Answers>(
  answers: Answers,
  template: Template<Answers>
) =>
  /**
   * Generates a file based on the configuration and answers
   * @param fileConfig A file configuration
   */
  async ({ path, contents }: FileConfig<Answers>) => {
    try {
      const { hooks = {} } = template;
      const { prefile, postfile } = hooks;
      const evaluate = evaluateOption(answers, template);
      const pathValue = await evaluate(path);
      // prefile hook
      const execPrefile = execNullable(prefile);
      await execPrefile(pathValue, answers, template);
      const contentsValue = await evaluate(contents);
      await outputFile(pathValue, contentsValue);
      // postfile hook
      const execPostfile = execNullable(postfile);
      await execPostfile(pathValue, answers, template);
    } catch (error) {
      throw error;
    }
  };

/**
 * Generates files based on the configuration and answers
 * @param template The overall template
 * @param answers All provided answers
 */
export const generateFiles = async <Answers>(
  answers: Answers,
  template: Template<Answers>
) => {
  try {
    const { hooks = {}, files = [] } = template;
    const { prefiles, postfiles } = hooks;
    // prefiles hook
    await execNullable(prefiles)(answers, template);
    const evaluate = evaluateOption(answers, template);
    const filesValue = await evaluate(files);
    const generate = generateFile(answers, template);
    await Promise.all(map(filesValue, generate));
    // postfiles hook
    await execNullable(postfiles)(answers, template);
  } catch (error) {
    throw error;
  }
};
