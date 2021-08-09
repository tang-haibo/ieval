import { EvalScript } from '../eval';
import { parser } from '../parser';
import { isPromise, isAst, isString, isNetworkUrl } from '../utils';

// 各端实现不一致，这里实现被忽略
export function getResource (url: string, option: ContextOption): Promise<string> {
  return option.get(url);
}

export async function loadToAst(
  scripts: ScriptsEmtry[],
  option: ContextOption,
): Promise<ScriptsEmtry[]> {
  return Promise.all(scripts.map(item => {
    if(isNetworkUrl(item)) {
      return getResource(String(item), option).then((data: string) => parser(data));
    }
    if(isString(item)) {
      return Promise.resolve(parser(String(item)));
    }
    if(isPromise(item)) {
      return (item as Promise<string>).then((data: string) => parser(data));
    }
    if(isAst(item)) {
      return item;
    }
    return {};
  }));
}

// 远程代码载入执行
export async function ImportScript(
  scripts: ScriptsEmtry[],
  option: ContextOption,
): Promise<RuntimeContext> {
  const ast = await loadToAst(scripts, option);
  // 执行
  const context = option.context;
  return EvalScript(ast, context);
}