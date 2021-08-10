// 解释器
import {Interpreter} from './interpreter';

export function EvalScript (ast: string[], context?: RuntimeContext,): RuntimeContext {
  // 新建执行上下文
  const interpreter = new Interpreter(context || {});
  // 批量执行
  ast.forEach((code: string) => {
    interpreter.evaluate(code);
  });
  return interpreter;
}