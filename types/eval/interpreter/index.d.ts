
type ScopeData = {
	[prop: string]: any;
	[prop: number]: any;
};

interface BaseClosure {
	(pNode?: Node): any;
	isFunctionDeclareClosure?: boolean;
}

interface CollectDeclarations {
	[key: string]: undefined | BaseClosure;
}