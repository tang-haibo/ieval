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
  const ctx = EvalScript([code], {});
  const module = ctx.getWindow();

  it('Basic function definition', () => {
    expect(module.main).toBeDefined();
  });
  // 基本加减法运算正常
  it('Basic addition and subtraction operations', async () => {
    expect(module.main()).toBe(3);
  });
});