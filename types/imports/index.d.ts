interface ScriptEmtryAst {
  [key: string]: any;
}

interface ExecCallback<T> {
  (): void;
}

type ScriptType = null | string | ScriptEmtryAst;
type ScriptsEmtry = Promise<ScriptType> | ScriptType;

interface RuntimeContext {
  [type: string]: any;
}
interface ContextOption {
  context: RuntimeContext,
  get(url: string): Promise<string>;
}
