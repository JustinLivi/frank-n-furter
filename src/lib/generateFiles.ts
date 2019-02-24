import { outputFile } from 'fs-extra';
import { map } from 'lodash';

import { ConfigOption, FileConfig } from '../interfaces/template';
import { evaluateOption } from './evaluateOption';

/**
 * Generates a file based on the configuration and answers
 * @param file A file configuration
 * @param answers All provided answers
 */
export const generateFile = async <Answers>(
  { path, contents }: FileConfig<Answers>,
  answers: Answers
) => {
  try {
    const evaluate = evaluateOption(answers);
    const pathValue = await evaluate(path);
    const contentsValue = await evaluate(contents);
    await outputFile(pathValue, contentsValue);
  } catch (error) {
    throw error;
  }
};

/**
 * Generates files based on the configuration and answers
 * @param files A files configuration
 * @param answers All provided answers
 */
export const generateFiles = async <Answers>(
  files: ConfigOption<Answers, Array<FileConfig<Answers>>>,
  answers: Answers
) => {
  try {
    const evaluate = evaluateOption(answers);
    const filesValue = await evaluate(files);
    await Promise.all(map(filesValue, file => generateFile(file, answers)));
  } catch (error) {
    throw error;
  }
};
