import { Classes } from "./_dom";
import { DomBaseModule } from "./core/DomBaseModule";
import { DomCore } from "./core/DomCore";
import { DomCss } from "./core/DomCss";
import { CssVarsType, DomParamsType, DomRulesDataType, RRecord } from "./core/types";

import { DomChildType, DomModel, DomModelClassType } from "./core/DomModel";
import { DomUtils, LoadMediaProgress } from "./core/DomUtils";
import { Cookie } from "./tools/Cookie";
import { DomStore } from "./tools/DomStore";

export * from "./core/DomAttributesObserver";
export * from "./core/DomCore";
export * from "./core/DomCss";
export * from "./core/DomLifeObserver";
export * from "./core/DomModel";
export * from "./core/types";
export * from "./tools/Classes";
export * from "./tools/DataList";
export * from "./tools/DomLang";
export * from "./tools/DomRouter";
export * from "./tools/DomStore";
export * from "./tools/EventBuffer";
export * from "./tools/Listener";
export * from "./tools/Player";

/**
 * Create an HTMLElement
 * @param tagName tagName the element tagName, model name or model
 * @param params element attributes.
 * @param children element children. can contain strings and html elements.
 * @param namespace element namesapace if any.
 * @returns a new html element
 */
export interface _domType {
	<T extends HTMLElement = HTMLElement>(
		tagName: string,
		params?: DomParamsType,
		children?: Array<DomChildType>,
		namespace?: string
	): T;

	// --------- props

	uid: string;
	sheet: CSSStyleSheet;
	module: DomModule;
	store: DomStore;
	cookie: typeof Cookie;

	// --------- core

	parseProps: (target: Record<string, any>, data: Record<string, any>) => any;
	import: (
		__dom: _domType | DomModelClassType | (DomModelClassType | _domType)[],
		isPrivate?: boolean
	) => void;
	model: <TT extends any>(
		tagName: TT,
		modelConstructor: (targName: string, ...args: Array<any>) => HTMLElement,
		cssRules?: RRecord<string | number>,
		isPrivate?: boolean
	) => void;
	fonts(
		data: { [k: string]: { [k: string]: string } | string | string[] },
		sheet?: CSSStyleSheet
	): { [k: string]: CSSRule };
	attr: (element: HTMLElement, data: Record<string, any>) => void;
	rule: (selector: string, data: RRecord<string | number>, sheet?: CSSStyleSheet) => CSSStyleRule;
	rules: (
		data: RRecord<string | number>,
		sheet?: CSSStyleSheet,
		uniquePrefix?: string
	) => Record<string, CSSStyleRule> | { className: string; rules: Record<string, CSSStyleRule> };

	// --------- utils

	getAttributes: (target: HTMLElement) => Record<string, any>;
	loadMediaUri: (src: string, onProgress?: (p: LoadMediaProgress) => void) => Promise<string>;
	loadImage: (
		src: string,
		onProgress?: (p: LoadMediaProgress) => void
	) => Promise<HTMLImageElement>;

	img2canvas: (img: HTMLImageElement) => HTMLCanvasElement;
	loadCanvas: (src: string) => Promise<HTMLCanvasElement>;

	getParentPile: (
		dom: HTMLElement,
		condition: (dom: Element) => boolean | void,
		maxDeep?: number
	) => HTMLElement[] | null;
	findParent: (
		dom: HTMLElement,
		condition: (dom: Element) => boolean | void,
		maxDeep?: number
	) => HTMLElement | null;

	download: (
		fileName: string,
		src: String | HTMLImageElement | File | Blob | { toDataURL: Function; [k: string]: any }
	) => void;

	downloadFile: (src: File) => void;

	higherZindex: (parent: HTMLElement) => number;
	handleCssVars: (
		root?: string,
		cssVars?: { [k: string]: string },
		sheet?: CSSStyleSheet
	) => CssVarsType;

	// [k:string]:any
}

export class DomModule extends DomBaseModule {
	constructor() {
		super();
	}
	get _dom(): _domType {
		return _dom(this);
	}
}

const _dom = function (module: DomModule) {
	/**
	 * Create an HTMLElement
	 * @param tagName tagName the element tagName, model name or model
	 * @param params element attributes.
	 * @param children element children. can contain strings and html elements.
	 * @param namespace element namesapace if any.
	 * @returns a new html element
	 */
	const _dom = <_domType>(
		function <T extends HTMLElement = HTMLElement>(
			tagName: string,
			params?: DomParamsType,
			children: Array<DomChildType> = [],
			namespace?: string
		): T {
			// console.log('_dom',arguments);
			return DomCore.render<T>(module, tagName, params, children, namespace);
		}
	);

	Object.defineProperty(_dom, "uid", { get: () => DomCore.uid });

	Object.defineProperty(_dom, "sheet", { get: () => DomCss.sheet });

	Object.defineProperty(_dom, "module", { get: () => module });

	Object.defineProperty(_dom, "store", { get: () => module.store });

	Object.defineProperty(_dom, "cookie", { get: () => Cookie });

	_dom.parseProps = function (target: Record<string, any>, data: Record<string, any>): any {
		return DomCore.parseProps(target, data);
	};

	_dom.import = function (
		__dom: _domType | DomModelClassType | (DomModelClassType | _domType)[],
		isPrivate: boolean = false
	) {
		if (__dom instanceof Array) {
			__dom.map(d => _dom.import(d, isPrivate));
		} else if (Classes.inherit(__dom, DomModel)) {
			module.import(__dom as DomModelClassType, isPrivate);
		} else {
			module.import((__dom as _domType).module as DomBaseModule, isPrivate);
		}
	};

	/**
	* Add a custom element to this module.
	* NB: the **__dom** property will be added to the element, pointing to it's interface (model instance).
	* interface['dom'] : dom element;
	* interface[tagName] : element tagName;
	* @param tagName the custom element name. Should contain at least one "-" to avoid conflict with natives HTMLElements.
	* @param constructor receive the arguments of <b>_dom(tagName,params)</b>
	Must return an HTMLElement.
	<b>NB</b> : constructor Must be a function and <b>NOT a lambda expression</b> because it is scoped to its interface.
	* @param cssRules is or returns an object describing rules like _dom.rules,
	but the created collection will be instancied only once and shared among interfaces.
	Adds the 'rules' property to the interface.
	*/
	_dom.model = function <TT extends any>(
		tagName: TT,
		modelConstructor: (targName: string, ...args: Array<any>) => HTMLElement,
		cssRules: DomRulesDataType = undefined,
		isPrivate: boolean = false
	) {
		module.addModel(tagName, modelConstructor, cssRules, isPrivate);
	};

	/**
	 *
	 * @param element
	 * @param data
	 */
	_dom.attr = function (element: HTMLElement, data: Record<string, any>) {
		DomCore.parseProps(element, data);
	};

	/**
	* 
	* @param data fonts urls or styleset by font-family
	ex : 
	<code>
	_dom.fonts({
		'fontA': {
			src: "url('assets/fonts/fontA.ttf')",
			fontWeight: "100 400"
		},
		'fontB': [
			'assets/fonts/fontB.ttf',
			'assets/fonts/fontB.woff'
		],
		'fontC': 'assets/fonts/fontC.ttf',
	})
	</code>
	* @param sheet target stylesheet
	* @returns 
	*/
	_dom.fonts = function (
		data: { [k: string]: { [k: string]: string } | string | string[] },
		sheet?: CSSStyleSheet
	): { [k: string]: CSSRule } {
		return DomCss.fonts(data, sheet);
	};

	/**
	 * Create a new js cssRule object;
	 * @param selector the new rule css query.
	 * @param data style datas.
	 * @param sheet target stylesheet
	 * @returns
	 */
	_dom.rule = function (
		selector: string,
		data: DomRulesDataType,
		sheet?: CSSStyleSheet
	): CSSStyleRule {
		return DomCss.rule(selector, data, sheet);
	};

	/**
	 * Create a collection of cssRule objects;
	 * @param data sass like structured object
	 * @param sheet target stylesheet
	 * @param uniquePrefix if set, will encapsulate datas with a unique className.
	 * an object {className:string,rules:object([ruleName]:CSSStyleRule} will be returned.
	 * @returns
	 */
	_dom.rules = function (
		data: DomRulesDataType,
		sheet?: CSSStyleSheet,
		uniquePrefix: string = ""
	): Record<string, CSSStyleRule> | { className: string; rules: Record<string, CSSStyleRule> } {
		return DomCss.rules(data, sheet, uniquePrefix);
	};

	// --------- utils

	_dom.getAttributes = function (target: HTMLElement) {
		return DomUtils.getAttributes(target);
	};
	_dom.loadMediaUri = function (
		src: string,
		onProgress: (p: LoadMediaProgress) => void = () => {}
	) {
		return DomUtils.loadMediaUri(src, onProgress);
	};
	_dom.loadImage = function (src: string, onProgress: (p: LoadMediaProgress) => void = () => {}) {
		return DomUtils.loadImage(src, onProgress);
	};

	_dom.img2canvas = function (img: HTMLImageElement): HTMLCanvasElement {
		return DomUtils.img2canvas(img);
	};

	_dom.loadCanvas = function (src: string) {
		return DomUtils.loadCanvas(src);
	};

	_dom.getParentPile = function (
		dom: HTMLElement,
		condition: (dom: Element) => boolean | void,
		maxDeep: number = 10
	): HTMLElement[] | null {
		return DomUtils.getParentPile(dom, condition, maxDeep);
	};
	_dom.findParent = function (
		dom: HTMLElement,
		condition: (dom: Element) => boolean | void,
		maxDeep: number = 10
	): HTMLElement | null {
		return DomUtils.findParent(dom, condition, maxDeep);
	};

	_dom.download = function (
		fileName: string,
		src: String | HTMLImageElement | File | Blob | { toDataURL: Function; [k: string]: any }
	) {
		DomUtils.download(fileName, src);
	};

	_dom.downloadFile = function (src: File) {
		DomUtils.downloadFile(src);
	};

	_dom.higherZindex = function (parent: HTMLElement = document.body) {
		return DomCss.higherZindex(parent);
	};

	/**
	 * Handle css variables
	 * @param root css root query
	 * @param cssVars default css vars values
	 * @param sheet target css styleSheet
	 * @returns a proxy for the css vars values
	 */
	_dom.handleCssVars = function (
		root?: string,
		cssVars?: { [k: string]: string },
		sheet?: CSSStyleSheet
	): CssVarsType {
		return DomCss.handleVars(root, cssVars, sheet);
	};

	return _dom;
};

export default _dom;
