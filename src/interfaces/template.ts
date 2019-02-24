import { Questions } from 'inquirer';

export type GeneratorFunction<Answers, Result> = (
  answers: Answers
) => Result | Promise<Result>;

export type ConfigOption<Answers, Result> =
  | Result
  | GeneratorFunction<Answers, Result>;

export type ArrayConfig<Answers, Type> =
  | ConfigOption<Answers, Type[]>
  | ConfigOption<Answers, Type>[];
export type StringConfig<Answers> = ConfigOption<Answers, string>;
export type StringArrayConfig<Answers> = ArrayConfig<Answers, string>;

export interface MapItemConfig<Answers> {
  key: StringConfig<Answers>;
  value: StringConfig<Answers>;
}

export type MapConfig<Answers> = ConfigOption<
  Answers,
  ArrayConfig<Answers, MapItemConfig<Answers>>
>;

export interface NpmBugsObjectConfig<Answers> {
  url?: StringConfig<Answers>;
  email?: StringConfig<Answers>;
}

export type NpmBugsConfig<Answers> = ConfigOption<
  Answers,
  NpmBugsObjectConfig<Answers> | StringConfig<Answers>
>;

export interface NpmPersonObjectConfig<Answers> {
  name: StringConfig<Answers>;
  email?: StringConfig<Answers>;
  url?: StringConfig<Answers>;
}

export type NpmPersonConfig<Answers> = ConfigOption<
  Answers,
  NpmPersonObjectConfig<Answers> | StringConfig<Answers>
>;

export type NpmContributorsConfig<Answers> = ArrayConfig<
  Answers,
  NpmPersonConfig<Answers>
>;

export type NpmManConfig<Answers> = ConfigOption<
  Answers,
  StringArrayConfig<Answers> | StringConfig<Answers>
>;

export interface NpmDirectoriesObjectConfig<Answers> {
  lib?: StringConfig<Answers>;
  bin?: StringConfig<Answers>;
  man?: StringConfig<Answers>;
  doc?: StringConfig<Answers>;
  example?: StringConfig<Answers>;
  test?: StringConfig<Answers>;
}

export type NpmDirectoriesConfig<Answers> = ConfigOption<
  Answers,
  NpmDirectoriesObjectConfig<Answers>
>;

export interface NpmRepositoryObjectConfig<Answers> {
  type: StringConfig<Answers>;
  url: StringConfig<Answers>;
  directory?: StringConfig<Answers>;
}

export type NpmObjectConfig<Answers> = ConfigOption<
  Answers,
  NpmRepositoryObjectConfig<Answers> | StringConfig<Answers>
>;

export interface NpmPackageConfig<Answers> {
  name?: StringConfig<Answers>;
  version?: StringConfig<Answers>;
  description?: StringConfig<Answers>;
  keywords?: StringArrayConfig<Answers>;
  homepage?: StringConfig<Answers>;
  bugs?: NpmBugsConfig<Answers>;
  license?: StringConfig<Answers>;
  author?: NpmPersonConfig<Answers>;
  contributors?: NpmContributorsConfig<Answers>;
  files?: StringArrayConfig<Answers>;
  main?: StringConfig<Answers>;
  browser?: StringConfig<Answers>;
  bin?: MapConfig<Answers>;
  man?: NpmManConfig<Answers>;
  directories?: NpmDirectoriesConfig<Answers>;
  repository?: NpmRepositoryObjectConfig<Answers>;
  config?: MapConfig<Answers>;
  /**
   * npm scripts to add
   */
  scripts?: MapConfig<Answers>;
  /**
   * npm dependencies to install
   */
  dependencies?: StringArrayConfig<Answers>;
  /**
   * npm devDependencies to install
   */
  devDependencies?: StringArrayConfig<Answers>;
  peerdependencies?: StringArrayConfig<Answers>;
  bundledDependencies?: StringArrayConfig<Answers>;
  optionalDependencies?: StringArrayConfig<Answers>;
  engines?: MapConfig<Answers>;
  os?: StringArrayConfig<Answers>;
  cpu?: StringArrayConfig<Answers>;
  private?: ConfigOption<Answers, boolean>;
  publishConfig?: MapConfig<Answers>;
}

/**
 * A file configuration
 */
export interface FileConfig<Answers> {
  /**
   * the output path of the file
   */
  path: StringConfig<Answers>;
  /**
   * the contents of the file
   */
  contents: StringConfig<Answers>;
}

export interface LifecycleHooksConfig<Answers> {
  preprocess: (template: Template<Answers>) => Template<Answers>;
  postquestions: GeneratorFunction<Answers, Answers>;
  prepackage: GeneratorFunction<Answers, void>;
  prefiles: GeneratorFunction<Answers, void>;
  postgeneration: GeneratorFunction<Answers, void>;
}

export interface Template<Answers> {
  /**
   * [inquirer](https://www.npmjs.com/package/inquirer) questions
   */
  questions: Questions<Answers>;
  /**
   * npm package configuration
   */
  package: ConfigOption<Answers, NpmPackageConfig<Answers>>;
  /**
   * Files to generate
   */
  files?: ConfigOption<Answers, FileConfig<Answers>[]>;
  /**
   * Lifecycle hooks
   */
  hooks?: LifecycleHooksConfig<Answers>;
}
