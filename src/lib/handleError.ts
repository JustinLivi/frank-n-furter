import { map } from 'lodash';

import { Template, TemplatePluginConfig } from '../interfaces/template';
import { execNullable } from './utils';

/**
 * Returns a function which executes a plugin error handler
 * based on the configuration and answers
 * @param error The error to handle
 * @param answers All provided answers
 * @param template The overall template
 */
export const handleErrorPlugin = <Answers>(
  error: Error,
  answers: Answers,
  template: Template<Answers>
) =>
  /**
   * Executes a plugin error handler based on the configuration and answers
   * @param plugin A plugin configuration
   */
  async <PluginType>({
    handleError: handleErrorConfig
  }: TemplatePluginConfig<Answers, PluginType>) => {
    try {
      const execHandleErrorConfig = execNullable(handleErrorConfig);
      await execHandleErrorConfig(error, answers, template);
    } catch (error) {
      throw error;
    }
  };

/**
 * Executes plugin handlers based on the configuration and answers
 * @param error The error to handle
 * @param template The overall template
 * @param answers All provided answers
 */
export const handleError = async <Answers>(
  error: Error,
  answers: Answers,
  template: Template<Answers>
) => {
  try {
    const { plugins = [] } = template;
    const execHandleErrorPlugin = handleErrorPlugin(error, answers, template);
    await Promise.all(map(plugins, execHandleErrorPlugin));
  } catch (error) {
    throw error;
  }
};
