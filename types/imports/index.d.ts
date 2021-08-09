interface ScriptEmtryAst {
  [key: string]: ScriptEmtryAst | string | ScriptEmtryAst[];
}

interface ExecCallback<T> {
  (): void;
}

type ScriptType = string | ScriptEmtryAst;
type ScriptsEmtry = Promise<ScriptType> | ScriptType;

interface RuntimeContext {
  [type: string]: any;
}
interface ContextOption {
  context: RuntimeContext,
  get(url: string): Promise<string>;
}
