import { ArrayConfig, ConfigOption, MapConfig, StringArrayConfig, StringConfig } from '../../interfaces/template';

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

export interface NpmDependencyObjectConfig<Answers> {
  packages: StringArrayConfig<Answers>;
  install?: ConfigOption<Answers, boolean>;
  noOptional?: ConfigOption<Answers, boolean>;
  ignoreScripts?: ConfigOption<Answers, boolean>;
}

export type NpmDependencyConfig<Answers> = ConfigOption<
  Answers,
  NpmDependencyObjectConfig<Answers>
>;

export interface NpmPackageObjectConfig<Answers> {
  cwd?: StringConfig<Answers>;
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
  dependencies?: NpmDependencyConfig<Answers>;
  /**
   * npm devDependencies to install
   */
  devDependencies?: NpmDependencyConfig<Answers>;
  bundledDependencies?: NpmDependencyConfig<Answers>;
  peerdependencies?: StringArrayConfig<Answers>;
  optionalDependencies?: StringArrayConfig<Answers>;
  engines?: MapConfig<Answers>;
  os?: StringArrayConfig<Answers>;
  cpu?: StringArrayConfig<Answers>;
  private?: ConfigOption<Answers, boolean>;
  publishConfig?: MapConfig<Answers>;
}

/**
 * npm package plugin configuration
 */
export type NpmPackageConfig<Answers> = ConfigOption<
  Answers,
  NpmPackageObjectConfig<Answers>
>;
