import {EvalScript} from './index';

// 测试代码
const code = `
  function main() {
    var a = 1;
    var b = 2;
    var c = a + b;
    return c;
  }
`;

describe('[EvalScript]', () => {
  it('Basic function definition', () => {
    const ctx = EvalScript([code], {});
    const module = ctx.getWindow();
    expect(module.main).toBeDefined();
    expect(module.main()).toBe(3);
  });

  it('param validator', () => {
    const ctx = EvalScript(['']);
    expect(ctx.context).toEqual({});
  });
});