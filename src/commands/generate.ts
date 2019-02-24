import { createPromptModule } from 'inquirer';

import { Template } from '../interfaces/template';
import { generateFiles } from '../lib/generateFiles';

const prompt = createPromptModule();

/**
 * Non-interactive, accepts answers and generates package
 * @param template The loaded template
 * @param answers All provided answers
 */
export const generate = async <Answers>(
  { files }: Template<Answers>,
  answers: Answers
) => {
  try {
    // generate files
    if (files) {
      await generateFiles(files, answers);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Prompts for answers, then generates package
 * @param template The loaded template
 */
export const generateInteractive = async <Answers>(
  template: Template<Answers>
) => {
  try {
    const answers = await prompt<Answers>(template.questions);
    return await generate(template, answers);
  } catch (error) {
    throw error;
  }
};
