import { outputJSON } from 'fs-extra';
import { isNil, mapValues, pick, pickBy } from 'lodash';
import { resolve } from 'path';

import { GeneratorFunction, StringArrayConfig, StringConfig, Template, TemplatePlugin } from '../../interfaces/template';
import { evaluateOption, evaluateOptionArray } from '../../lib/evaluateOption';
import { awaitMap, ofExtractor, stringLiteralArray } from '../../lib/utils';
import { NpmPackageConfig, NpmPackageObjectConfig } from './interfaces';

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
  const filteredDict = pickBy<StringConfig<Answers>>(
    simpleDict,
    value => !isNil(value)
  );
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
  const filteredDict = pickBy<StringArrayConfig<Answers>>(
    simpleDict,
    value => !isNil(value)
  );
  const promiseMap = mapValues(filteredDict, evaluate);
  return awaitMap(promiseMap);
};

const evaluatePlugin = <Answers>(
  config: NpmPackageConfig<Answers>
): GeneratorFunction<Answers, NpmPackageConfig<Answers>> => async (
  answers,
  template
) => {
  const evaluate = evaluateOption(answers, template);
  const configValue = await evaluate(config);
  const [simpleValues, simpleArrayValues] = await Promise.all([
    extractSimpleValues(configValue, answers, template),
    extractSimpleArrayValues(configValue, answers, template)
  ]);
  const cwd = await ofExtractor(configValue)
    .sub('cwd')
    .map(evaluate)
    .value(Promise.resolve('/'));
  const packageContents = {
    ...simpleValues,
    ...simpleArrayValues
  };
  await outputJSON(resolve(cwd, './package.json'), packageContents);
  return packageContents;
};

export const npmPackage = <Answers>(
  config: NpmPackageConfig<Answers>
): TemplatePlugin<Answers, NpmPackageConfig<Answers>> => ({
  name: 'npm-package',
  config: evaluatePlugin(config)
});
