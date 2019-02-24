import { map } from 'lodash';

import { Template, TemplatePlugin } from '../interfaces/template';
import { evaluateOption } from './evaluateOption';

/**
 * Returns a function which executes a plugin
 * based on the configuration and answers
 * @param answers All provided answers
 * @param template The overall template
 */
export const executePlugin = <Answers>(
  answers: Answers,
  template: Template<Answers>
) =>
  /**
   * Executes a plugin based on the configuration and answers
   * @param plugin A plugin configuration
   */
  async <PluginType>({ name, config }: TemplatePlugin<Answers, PluginType>) => {
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
  answers: Answers,
  template: Template<Answers>
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
    const execute = executePlugin(answers, template);
    await Promise.all(map(plugins, execute));
    if (postplugins) {
      await postplugins(answers, template);
    }
  } catch (error) {
    throw error;
  }
};
