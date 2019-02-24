import { map } from 'lodash';

import { Template, TemplatePlugin } from '../interfaces/template';
import { evaluateOption } from './evaluateOption';

/**
 * Executes a file based on the configuration and answers
 * @param template The overall template
 * @param plugin A plugin configuration
 * @param answers All provided answers
 */
export const executePlugin = async <Answers, PluginType>(
  template: Template<Answers>,
  { name, config }: TemplatePlugin<Answers, PluginType>,
  answers: Answers
) => {
  try {
    const { hooks = {} } = template;
    const { preplugin, postplugin } = hooks;
    const evaluate = evaluateOption(answers, template);
    if (preplugin) {
      await preplugin(name, answers, template);
    }
    const contentsValue = await evaluate(config);
    if (postplugin) {
      await postplugin(name, contentsValue, answers, template);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Executes plugins based on the configuration and answers
 * @param template The overall template
 * @param answers All provided answers
 */
export const executePlugins = async <Answers>(
  template: Template<Answers>,
  answers: Answers
) => {
  try {
    const { hooks = {}, plugins } = template;
    if (!plugins) {
      return;
    }
    const { preplugins, postplugins } = hooks;
    if (preplugins) {
      await preplugins(answers, template);
    }
    await Promise.all(
      map(plugins, file => executePlugin(template, file, answers))
    );
    if (postplugins) {
      await postplugins(answers, template);
    }
  } catch (error) {
    throw error;
  }
};
