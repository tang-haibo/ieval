declare module "jest.config" {
    const _default: {
        clearMocks: boolean;
        collectCoverage: boolean;
        coverageDirectory: string;
        coverageProvider: string;
        transform: {
            '^.+\\.jsx?$': string;
            '^.+\\.ts?$': string;
        };
    };
    export default _default;
}
declare module "config/rollup.config" {
    const _default_1: {
        input: string;
        output: {
            file: string;
            name: string;
            format: string;
        };
        plugins: any[];
    }[];
    export default _default_1;
}
declare module "config/rollup.config.dev" {
    const _default_2: {
        input: string;
        output: {
            file: string;
            name: string;
            format: string;
        };
        plugins: any[];
    }[];
    export default _default_2;
}
declare module "config/rollup.config.prod" {
    const _default_3: {
        input: string;
        output: {
            file: string;
            name: string;
            format: string;
        };
        plugins: any[];
    }[];
    export default _default_3;
}
declare module "src/eval/interpreter/scope" {
    /**
     * 作用域对象
     */
    export class Scope {
        readonly name: string | undefined | Symbol;
        readonly parent: Scope | null;
        readonly data: ScopeData;
        labelStack: string[];
        constructor(data: ScopeData, parent?: Scope | null, name?: string | Symbol);
    }
}
declare module "src/eval/interpreter/messages" {
    export class ThrowError extends Error {
    }
    export class ThrowSyntaxError extends SyntaxError {
    }
    export class ThrowReferenceError extends ReferenceError {
    }
    export class ThrowTypeError extends TypeError {
    }
    export class InterruptThrowError extends ThrowError {
    }
    export class InterruptThrowSyntaxError extends ThrowSyntaxError {
    }
    export class InterruptThrowReferenceError extends ThrowReferenceError {
    }
    interface Messages {
        [type: string]: MessageItem;
    }
    export type MessageItem = [
        number,
        string,
        new (message: string) => Error
    ];
    export const Messages: Messages;
}
declare module "src/eval/interpreter/nodes" {
    import * as ESTree from "estree";
    import { File } from '@babel/types';
    export { ESTree };
    export interface FileNodeInter extends ESTree.BaseExpression {
        type: "File";
        program: File;
    }
    export type FileNode = FileNodeInter | File;
    type BaseData = number | string | RegExp;
    export interface RegExpLiteral extends ESTree.BaseExpression {
        type: "RegExpLiteral";
        pattern: string;
        flags?: string;
    }
    export interface BaseLiteral extends ESTree.BaseExpression {
        type: "NumericLiteral" | "StringLiteral" | "BooleanLiteral";
        value?: BaseData;
        extra?: {
            raw?: BaseData;
            rawValue?: BaseData;
        };
        init: {
            value: BaseData;
        };
    }
    export interface NullLiteral extends ESTree.BaseExpression {
        type: "NullLiteral";
    }
    export type BabelNode = FileNode | BaseLiteral | NullLiteral | RegExpLiteral;
    export type Node = ESTree.Node | ESTree.BinaryExpression | ESTree.LogicalExpression | ESTree.UnaryExpression | ESTree.UpdateExpression | ESTree.ObjectExpression | ESTree.ArrayExpression | ESTree.CallExpression | ESTree.NewExpression | ESTree.MemberExpression | ESTree.ThisExpression | ESTree.SequenceExpression | ESTree.Literal | ESTree.Identifier | ESTree.AssignmentExpression | ESTree.FunctionDeclaration | ESTree.VariableDeclaration | ESTree.BlockStatement | ESTree.Program | ESTree.ExpressionStatement | ESTree.EmptyStatement | ESTree.ReturnStatement | ESTree.FunctionExpression | ESTree.IfStatement | ESTree.ConditionalExpression | ESTree.ForStatement | ESTree.WhileStatement | ESTree.DoWhileStatement | ESTree.ForInStatement | ESTree.WithStatement | ESTree.ThrowStatement | ESTree.TryStatement | ESTree.ContinueStatement | ESTree.BreakStatement | ESTree.SwitchStatement | ESTree.SwitchCase | ESTree.LabeledStatement | ESTree.DebuggerStatement | ESTree.Program;
}
declare module "src/eval/interpreter/index" {
    import { ParseResult } from '@babel/parser';
    import { Scope } from "src/eval/interpreter/scope";
    import { MessageItem } from "src/eval/interpreter/messages";
    import { Node, ESTree, BabelNode, BaseLiteral, NullLiteral, FileNode, RegExpLiteral } from "src/eval/interpreter/nodes";
    type Getter = () => any;
    interface BaseClosure {
        (pNode?: Node): any;
        isFunctionDeclareClosure?: boolean;
    }
    type CaseItem = {
        testClosure: BaseClosure;
        bodyClosure: BaseClosure;
    };
    type SwitchCaseClosure = () => CaseItem;
    type ReturnStringClosure = () => string;
    type ECMA_VERSION = 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020;
    interface Options {
        ecmaVersion?: ECMA_VERSION;
        timeout?: number;
        rootContext?: Context | null;
        globalContextInFunction?: any;
        _initEnv?: (this: Interpreter) => void;
    }
    interface CollectDeclarations {
        [key: string]: undefined | BaseClosure;
    }
    type ScopeData = {
        [prop: string]: any;
        [prop: number]: any;
    };
    type Context = {
        [prop: string]: any;
        [prop: number]: any;
    };
    interface GeneratorReflection {
        getOptions(): Readonly<Options>;
        getCurrentScope(): Scope;
        getGlobalScope(): Scope;
        getCurrentContext(): Context;
        getExecStartTime(): number;
    }
    export class InternalInterpreterReflection {
        protected interpreter: Interpreter;
        constructor(interpreter: Interpreter);
        generator(): GeneratorReflection;
    }
    export function internalEval(reflection: InternalInterpreterReflection, code?: string, useGlobalScope?: boolean): any;
    export function internalFunction(reflection: InternalInterpreterReflection, ...params: string[]): (...args: any[]) => any;
    export class Interpreter {
        static readonly version: string;
        static readonly eval: typeof internalEval;
        static readonly Function: typeof internalFunction;
        static ecmaVersion: ECMA_VERSION;
        static globalContextInFunction: any;
        static global: Context;
        protected value: any;
        protected context: Context | Scope;
        protected globalContext: Context;
        protected source: string;
        protected sourceList: string[];
        protected currentScope: Scope;
        protected globalScope: Scope;
        protected currentContext: Context;
        protected options: Options;
        protected callStack: string[];
        protected collectDeclVars: CollectDeclarations;
        protected collectDeclFuncs: CollectDeclarations;
        protected isVarDeclMode: boolean;
        protected lastExecNode: Node | null;
        protected isRunning: boolean;
        protected execStartTime: number;
        protected execEndTime: number;
        constructor(context?: Context | Scope, options?: Options);
        protected initEnvironment(ctx: Context | Scope): void;
        getExecStartTime(): number;
        getExecutionTime(): number;
        setExecTimeout(timeout?: number): void;
        getOptions(): Readonly<Options>;
        getWindow(): globalThis.ScopeData;
        protected getGlobalScope(): Scope;
        protected getCurrentScope(): Scope;
        protected getCurrentContext(): Context;
        protected isInterruptThrow<T>(err: T): boolean;
        protected createSuperScope(ctx: Context): Scope;
        protected setCurrentContext(ctx: Context): void;
        protected setCurrentScope(scope: Scope): void;
        evaluate(code?: string | ParseResult<FileNode>): any;
        protected evaluateNode(node: ESTree.Program, source?: string): any;
        protected createErrorMessage(msg: MessageItem, value: string | number, node?: Node | null): string;
        protected createError<T>(message: string, error: {
            new (msg: string): T;
        }): T;
        protected createThrowError<T>(message: string, error: {
            new (msg: string): T;
        }): T;
        protected createInternalThrowError<T extends MessageItem>(msg: T, value: string | number, node?: Node | BabelNode | null): Error;
        protected checkTimeout(): boolean;
        protected getNodePosition(node: (Node & {
            start?: number;
            end?: number;
        }) | null): string;
        protected nullLiteral(_node: NullLiteral): () => null;
        protected baseLiteral(node: BaseLiteral): () => (string | number | RegExp) | undefined;
        protected regExpLiteral(node: RegExpLiteral): () => RegExp;
        protected createClosure(node: Node | BabelNode | ESTree.Program): BaseClosure;
        protected binaryExpressionHandler(node: ESTree.BinaryExpression): BaseClosure;
        protected logicalExpressionHandler(node: ESTree.LogicalExpression): BaseClosure;
        protected unaryExpressionHandler(node: ESTree.UnaryExpression): BaseClosure;
        protected updateExpressionHandler(node: ESTree.UpdateExpression): BaseClosure;
        protected isLiteral(type: string): boolean;
        protected getLiteralValue(keyNode: BaseLiteral): (string | number | RegExp) | undefined;
        protected objectExpressionHandler(node: ESTree.ObjectExpression): () => {
            [key: string]: any;
        };
        protected arrayExpressionHandler(node: ESTree.ArrayExpression): () => any[];
        protected safeObjectGet(obj: any, key: any, node: Node): any;
        protected createCallFunctionGetter(node: Node & {
            start?: number;
            end?: number;
        }): () => any;
        protected callExpressionHandler(node: ESTree.CallExpression): BaseClosure;
        protected functionExpressionHandler(node: (ESTree.FunctionExpression & {
            start?: number;
            end?: number;
        }) | (ESTree.FunctionDeclaration & {
            start?: number;
            end?: number;
        })): BaseClosure;
        protected newExpressionHandler(node: ESTree.NewExpression): BaseClosure;
        protected memberExpressionHandler(node: ESTree.MemberExpression): BaseClosure;
        protected thisExpressionHandler(node: ESTree.ThisExpression): BaseClosure;
        protected sequenceExpressionHandler(node: ESTree.SequenceExpression): BaseClosure;
        protected literalHandler(node: ESTree.Literal & {
            regex?: {
                pattern: string;
                flags: string;
            };
        }): BaseClosure;
        protected identifierHandler(node: ESTree.Identifier): BaseClosure;
        protected getIdentifierScope(node: ESTree.Identifier): Scope;
        protected assignmentExpressionHandler(node: ESTree.AssignmentExpression): BaseClosure;
        protected functionDeclarationHandler(node: ESTree.FunctionDeclaration): BaseClosure;
        protected getVariableName(node: ESTree.Pattern): never | string;
        protected variableDeclarationHandler(node: ESTree.VariableDeclaration): BaseClosure;
        protected assertVariable(data: ScopeData, name: string, node: Node): void | never;
        protected programHandler(node: ESTree.Program | ESTree.BlockStatement): BaseClosure;
        protected expressionStatementHandler(node: ESTree.ExpressionStatement): BaseClosure;
        protected emptyStatementHandler(node: Node): BaseClosure;
        protected returnStatementHandler(node: ESTree.ReturnStatement): BaseClosure;
        protected ifStatementHandler(node: ESTree.IfStatement | ESTree.ConditionalExpression): BaseClosure;
        protected conditionalExpressionHandler(node: ESTree.ConditionalExpression): BaseClosure;
        protected forStatementHandler(node: ESTree.ForStatement | ESTree.WhileStatement | ESTree.DoWhileStatement): BaseClosure;
        protected whileStatementHandler(node: ESTree.WhileStatement): BaseClosure;
        protected doWhileStatementHandler(node: ESTree.DoWhileStatement): BaseClosure;
        protected forInStatementHandler(node: ESTree.ForInStatement): BaseClosure;
        protected withStatementHandler(node: ESTree.WithStatement): BaseClosure;
        protected throwStatementHandler(node: ESTree.ThrowStatement): BaseClosure;
        protected tryStatementHandler(node: ESTree.TryStatement): BaseClosure;
        protected catchClauseHandler(node: ESTree.CatchClause): (e: Error) => any;
        protected continueStatementHandler(node: ESTree.ContinueStatement): BaseClosure;
        protected breakStatementHandler(node: ESTree.BreakStatement): BaseClosure;
        protected switchStatementHandler(node: ESTree.SwitchStatement): BaseClosure;
        protected switchCaseHandler(node: ESTree.SwitchCase): SwitchCaseClosure;
        protected labeledStatementHandler(node: ESTree.LabeledStatement): BaseClosure;
        protected debuggerStatementHandler(node: ESTree.DebuggerStatement): BaseClosure;
        protected createParamNameGetter(node: ESTree.Pattern): ReturnStringClosure;
        protected createObjectKeyGetter(node: ESTree.Expression): Getter;
        protected createMemberKeyGetter(node: ESTree.MemberExpression): Getter;
        protected createObjectGetter(node: ESTree.Expression | ESTree.Pattern): Getter;
        protected createNameGetter(node: ESTree.Expression | ESTree.Pattern): Getter;
        protected varDeclaration(name: string): void;
        protected funcDeclaration(name: string, func: () => any): void;
        protected addDeclarationsToScope(declVars: CollectDeclarations, declFuncs: CollectDeclarations, scope: Scope): void;
        protected getScopeValue(name: string, startScope: Scope): any;
        protected getScopeDataFromName(name: string, startScope: Scope): globalThis.ScopeData;
        protected getScopeFromName(name: string, startScope: Scope): Scope;
        protected setValue(value: any): any;
        getValue(): any;
    }
}
declare module "src/eval/index" {
    import { ParseResult } from '@babel/parser';
    import { FileNode } from "src/eval/interpreter/nodes";
    export function EvalScript(ast: Array<string | ParseResult<FileNode>>, context?: RuntimeContext): RuntimeContext;
}
declare module "src/utils/index" {
    export function isJSON<T>(value: T): boolean;
    export function isString<T>(value: T): boolean;
    export function isPromise<T>(value: T): boolean;
    export function isNetworkUrl<T>(value: T): boolean;
}
declare module "ieval" {
    import { ParseResult } from '@babel/parser';
    import { EvalScript } from "src/eval/index";
    import { FileNode } from "src/eval/interpreter/nodes";
    interface RuntimeContext {
        [type: string]: any;
    }
    enum CodeType {
        NETWORK = 1,
        CODE = 2,
        AST = 3
    }
    class CodeBlock {
        defined: boolean;
        value: string | ParseResult<FileNode>;
        private _loaded;
        protected type: CodeType;
        protected resolves: Array<(value: number) => void>;
        constructor(type: CodeType, value: string | ParseResult<FileNode>);
        /**
         * 重复的远程加载
         * 不应该被继续执行
         */
        setDefined(): void;
        loaded(): Promise<unknown>;
    }
    interface RequestInterface {
        (url: string): Promise<string>;
    }
    class DocumentEval {
        static setNetwork(reqFunc: RequestInterface): void;
        protected resolve: ((value: unknown) => void) | null;
        protected resouces: Array<CodeBlock>;
        protected context: RuntimeContext;
        protected ctx: RuntimeContext | null;
        constructor(context: RuntimeContext);
        appendCode(code: string): void;
        appendUrl(url: string): void;
        appendAst(ast: ParseResult<FileNode>): void;
        loaded(): Promise<unknown[]>;
        getWindow(): Promise<any>;
    }
    function iEval(resouces: Array<string | ParseResult<FileNode>>, context: RuntimeContext): DocumentEval;
    namespace iEval {
        var setNetwork: typeof DocumentEval.setNetwork;
    }
    export { EvalScript, DocumentEval, iEval, };
    const _default_4: {
        EvalScript: typeof EvalScript;
        DocumentEval: typeof DocumentEval;
        iEval: typeof iEval;
    };
    export default _default_4;
}
declare module "ieval.test" { }
declare module "src/eval/index.test" { }
declare module "src/eval/interpreter/index.test" { }
declare module "src/eval/interpreter/messages.test" { }
declare module "src/eval/interpreter/scope.test" { }
declare module "src/utils/index.test" { }
