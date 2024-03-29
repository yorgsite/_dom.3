import { CssVarsType, RRecord, DomRulesRulesResultType, DomRulesType, DomRulesDataType } from "./types";
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
    *
    * @param root
    * @param cssVars
    * @param sheet
    * @returns
    */
    static handleVars(root?: string, cssVars?: {
        [k: string]: string;
    }, sheet?: CSSStyleSheet): CssVarsType;
    /**
    * Transforms sass like data to css like data.
    * @param data sass like structured object
    * @returns data with css rules and aliases.
    */
    static getRulesData(data: RRecord<string | number>): DomRulesRulesResultType;
    static getValue(node: HTMLElement, name: string): any;
    static higherZindex(parent?: HTMLElement): number;
}
