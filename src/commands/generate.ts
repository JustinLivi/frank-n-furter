import { Template } from '../interfaces/template';
import { executePlugins } from '../lib/executePlugins';
import { generateFiles } from '../lib/generateFiles';
import { promptQuestions } from '../lib/promptQuestions';

/**
 * Non-interactive, accepts answers and generates package
 * @param template The loaded template
 * @param answers All provided answers
 */
export const generate = async <Answers>(
  template: Template<Answers>,
  answers: Answers
) => {
  try {
    await generateFiles(template, answers);
    await executePlugins(template, answers);
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
    const answers = await promptQuestions(template);
    return await generate(template, answers);
  } catch (error) {
    throw error;
  }
};
