import {EvalScript} from './index';
import {parser} from '../index';

// 测试代码
const code = parser(`
  function main() {
    var a = 1;
    var b = 2;
    var c = a + b;
  }
`);

describe('[EvalScript]', () => {
  it('Basic function definition', () => {
    const context = EvalScript(code, {});
    // 确保变量被定义
    expect(context.main).toBeDefined();
  });
  // 基本加减法运算
  it('Basic addition and subtraction operations', async () => {
    
  });
});