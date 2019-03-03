import { outputJSON } from 'fs-extra';
import { resolve } from 'path';

import { GeneratorFunction, TemplatePluginConfig } from '../../interfaces/template';
import { evaluateOption } from '../../lib/evaluateOption';
import { ofExtractor } from '../../lib/utils';
import { NpmPackageConfig } from './interfaces';

/**
 * Evaluate the core plugin logic
 * @param config the full plugin configuration
 */
const evaluatePlugin = <Answers>(
  config: NpmPackageConfig<Answers>
): GeneratorFunction<Answers, NpmPackageConfig<Answers>> => async (
  answers,
  template
) => {
  const evaluate = evaluateOption(answers, template);
  const configValue = await evaluate(config);
  const cwd = await ofExtractor(configValue)
    .sub('cwd')
    .map(evaluate)
    .value(Promise.resolve('/'));
  await outputJSON(resolve(cwd, './package.json'), configValue);
  return configValue;
};

/**
 * Accepts a top-level config and return a plugin configuration
 * @param config the full plugin configuration
 * @param name optionally specify a plugin name. Default is 'npm-package'
 */
export const npmPackage = <Answers>(
  config: NpmPackageConfig<Answers>,
  name: string = 'npm-package'
): TemplatePluginConfig<Answers, NpmPackageConfig<Answers>> => ({
  name,
  config: evaluatePlugin(config)
});
