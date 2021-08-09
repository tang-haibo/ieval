import { NodeIterator } from "./iterator";
import { Scope } from "./scope";

class Parser {
  protected ast: ScriptEmtryAst | null = null;
  protected nodeIterator: any = null;
  protected context: RuntimeContext = {};
  constructor(ast: ScriptEmtryAst, context: RuntimeContext) {
    this.ast = ast;
    this.nodeIterator = null;
    this.context = context;
    this.init();
  }
  private init() {
    const globalScope = new Scope('function', this.context);
    Object.keys(this.context).forEach((key) => {
      globalScope.addDeclaration(key, this.context[key])
    })
    this.nodeIterator = new NodeIterator(null, globalScope);
  }
}


// 解释器
export function EvalScript (ast: ScriptEmtryAst, context?: RuntimeContext,): RuntimeContext {
  // 解析执行
  const ctx = new Parser(ast, context || {});
  return {};
}