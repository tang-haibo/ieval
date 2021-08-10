import {Interpreter} from './index';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import jsdom from 'jsdom';
const dom = new jsdom.JSDOM(`<html><head></head><body></body></html>`);

const func = `
  function main(a, b, c) {
    return c(a + b);
  }
`;

const funcError = `
  function main() {
    throw new Error('error');
  }
`;

const funcLogicalExpression = `
  function main(a, b) {
    return a || b;
  }
`;

const open = (file: string): string => {
  return readFileSync(resolve(__dirname, file), 'utf8');
}

describe('[Scope]', () => {
  it('Function and param', () => {
    const interpreter = new Interpreter(dom.window);
    interpreter.evaluate(func);
    const module = interpreter.getWindow();
    expect(module.main(1,2,(num: number) => num + 1)).toBe(4);
  });

  it('Function error', () => {
    const interpreter = new Interpreter(dom.window);
    interpreter.evaluate(funcError);
    const module = interpreter.getWindow();
    expect(() => module.main()).toThrow('error');
  });

  it('Function funcLogicalExpression', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(funcLogicalExpression);
    const module = interpreter.getWindow();
    expect(module.main(1, 2)).toBe(1);
  });

  it('echarts lib', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(open('../../../example/echart.js'));
    const module = interpreter.getWindow();
    expect(module.echarts).toBeDefined();
  });

  it('jquery lib', () => {
    /**
     * jquery 对象需要大量兼容上下文变量
     * 可使用 @taro/runtime 兼容运行时
     */
    const dom = new jsdom.JSDOM(`<html><head></head><body></body></html>`);
    const interpreter = new Interpreter(dom.window);
    interpreter.evaluate(open('../../../example/jquery.js'));
    const module = interpreter.getWindow();
    expect(module.$).toBeDefined();
  });

});