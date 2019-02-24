import { isNil, mapValues, pick, pickBy } from 'lodash';

import { GeneratorFunction, StringArrayConfig, StringConfig, Template, TemplatePlugin } from '../../interfaces/template';
import { evaluateOption, evaluateOptionArray } from '../../lib/evaluateOption';
import { awaitMap, stringLiteralArray } from '../../lib/utils';
import { NpmPackageConfig, NpmPackageObjectConfig } from './interfaces';

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
    'bundledDependencies',
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
  return {
    ...simpleValues,
    ...simpleArrayValues
  };
};

export const npmPackage = <Answers>(
  config: NpmPackageConfig<Answers>
): TemplatePlugin<Answers, NpmPackageConfig<Answers>> => ({
  name: 'npm-package',
  config: evaluatePlugin(config)
});
