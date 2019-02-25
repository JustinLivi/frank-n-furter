import { createPromptModule } from 'inquirer';

import { Template } from '../interfaces/template';
import { execNullable } from './utils';

const prompt = createPromptModule();

/**
 * Run interactive prompts for answers with pre and post question hooks
 * @param template The loaded template
 */
export const promptQuestions = async <Answers>(template: Template<Answers>) => {
  try {
    const { hooks = {} } = template;
    const { prequestions } = hooks;
    // prequestions hook
    const processedTemplate = await execNullable(prequestions, template)(
      template
    );
    const { questions, hooks: processedHooks = {} } = processedTemplate;
    const { postquestions } = processedHooks;
    const answers = await prompt<Answers>(questions);
    // postquestions hook
    return execNullable(postquestions, answers)(answers, template);
  } catch (error) {
    throw error;
  }
};
