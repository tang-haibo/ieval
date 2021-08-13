// 解释器
import { ParseResult } from '@babel/parser';
import {Interpreter} from './interpreter';
import { FileNode } from './interpreter/nodes';

export function EvalScript (ast: Array<string | ParseResult<FileNode>>, context?: RuntimeContext,): RuntimeContext {
  // 新建执行上下文
  const interpreter = new Interpreter(context || {});
  // 批量执行
  ast.forEach(code => {
    interpreter.evaluate(code);
  });
  return interpreter;
}