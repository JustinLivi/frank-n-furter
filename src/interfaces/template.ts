import { Questions } from 'inquirer';

export type GeneratorFunction<Answers, Result> = (
  answers: Answers,
  template: Template<Answers>
) => Result | Promise<Result>;

export type PreHook<Answers, Result> = (
  itemName: string,
  answers: Answers,
  template: Template<Answers>
) => Result | Promise<Result>;

export type PostPluginHook<Answers> = <Result>(
  itemName: string,
  pluginOutput: Result,
  answers: Answers,
  template: Template<Answers>
) => Result | Promise<Result>;

export type ConfigOption<Answers, Result> =
  | Result
  | GeneratorFunction<Answers, Result>;

export type ArrayConfig<Answers, Type> =
  | ConfigOption<Answers, Type[]>
  | Array<ConfigOption<Answers, Type>>;
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
  /**
   * Lifecycle hook called before any questions have been asked.
   * Opportunity to change template before execution.
   * @param template The template to be executed
   */
  prequestions?: (template: Template<Answers>) => Template<Answers>;
  /**
   * Lifecycle hook called after all questions have been answered.
   * Opportunity to change answers based on the values of other answers.
   */
  postquestions?: GeneratorFunction<Answers, Answers>;
  /**
   * Lifecycle hook called before any files have been generated.
   */
  prefiles?: GeneratorFunction<Answers, void>;
  /**
   * Lifecycle hook called before each file is generated.
   */
  prefile?: PreHook<Answers, void>;
  /**
   * Lifecycle hook called after each file is generated.
   */
  postfile?: PreHook<Answers, void>;
  /**
   * Lifecycle hook called after all files have been generated.
   */
  postfiles?: GeneratorFunction<Answers, void>;
  /**
   * Lifecycle hook called before any plugins have been executed.
   */
  preplugins?: GeneratorFunction<Answers, void>;
  /**
   * Lifecycle hook called before each plugin is executed.
   */
  preplugin?: PreHook<Answers, void>;
  /**
   * Lifecycle hook called after each plugin is executed.
   */
  postplugin?: PostPluginHook<Answers>;
  /**
   * Lifecycle hook called after all plugins have been executed.
   */
  postplugins?: GeneratorFunction<Answers, void>;
}

export type ErrorHandler<Answers> = (
  error: Error,
  answers: Answers,
  template: Template<Answers>
) => void | Promise<void>;

export interface TemplatePluginConfig<Answers, Type> {
  name: string;
  config: ConfigOption<Answers, Type>;
  handleError?: ErrorHandler<Answers>;
}

export type TemplatePlugin<Type> = <Answers>(
  config: Type,
  name: string
) => TemplatePluginConfig<Answers, Type>;

export interface Template<Answers> {
  /**
   * [inquirer](https://www.npmjs.com/package/inquirer) questions
   */
  questions: Questions<Answers>;
  /**
   * Hook to handle any errors
   */
  handleError?: ErrorHandler<Answers>;
  /**
   * Files to generate
   */
  files?: ConfigOption<Answers, Array<FileConfig<Answers>>>;
  /**
   * Plugins
   */
  plugins?: Array<TemplatePluginConfig<Answers, any>>;
  /**
   * Lifecycle hooks
   */
  hooks?: LifecycleHooksConfig<Answers>;
}
