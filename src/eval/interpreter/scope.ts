/**
 * 作用域对象
 */
export class Scope {
	readonly name: string | undefined | Symbol;
	readonly parent: Scope | null;
	readonly data: ScopeData;
	labelStack: string[];
	constructor(data: ScopeData, parent: Scope | null = null, name?: string | Symbol) {
		this.name = name;
		this.parent = parent;
		this.data = data;
		this.labelStack = [];
	}
}
