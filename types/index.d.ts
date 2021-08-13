interface ScriptEmtryAst {
  [key: string]: ScriptEmtryAst | string;
}

interface RuntimeContext {
  [type: string]: any;
}