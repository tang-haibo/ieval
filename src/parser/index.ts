
import {parse} from 'acorn';
/**
 * 导出Ast语法树解析,基于 acorn, 尽可能与babel对齐，后续节省大小可使用js导入
 * @param scriptString 
 * @param ecmaVersion 
 * @returns AST
 */
export function Parser (scriptString: string, ecmaVersion: EcmaVersion = 2020): ScriptEmtryAst {
  return parse(scriptString, {
    ecmaVersion,
  }) as unknown as ScriptEmtryAst;
}

export default Parser;