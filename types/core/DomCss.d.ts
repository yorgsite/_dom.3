import { CssVarsType, DomRulesDataType, DomRulesRulesResultType, DomRulesType, RRecord } from "./types";
export declare class CssVars {
    readonly root: string;
    camelised: boolean;
    private rule;
    private _proxy;
    constructor(root?: string, camelised?: boolean, sheet?: CSSStyleSheet);
    get proxy(): CssVarsType;
    uncamelise(key: string): string;
    camelise(key: string): string;
    has(key: string): boolean;
    get(key: string): string;
    set(key: string, value: string): void;
    keys: () => string[];
    entries: () => [
        string,
        string
    ][];
    getVars: () => {
        [k: string]: string;
    };
    setVars: (vars: {
        [k: string]: string;
    }, keepDefault?: boolean) => void;
}
export declare class DomCss {
    private static defaultCssRef;
    private static flatSelectors;
    static get sheet(): CSSStyleSheet;
    /**
     * Get browser native element default css values.
     * Called multiple times the method could be time consumming.
     * The result will be computed only once for a given tagName until 'force' is set to true
     * @param tagName tag name of the native element to test
     * @param force force recomputation
     * @returns the default css values.
     */
    static defaultCss(tagName: string | HTMLElement, force?: boolean): Map<string, string>;
    /**
     *
     * @param data fonts urls or styleset by font-family
     * @param sheet target stylesheet
     * @returns
     */
    static fonts(data: {
        [k: string]: {
            [k: string]: string;
        } | string | string[];
    }, sheet?: CSSStyleSheet): {
        [k: string]: CSSRule;
    };
    /**
     * Create a new js cssRule object;
     * @param selector selector the new rule css query.
     * @param data style data.
     * @param sheet target stylesheet
     * @param rootRules rules group object
     * @param aliases rule aliases mapping
     * @returns
     */
    static rule(selector: string, data: DomRulesDataType, sheet?: CSSStyleSheet, rootRules?: Record<string, CSSStyleRule>, aliases?: Record<string, string | number>): CSSStyleRule;
    /**
     * Create a collection of cssRule objects;
     * @param data sass like structured object
     * @param sheet target stylesheet
     * @param uniquePrefix if set, will encapsulate datas with a unique className.
     * an object {className:string,rules:object([ruleName]:CSSStyleRule} will be returned.
     * @returns
     */
    static rules(data: RRecord<string | number>, sheet?: CSSStyleSheet, uniquePrefix?: string): DomRulesType;
    static rulesText(data: RRecord<string | number>): any[];
    /**
     * Handle css variables
     * @param root css root query
     * @param cssVars default css vars values (not applied if allready exist)
     * @param sheet target css styleSheet
     * @returns a proxy for the css vars values
     */
    static handleVars(root?: string, cssVars?: {
        [k: string]: string;
    }, sheet?: CSSStyleSheet): CssVarsType;
    /**
     * Finds a css rule in any available stylesheet.
     * The last rule found is returned for a same selector.
     * @param selector the selector of the rule
     * @param sheet search only in this styleSheet when provided
     * @returns the css rule or null if not found.
     */
    static findRule(selector: string, sheet?: CSSStyleSheet): CSSStyleRule | null;
    /**
     * Finds all css rules corresponding to the selector
     * @param selector the selector of the rule.
     * @param sheet search only in this styleSheet when provided
     * @returns the list of rules found.
     */
    static findRules(selector: string, sheet?: CSSStyleSheet): CSSStyleRule[];
    /**
     * Transforms sass like data to css like data.
     * @param data sass like structured object
     * @returns data with css rules and aliases.
     */
    static getRulesData(data: RRecord<string | number>): DomRulesRulesResultType;
    static getValue(node: HTMLElement, name: string): any;
    static higherZindex(parent?: HTMLElement): number;
}
