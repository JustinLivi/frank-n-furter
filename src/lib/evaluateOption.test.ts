import { Template } from '../interfaces/template';
import { evaluateOption } from './evaluateOption';

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
    expect(await evaluateOption(answers, template)(() => [])).toEqual([]);
  });

  it('should pass through promises return from functional options', () => {
    const promise = new Promise<[]>(resolve => {
      resolve([]);
    });
    expect(evaluateOption(answers, template)(() => promise)).toEqual(promise);
  });

  it('should return a promise that resolves with the result of a non-promise', async () => {
    const promise = evaluateOption(answers, template)([]);
    expect(promise).toBeInstanceOf(Promise);
    expect(await promise).toEqual([]);
  });

  it('should reject on thrown errors', () => {
    expect(
      evaluateOption(answers, template)(() => {
        throw new Error();
      })
    ).toReject();
  });

  it('should evaluate nested options', () => {
    const evaluate = evaluateOption(answers, template);
    const option = jest.fn();
    evaluate([option]);
    expect(option).toBeCalledWith(answers, template);
  });

  it('should resolve nested promises', async () => {
    expect(
      await evaluateOption(answers, template)([Promise.resolve(true)])
    ).toEqual([true]);
  });

  it('should resolve complex promise array structures', async () => {
    expect(
      await evaluateOption(answers, template)(() =>
        Promise.resolve([
          false,
          Promise.resolve(true),
          () => Promise.resolve('value')
        ])
      )
    ).toEqual([false, true, 'value']);
  });

  it('should handle complex promise mixed map types', async () => {
    expect(
      await evaluateOption(answers, template)({
        prop1: Promise.resolve('value1'),
        prop2: Promise.resolve([
          false,
          Promise.resolve(true),
          () => Promise.resolve('value2')
        ]),
        prop3: Promise.resolve({
          nested: () => Promise.resolve('value3')
        })
      })
    ).toEqual({
      prop1: 'value1',
      prop2: [false, true, 'value2'],
      prop3: {
        nested: 'value3'
      }
    });
  });
});
