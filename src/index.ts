import { ParseResult } from '@babel/parser';
import {EvalScript} from './eval';
import { FileNode } from './eval/interpreter/nodes';
import { isJSON, isNetworkUrl, isString } from './utils';

enum CodeType {
  NETWORK = 1,
  CODE = 2,
  AST = 3,
}
class CodeBlock {
  public defined: boolean = false;
  public value: string | ParseResult<FileNode> = '';
  private _loaded: boolean = false;
  protected type: CodeType = 1;
  protected resolves: Array<(value: number) => void> = [];
  constructor(type: CodeType, value: string | ParseResult<FileNode>) {
    this.type = type;
    if(type === CodeType.NETWORK) {
      if(request === null) {
        throw Error('请设置 DocumentEval.setNetwork((url: string) => code string)');
      }
      request(value as string).then(code => {
        this.value = code;
        this._loaded = true;
        this.resolves.forEach(resolve => resolve(0));
      });
      return;
    }
    this.value = value;
    this._loaded = true;
  }
  /**
   * 重复的远程加载
   * 不应该被继续执行
   */
  public setDefined() {
    if(this.type === CodeType.NETWORK) {
      return;
    }
    this.defined = true;
  }
  public async loaded() {
    return new Promise(resolve => {
      // 当前加载完成
      if(this._loaded) {
        return resolve(0);
      }
      this.resolves.push(resolve);
    });
  }
}

interface RequestInterface {
  (url: string): Promise<string>;
}

// 通过network实现的get请求对象
let request: RequestInterface;

// 建同一个文档
class DocumentEval {
  public static setNetwork(reqFunc: RequestInterface) {
    request = reqFunc;
  }
  // 调用迭代器
  protected resolve: ((value: unknown) => void) | null = null;
  // 资源列表
  protected resouces: Array<CodeBlock> = [];
  // 上下文对象
  protected context: RuntimeContext = {};
  // 最终实例化对象
  protected ctx: RuntimeContext | null = null;
  constructor(context: RuntimeContext) {
    if(context !== undefined) {
      this.context = context;
    }
  }
  // 添加代码执行
  appendCode(code: string) {
    this.resouces.push(new CodeBlock(CodeType.CODE, code));
  }
  // 载入远程代码
  appendUrl(url: string) {
    this.resouces.push(new CodeBlock(CodeType.NETWORK, url));
  }
  // 载入Ast
  appendAst(ast: ParseResult<FileNode>) {
    this.resouces.push(new CodeBlock(CodeType.AST, ast));
  }
  // 确保资源全部加载完成
  public loaded() {
    return Promise.all(this.resouces.map(resouce => resouce.loaded()));
  }
  async getWindow() {
    await this.loaded();
    // 重建环境重新执行一次(避免再次载入的代码未正确执行)
    const defineds = this.resouces.filter(item => !item.defined);
    this.ctx = EvalScript(defineds.map(item => {
      item.setDefined();
      return item.value;
    }), this.context);
    return this.ctx.getWindow();
  }
}

// 每次加载一个ieval对象
function iEval(resouces: Array<string | ParseResult<FileNode>>, context: RuntimeContext) {
  const documentEval = new DocumentEval(context);
  // 代码由上至下注入
  resouces.forEach(resouce => {
    if(isString(resouce)) {
      documentEval.appendCode(resouce as string);
    } else if (isNetworkUrl(resouce)) {
      documentEval.appendUrl(resouce as string);
    } else if (isJSON(resouce)) {
      documentEval.appendAst(resouce as ParseResult<FileNode>);
    }
  });
  return documentEval;
}

// 设置代码拉取函数
iEval.setNetwork = DocumentEval.setNetwork;

export {
  EvalScript,
  DocumentEval,
  iEval,
};

export default {
  EvalScript,
  DocumentEval,
  iEval
};