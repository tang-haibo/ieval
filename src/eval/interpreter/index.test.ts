import {Interpreter, internalEval, internalFunction, InternalInterpreterReflection} from './index';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import jsdom from 'jsdom';
const dom = new jsdom.JSDOM(`<html><head></head><body></body></html>`);

function createOperation (operation: string, init: string = '10') {
  return `
    function main() {
      var num = ${init};
      num ${operation};
      return num;
    }
  `;
}

function defineMain(code: string) {
  const interpreter = new Interpreter({});
  interpreter.evaluate(code);
  return interpreter.getWindow().main;
}

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
    expect(() => module.main()).toThrow(Error);
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
      eval("function func(a,b) { return a + b; }");
      eval("");
      eval("var a = 1;", false);
      eval("var obj = { main: function(a, b){ return func(a, b); } }");
      obj.main(1, 2);
    `);
    try {
      interpreter.evaluate(`
        eval("aaa()");
      `);
      internalEval(0 as unknown as InternalInterpreterReflection);
    } catch(e) {
    }
    const module = interpreter.getWindow();
    expect(module.obj.main(1,2)).toBe(3);
  });

  it('new Function funcLogicalExpression', () => {
    const interpreter = new Interpreter({}, {
      rootContext: {},
    });
    interpreter.setExecTimeout(1000);
    interpreter.evaluate(`
      var func = new Function("a", "b", "return a + b;");
      function main(a, b) {
        return func(a, b);
      }
      var obj = {
        main: main,
      }
      obj.main(1, 2);
    `);
    expect(interpreter.getExecutionTime()).toBeLessThan(200);
    const module = interpreter.getWindow();
    expect(module.obj.main(1,2)).toBe(3);
  });

  it('createCallFunctionGetter', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(`
      var obj = {
        a: 1,
        eval: eval,
        func: Function,
        main: function(a, b) {
          return a + b;
        }
      };
      obj.eval("function func(a, b) { return a + b; }");
      obj.sum = obj.func("a", "b", "return a + b");
      function main(a, b) {
        return obj.main(a, b);
      }
      function objErr() {
        return obj.a();
      }
      function objSum(a, b) {
        return obj.sum(a, b);
      }

      // 假方法
      var jFunc = 1;
      function testErrorFunction() {
        return jFunc();
      }
      var g_eval = eval;
      g_eval("function evalSum(a, b) { return a + b; }");
      
      var newFunc = Function('a', 'b', 'return a+b');

    `);

    expect(() => interpreter.getWindow().objErr()).toThrow(Error);
    expect(interpreter.getWindow().main(1, 2)).toEqual(3);
    expect(interpreter.getWindow().objSum(1, 2)).toEqual(3);
    
    // other
    expect(() => interpreter.getWindow().testErrorFunction()).toThrow(Error);
    expect(interpreter.getWindow().evalSum(1,2)).toEqual(3);
    expect(interpreter.getWindow().newFunc(1,2)).toEqual(3);

  });

  it('functionExpressionHandler', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(`
      var func = function(a, b) {
        return a + b;
      }
      var toString = function() {
        return func.toString();
      }
      var valueOf = function() {
        return func.valueOf();
      }
    `);
    const module = interpreter.getWindow();
    expect(module.toString().includes('function')).toEqual(true);
    expect(module.valueOf()).toEqual(module.func.valueOf());
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

  it('debugger', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(`
        function main() {
          debugger;
        }
    `);
    expect(interpreter.getWindow().main()).toEqual(undefined);
  });

  // 所有运算符检查
  it('operation -=', () => {
    const main = defineMain(createOperation('-= 2',));
    expect(main()).toEqual(8);
  });

  it('operation *=', () => {
    const main = defineMain(createOperation('*= 2',));
    expect(main()).toEqual(20);
  });

  it('operation **=', () => {
    const main = defineMain(createOperation('**= 3',));
    expect(main()).toEqual(1000);
  });

  it('operation /=', () => {
    const main = defineMain(createOperation('/= 2',));
    expect(main()).toEqual(5);
  });

  it('operation %=', () => {
    const main = defineMain(createOperation('%= 10', '22'));
    expect(main()).toEqual(2);
  });

  it('operation <<=', () => {
    const main = defineMain(createOperation('<<= 1', '0b1010'));
    expect(main()).toEqual(20);
  });

  it('operation >>=', () => {
    const main = defineMain(createOperation('>>= 1', '0b1010'));
    expect(main()).toEqual(5);
  });

  it('operation >>>=', () => {
    const main = defineMain(createOperation('>>>= 1', '0b1010'));
    expect(main()).toEqual(5);
  });

  it('operation &=', () => {
    const main = defineMain(createOperation('&= 2'));
    expect(main()).toEqual(2);
  });

  it('operation ^=', () => {
    const main = defineMain(createOperation('^= 2'));
    expect(main()).toEqual(8);
  });
  
  it('try catch throw', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(`
      function main() {
        try {
          var a = 10;
          return a + b;
        } catch(e) {
          throw e;
        }
      }
    `);
    const module = interpreter.getWindow();
    expect(() => module.main()).toThrow(Error);
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

  it('for continue; label:', () => {
    const interpreter = new Interpreter({});
    // 实际执行顺序 j = 1 2 3, 1 2, 跳出, 预期结果: 9
    interpreter.evaluate(`
      function main() {
        var num = 0;
        label:
        for (var i=1; i <= 3; i++) {
          for(var j=1; j <= 3; j++) {
            num += j;
              if (j === 2) {
                continue label;
              }
          }
          num += i;
        }
        return num;
      }
    `);
    const {main} = interpreter.getWindow();
    expect(main()).toEqual(9);
  });

  it('for break label:', () => {
    const interpreter = new Interpreter({});
    // 实际执行顺序 j = 1 2 跳出, 预期结果: 3
    interpreter.evaluate(`
      function main() {
        var num = 0;
        label:
        for (var i=1; i <= 3; i++) {
          for(var j=1; j <= 3; j++) {
            num += j;
              if (j === 2) {
                break label;
              }
          }
          num += i;
        }
        return num;
      }
    `);
    const {main} = interpreter.getWindow();
    expect(main()).toEqual(3);
  });

  it('switch base', () => {
    const interpreter = new Interpreter({});
    // 实际执行顺序 j = 1 2 跳出, 预期结果: 3
    interpreter.evaluate(`
      function main(value) {
        switch(value) {
          case 1:
            return 'switch1';
          case 2:
            break;
          default:
            return 'switch3';
        }
        return 'switch2';
      }
    `);
    const {main} = interpreter.getWindow();
    expect(main(1)).toEqual('switch1');
    expect(main(2)).toEqual('switch2');
    expect(main(3)).toEqual('switch3');
  });

  it('internalEval null', () => {
    const interpreter = new Interpreter({});
    const res = internalEval(
      new InternalInterpreterReflection(interpreter),
      null as unknown as string,
    );
    expect(res).toEqual(null);
  });

  it('internalEval not InternalInterpreterReflection', () => {
    const interpreter = new Interpreter({});
    expect(() => internalEval(
      interpreter as unknown as InternalInterpreterReflection,
      '',
    )).toThrow(Error);
  });

  it('internalEval not useGlobalScope', () => {
    const interpreter = new Interpreter(
      {
        a: 1,
      },
      {
        rootContext: {a: 1}
      }
    );
    internalEval(
      new InternalInterpreterReflection(interpreter),
      `
        function main() { return 4 + a; };
      `,
      false,
    );
    expect(interpreter.getWindow().main()).toEqual(5);
  });

  it('internalEval not useGlobalScope', () => {
    const interpreter = new Interpreter({});
    const num = () => internalEval(
      new InternalInterpreterReflection(interpreter),
      `4`,
      true,
    );
    expect(num()).toEqual(4);
  });

  it('internalFunction', () => {
    const interpreter = new Interpreter({});
    const main = () => internalFunction(
      null as unknown as InternalInterpreterReflection,
      `a`,
      `4 + a`,
    );
    expect(main).toThrow(Error);
  });

  it('new Function Error.', () => {
    const interpreter = new Interpreter({});
    interpreter.evaluate(`
      var cls = 1;
      function main() {
        return new cls();
      }
    `);
    const {main} = interpreter.getWindow();
    expect(() => main()).toThrow(Error);
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