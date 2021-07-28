import { Parser } from '../parser';
import { isPromise, isAst, isString } from '../utils';

// 远程代码载入执行
export function ImportScript<T>(scripts: ScriptsEmtry[], callback?: ExecCallback<T>): Promise<ScriptsEmtry[]> {
  // 创建执行环境
  return Promise.all(scripts.map(item => {
    if(isString(item)) {
      return Promise.resolve(Parser(item as string));
    }
    if(isPromise(item)) {
      return (item as Promise<string>).then((data: string) => Parser(data));
    }
    if(isAst(item)) {
      return item;
    }
    return {};
  }));
}