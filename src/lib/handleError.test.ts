import { Template } from '../interfaces/template';
import { handleError, handleErrorPlugin } from './handleError';

const error = new Error();
const answers = {};
const template: Template<typeof answers> = {
  questions: []
};

describe('handleErrorPlugin', () => {
  it('should return a function which can be used to execute a plugin error handler', () => {
    expect(handleErrorPlugin(error, answers, template)).toBeFunction();
  });

  it('should execute a plugin error handler', async () => {
    const plugin = jest.fn();
    const errorHandler = jest.fn();
    const handle = handleErrorPlugin(error, answers, template);
    await handle({
      handleError: errorHandler,
      name: 'plugin-name',
      config: plugin
    });
    expect(errorHandler).toBeCalledWith(error, answers, template);
  });

  it('should reject on error', () => {
    const execute = handleErrorPlugin(error, answers, template);
    const promise = execute({
      name: 'plugin-name',
      handleError: () => {
        throw new Error();
      },
      config: jest.fn()
    });
    return expect(promise).toReject();
  });
});

describe('handleError', () => {
  it('should do nothing on no defined plugins', async () => {
    const localTemplate: Template<typeof answers> = {
      questions: []
    };
    await handleError(error, answers, localTemplate);
  });

  it('should execute plugin error handlers', async () => {
    const errorHandler = jest.fn();
    const localTemplate: Template<typeof answers> = {
      plugins: [
        {
          handleError: errorHandler,
          name: 'plugin-name',
          config: jest.fn()
        }
      ],
      questions: []
    };
    await handleError(error, answers, localTemplate);
    expect(errorHandler).toBeCalledWith(error, answers, localTemplate);
  });

  it('should reject on error', () => {
    const promise = handleError(error, answers, {
      plugins: [
        {
          handleError: () => {
            throw new Error();
          },
          name: 'plugin-name',
          config: jest.fn()
        }
      ],
      questions: []
    });
    return expect(promise).toReject();
  });
});
