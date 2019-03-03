import { ConfigOptionUnion } from '../../interfaces/template';

export interface NpmBugsConfig {
  url?: string;
  email?: string;
}

export interface NpmPersonConfig {
  name: string;
  email?: string;
  url?: string;
}

export type NpmContributorsConfig = NpmPersonConfig[];
export type NpmManConfig = string[];

export interface NpmDirectoriesConfig {
  lib?: string;
  bin?: string;
  man?: string;
  doc?: string;
  example?: string;
  test?: string;
}

export interface NpmRepositoryObjectConfig {
  type: string;
  url: string;
  directory?: string;
}

export type NpmObjectConfig = NpmRepositoryObjectConfig | string;

export interface NpmDependencyConfig {
  packages: string[];
  install?: boolean;
  noOptional?: boolean;
  ignoreScripts?: boolean;
}

export interface NpmPackageObjectConfig {
  cwd?: string;
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  bugs?: NpmBugsConfig;
  license?: string;
  author?: NpmPersonConfig;
  contributors?: NpmContributorsConfig;
  files?: string[];
  main?: string;
  browser?: string;
  bin?: Map<string, string>;
  man?: NpmManConfig;
  directories?: NpmDirectoriesConfig;
  repository?: NpmRepositoryObjectConfig;
  config?: Map<string, string>;
  /**
   * npm scripts to add
   */
  scripts?: Map<string, string>;
  /**
   * npm dependencies to install
   */
  dependencies?: NpmDependencyConfig;
  /**
   * npm devDependencies to install
   */
  devDependencies?: NpmDependencyConfig;
  bundledDependencies?: NpmDependencyConfig;
  peerdependencies?: string[];
  optionalDependencies?: string[];
  engines?: Map<string, string>;
  os?: string[];
  cpu?: string[];
  private?: boolean;
  publishConfig?: Map<string, string>;
}

/**
 * npm package plugin configuration
 */
export type NpmPackageConfig<Answers> = ConfigOptionUnion<
  Answers,
  NpmPackageObjectConfig
>;
