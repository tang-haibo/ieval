import {Interpreter, internalEval, InternalInterpreterReflection} from './index';
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

  it('Eval Function funcLogicalExpression', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(`
      eval("function main(a,b) { return a + b; }");
      eval("");
      eval("var a = 1;", false);
    `);
    try {
      interpreter.evaluate(`
        eval("aaa()");
      `);
      internalEval(0 as unknown as InternalInterpreterReflection);
    } catch(e) {
    }
    const module = interpreter.getWindow();
    expect(module.main(1,2)).toBe(3);
  });

  it('new Function funcLogicalExpression', () => {
    const interpreter = new Interpreter({}, {
      rootContext: {},
    });
    interpreter.setExecTimeout(1000);
    interpreter.evaluate(`
      var main = new Function("a", "b", "return a + b;");
    `);
    expect(interpreter.getExecutionTime()).toBeLessThan(200);
    const module = interpreter.getWindow();
    expect(module.main(1,2)).toBe(3);
  });

  it('WithStatement', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(`
        var a, x, y;
        var r = 10;
        with (Math) {
          a = PI * r * r;
          x = r * cos(PI);
          y = r * sin(PI / 2);
        }
    `);
  });

  it('debug', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(`
        function main() {
          debug;
        }
    `);
  });


  it('operation', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(`
      function main1() {
        var a = 10;
        var b = 20;
        return a <= b;
      }
      function main2() {
        return 1 >> 1;
      }
      function main3() {
        return 1 >>> 1;
      }
      function main4() {
        return 3 ** 4;
      }
    `);
    const module = interpreter.getWindow();
    expect(module.main1()).toBe(true);
    expect(module.main2()).toBe(0);
    expect(module.main3()).toBe(0);
    expect(module.main4()).toBe(81);
  });


  it('echarts lib', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(open('../../../example/echart.js'));
    const module = interpreter.getWindow();
    expect(module.echarts).toBeDefined();
  });

  it('vue lib', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(open('../../../example/vue.js'));
    const module = interpreter.getWindow();
    expect(module.Vue).toBeDefined();
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