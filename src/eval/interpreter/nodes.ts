import * as ESTree from "estree";

export { ESTree };

export interface File {
  type: "Program";
  sourceType: "script" | "module";
  body: Array<ESTree.Directive | ESTree.Statement | ESTree.ModuleDeclaration>;
  comments?: Array<ESTree.Comment> | undefined;
	loc: any;

}

type BaseData = number | string | RegExp;
export interface RegExpLiteral extends ESTree.BaseExpression {
	type: "RegExpLiteral",
	pattern: string;
	flags?: string;
}
export interface BaseLiteral extends ESTree.BaseExpression {
	type: "NumericLiteral" | "StringLiteral" | "BooleanLiteral",
	value?: BaseData;
	extra?: {
		raw?: BaseData;
		rawValue?: BaseData;
	},
	init: {
		value: BaseData,
	},
}
export interface NullLiteral extends ESTree.BaseExpression  {
	type: "NullLiteral";
}
export interface FileNode extends ESTree.BaseExpression {
	type: "File",
	program: ESTree.Program;
}
export type BabelNode = FileNode | BaseLiteral | NullLiteral | RegExpLiteral;
export type Node =
	| ESTree.Node
	| ESTree.BinaryExpression
	| ESTree.LogicalExpression
	| ESTree.UnaryExpression
	| ESTree.UpdateExpression
	| ESTree.ObjectExpression
	| ESTree.ArrayExpression
	| ESTree.CallExpression
	| ESTree.NewExpression
	| ESTree.MemberExpression
	| ESTree.ThisExpression
	| ESTree.SequenceExpression
	| ESTree.Literal
	| ESTree.Identifier
	| ESTree.AssignmentExpression
	| ESTree.FunctionDeclaration
	| ESTree.VariableDeclaration
	| ESTree.BlockStatement
	| ESTree.Program
	| ESTree.ExpressionStatement
	| ESTree.EmptyStatement
	| ESTree.ReturnStatement
	| ESTree.FunctionExpression
	| ESTree.IfStatement
	| ESTree.ConditionalExpression
	| ESTree.ForStatement
	| ESTree.WhileStatement
	| ESTree.DoWhileStatement
	| ESTree.ForInStatement
	| ESTree.WithStatement
	| ESTree.ThrowStatement
	| ESTree.TryStatement
	| ESTree.ContinueStatement
	| ESTree.BreakStatement
	| ESTree.SwitchStatement
	| ESTree.SwitchCase
	| ESTree.LabeledStatement
	| ESTree.DebuggerStatement | ESTree.Program;