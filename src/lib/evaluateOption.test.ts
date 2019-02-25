import { Template } from '../interfaces/template';
import { evaluateOption, evaluateOptionArray } from './evaluateOption';

const answers = {};
const template: Template<typeof answers> = {
  questions: []
};

describe('evaluateOption', () => {
  it('should return a function which can be used to evaluate standard config options', () => {
    expect(evaluateOption(answers, template)).toBeFunction();
  });

  it('should invoke option with answers and template if option is function', () => {
    const evaluate = evaluateOption(answers, template);
    const option = jest.fn();
    evaluate(option);
    expect(option).toBeCalledWith(answers, template);
  });

  it('should return a promise that resolves with the result of a functional option', async () => {
    expect(await evaluateOption(answers, template)(() => true)).toBeTrue();
  });

  it('should pass through promises return from functional options', () => {
    const promise = new Promise(resolve => {
      resolve();
    });
    expect(evaluateOption(answers, template)(() => promise)).toEqual(promise);
  });

  it('should return a promise that resolves with the result of a non-promise', async () => {
    const promise = evaluateOption(answers, template)(true);
    expect(promise).toBeInstanceOf(Promise);
    expect(await promise).toBeTrue();
  });

  it('should reject on thrown errors', () => {
    expect(
      evaluateOption(answers, template)(() => {
        throw new Error();
      })
    ).toReject();
  });
});

describe('evaluateOptionArray', () => {
  it('should return a function which can be used to evaluate standard config options', () => {
    expect(evaluateOptionArray(answers, template)).toBeFunction();
  });

  it('should invoke option with answers and template if option is function', () => {
    const evaluate = evaluateOptionArray(answers, template);
    const option = jest.fn();
    evaluate(option);
    expect(option).toBeCalledWith(answers, template);
  });

  it('should return a promise that resolves with the result of a functional option', async () => {
    expect(await evaluateOptionArray(answers, template)(() => [])).toEqual([]);
  });

  it('should pass through promises return from functional options', () => {
    const promise = new Promise<[]>(resolve => {
      resolve([]);
    });
    expect(evaluateOptionArray(answers, template)(() => promise)).toEqual(
      promise
    );
  });

  it('should return a promise that resolves with the result of a non-promise', async () => {
    const promise = evaluateOptionArray(answers, template)([]);
    expect(promise).toBeInstanceOf(Promise);
    expect(await promise).toEqual([]);
  });

  it('should reject on thrown errors', () => {
    expect(
      evaluateOptionArray(answers, template)(() => {
        throw new Error();
      })
    ).toReject();
  });

  it('should evaluate nested options', () => {
    const evaluate = evaluateOptionArray(answers, template);
    const option = jest.fn();
    evaluate([option]);
    expect(option).toBeCalledWith(answers, template);
  });

  it('should resolve nested promises', async () => {
    expect(
      await evaluateOptionArray(answers, template)([Promise.resolve(true)])
    ).toEqual([true]);
  });

  it('should resolve complex promise structures', async () => {
    expect(
      await evaluateOptionArray(answers, template)(() =>
        Promise.resolve([
          false,
          Promise.resolve(true),
          () => Promise.resolve('value')
        ])
      )
    ).toEqual([false, true, 'value']);
  });
});
