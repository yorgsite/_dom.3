

export type RRecord<T> = { [K in string]: T|RRecord<T> };

export type DomParamsType={[k:string]:any}&{[k in keyof HTMLElement]?:any};

export type DomRulesType = Record<string,CSSStyleRule>|{className:string,rules:Record<string,CSSStyleRule>};

// RRecord<string|number>

// export type DomRulesDataType={[k:string]:any}&{[k in keyof CSSStyleDeclaration]?:any};

export type DomRulesDataType<T=string|number>=
	{[k in string]: T|DomRulesDataType<T>}
	&{[k in keyof CSSStyleDeclaration]?:T}
	;

export type DomRulesRulesResultType = {rules:RRecord<string|number>,alias:RRecord<string|number>};

export type CssVarsType = (
	{[k:string]:string} & {
		setVars?:(vars:{[k:string]:string})=>void
	}
);

