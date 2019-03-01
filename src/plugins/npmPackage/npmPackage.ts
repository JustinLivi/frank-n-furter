import { outputJSON } from 'fs-extra';
import { isNil, mapValues, pick, pickBy } from 'lodash';
import { resolve } from 'path';

import {
  GeneratorFunction,
  StringArrayConfig,
  StringConfig,
  Template,
  TemplatePluginConfig,
} from '../../interfaces/template';
import { evaluateOption, evaluateOptionArray } from '../../lib/evaluateOption';
import { awaitMap, ofExtractor, stringLiteralArray } from '../../lib/utils';
import { NpmPackageConfig, NpmPackageObjectConfig } from './interfaces';

const notNil = <Value>(value: Value) => !isNil(value);

/**
 * Extracts simple string values
 * @param config
 * @param answers
 * @param template
 */
const extractSimpleValues = async <Answers>(
  config: NpmPackageObjectConfig<Answers>,
  answers: Answers,
  template: Template<Answers>
) => {
  const evaluate = evaluateOption(answers, template);
  const simpleValues = stringLiteralArray([
    'name',
    'version',
    'description',
    'homepage',
    'license',
    'main',
    'browser'
  ]);
  const simpleDict = pick(config, simpleValues);
  const filteredDict = pickBy<StringConfig<Answers>>(simpleDict, notNil);
  const promiseMap = mapValues(filteredDict, evaluate);
  return awaitMap(promiseMap);
};

/**
 * Extracts simple string array values
 * @param config
 * @param answers
 * @param template
 */
const extractSimpleArrayValues = async <Answers>(
  config: NpmPackageObjectConfig<Answers>,
  answers: Answers,
  template: Template<Answers>
) => {
  const evaluate = evaluateOptionArray(answers, template);
  const simpleArrayValues = stringLiteralArray([
    'keywords',
    'files',
    'peerdependencies',
    'optionalDependencies',
    'os',
    'cpu'
  ]);
  const simpleDict = pick(config, simpleArrayValues);
  const filteredDict = pickBy<StringArrayConfig<Answers>>(simpleDict, notNil);
  const promiseMap = mapValues(filteredDict, evaluate);
  return awaitMap(promiseMap);
};

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
  const [simpleValues, simpleArrayValues] = await Promise.all([
    extractSimpleValues(configValue, answers, template),
    extractSimpleArrayValues(configValue, answers, template)
  ]);
  const packageContents = {
    ...simpleValues,
    ...simpleArrayValues
  };
  await outputJSON(resolve(cwd, './package.json'), packageContents);
  return packageContents;
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
