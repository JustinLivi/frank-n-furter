import { outputFile } from 'fs-extra';
import { map } from 'lodash';

import { FileConfig, Template } from '../interfaces/template';
import { evaluateOption } from './evaluateOption';

/**
 * Generates a file based on the configuration and answers
 * @param template The overall template
 * @param file A file configuration
 * @param answers All provided answers
 */
export const generateFile = async <Answers>(
  template: Template<Answers>,
  { path, contents }: FileConfig<Answers>,
  answers: Answers
) => {
  try {
    const { hooks = {} } = template;
    const { prefile, postfile } = hooks;
    const evaluate = evaluateOption(answers, template);
    const pathValue = await evaluate(path);
    if (prefile) {
      await prefile(pathValue, answers, template);
    }
    const contentsValue = await evaluate(contents);
    await outputFile(pathValue, contentsValue);
    if (postfile) {
      await postfile(pathValue, answers, template);
    }
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
  template: Template<Answers>,
  answers: Answers
) => {
  try {
    const { hooks = {}, files } = template;
    if (!files) {
      return;
    }
    const { prefiles, postfiles } = hooks;
    if (prefiles) {
      await prefiles(answers, template);
    }
    const evaluate = evaluateOption(answers, template);
    const filesValue = await evaluate(files);
    await Promise.all(
      map(filesValue, file => generateFile(template, file, answers))
    );
    if (postfiles) {
      await postfiles(answers, template);
    }
  } catch (error) {
    throw error;
  }
};
