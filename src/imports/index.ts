import { EvalScript } from '../eval';
import { isPromise, isString, isNetworkUrl } from '../utils';

// 各端实现不一致，这里实现被忽略
export function getResource (url: string, option: ContextOption): Promise<string> {
  return option.get(url);
}

export async function loadCode(
  scripts: ScriptsEmtry[],
  option: ContextOption,
): Promise<string[]> {
  return Promise.all(scripts.map(item => {
    if(isNetworkUrl(item)) {
      return getResource(String(item), option);
    }
    if(isString(item)) {
      return Promise.resolve(String(item));
    }
    if(isPromise(item)) {
      return (item as Promise<string>);
    }
    throw Error(`输入类型应为 Promise String 或资源地址`);
  }));
}

// 远程代码载入执行
export async function ImportScript(
  scripts: ScriptsEmtry[],
  option: ContextOption,
): Promise<RuntimeContext> {
  const code = await loadCode(scripts, option);
  // 执行
  const context = option.context;
  return EvalScript(code, context);
}