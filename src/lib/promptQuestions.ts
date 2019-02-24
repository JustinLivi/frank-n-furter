import { createPromptModule } from 'inquirer';

import { Template } from '../interfaces/template';

const prompt = createPromptModule();

/**
 * Run interactive prompts for answers with pre and post question hooks
 * @param template The loaded template
 */
export const promptQuestions = async <Answers>(template: Template<Answers>) => {
  try {
    const { hooks } = template;
    const prequestions = hooks && hooks.prequestions;
    const processedTemplate = prequestions
      ? await prequestions(template)
      : template;
    const { questions, hooks: processedHooks } = processedTemplate;
    const answers = await prompt<Answers>(questions);
    const postquestions = processedHooks && processedHooks.postquestions;
    return postquestions ? await postquestions(answers, template) : answers;
  } catch (error) {
    throw error;
  }
};
