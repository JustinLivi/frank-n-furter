import { Template } from '../interfaces/template';
import { executePlugin, executePlugins } from './executePlugins';

const answers = {};
const template: Template<typeof answers> = {
  questions: []
};

describe('executePlugin', () => {
  it('should return a function which can be used to evaluate standard config options', () => {
    expect(executePlugin(answers, template)).toBeFunction();
  });

  it('should execute a plugin', async () => {
    const plugin = jest.fn();
    const execute = executePlugin(answers, template);
    await execute({ name: 'plugin-name', config: plugin });
    expect(plugin).toBeCalledWith(answers, template);
  });

  it('should execute plugin hooks', async () => {
    const preplugin = jest.fn();
    const postplugin = jest.fn();
    const localTemplate: Template<typeof answers> = {
      hooks: {
        preplugin,
        postplugin
      },
      questions: []
    };
    const execute = executePlugin(answers, localTemplate);
    await execute({ name: 'plugin-name', config: () => 'plugin-response' });
    expect(preplugin).toBeCalledWith('plugin-name', answers, localTemplate);
    expect(postplugin).toBeCalledWith(
      'plugin-name',
      'plugin-response',
      answers,
      localTemplate
    );
  });

  it('should reject on error', () => {
    const execute = executePlugin(answers, template);
    const promise = execute({
      name: 'plugin-name',
      config: () => {
        throw new Error();
      }
    });
    return expect(promise).toReject();
  });
});

describe('executePlugins', () => {
  it('should do nothing on no plugins or hooks', async () => {
    await executePlugins(answers, template);
  });

  it('should execute a plugin', async () => {
    const plugin = jest.fn();
    const localTemplate: Template<typeof answers> = {
      plugins: [{ name: 'plugin-name', config: plugin }],
      questions: []
    };
    await executePlugins(answers, localTemplate);
    expect(plugin).toBeCalledWith(answers, localTemplate);
  });

  it('should execute plugins hooks', async () => {
    const preplugins = jest.fn();
    const postplugins = jest.fn();
    const localTemplate: Template<typeof answers> = {
      hooks: {
        preplugins,
        postplugins
      },
      questions: []
    };
    await executePlugins(answers, localTemplate);
    expect(preplugins).toBeCalledWith(answers, localTemplate);
    expect(postplugins).toBeCalledWith(answers, localTemplate);
  });

  it('should reject on error', () => {
    const localTemplate: Template<typeof answers> = {
      plugins: [
        {
          name: 'plugin-name',
          config: () => {
            throw new Error();
          }
        }
      ],
      questions: []
    };
    const promise = executePlugins(answers, localTemplate);
    return expect(promise).toReject();
  });
});
