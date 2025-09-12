import { DomBaseModule } from "./core/DomBaseModule";
import { CssVarsType, DomChildType, DomModelClassType, DomParamsType, RRecord } from "./core/types";
import { LoadMediaProgress } from "./core/DomUtils";
import { Cookie } from "./tools/Cookie";
import { DomStore } from "./tools/DomStore";
export * from "./core/DomCore";
export * from "./core/DomCss";
export * from "./core/DomSignals";
export * from "./core/DomUtils";
export * from "./core/model/DomModel";
export * from "./core/observers/DomAttributesObserver";
export * from "./core/observers/DomLifeObserver";
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
    <T extends HTMLElement = HTMLElement>(tagName: string, params?: DomParamsType, children?: Array<DomChildType>, namespace?: string): T;
    uid: string;
    sheet: CSSStyleSheet;
    module: DomModule;
    store: DomStore;
    cookie: typeof Cookie;
    parseProps: (target: Record<string, any>, data: Record<string, any>) => any;
    import: (__dom: _domType | DomModelClassType | (DomModelClassType | _domType)[], isPrivate?: boolean) => void;
    model: <TT extends any>(tagName: TT, modelConstructor: (targName: string, ...args: Array<any>) => HTMLElement, cssRules?: RRecord<string | number>, isPrivate?: boolean) => void;
    fonts(data: {
        [k: string]: {
            [k: string]: string;
        } | string | string[];
    }, sheet?: CSSStyleSheet): {
        [k: string]: CSSRule;
    };
    attr: (element: HTMLElement, data: Record<string, any>) => void;
    rule: (selector: string, data: RRecord<string | number>, sheet?: CSSStyleSheet) => CSSStyleRule;
    rules: (data: RRecord<string | number>, sheet?: CSSStyleSheet, uniquePrefix?: string) => Record<string, CSSStyleRule> | {
        className: string;
        rules: Record<string, CSSStyleRule>;
    };
    getAttributes: (target: HTMLElement) => Record<string, any>;
    loadMediaUri: (src: string, onProgress?: (p: LoadMediaProgress) => void) => Promise<string>;
    loadImage: (src: string, onProgress?: (p: LoadMediaProgress) => void) => Promise<HTMLImageElement>;
    img2canvas: (img: HTMLImageElement) => HTMLCanvasElement;
    loadCanvas: (src: string) => Promise<HTMLCanvasElement>;
    getParentPile: (dom: HTMLElement, condition: (dom: Element) => boolean | void, maxDeep?: number) => HTMLElement[] | null;
    findParent: (dom: HTMLElement, condition: (dom: Element) => boolean | void, maxDeep?: number) => HTMLElement | null;
    download: (fileName: string, src: String | HTMLImageElement | File | Blob | {
        toDataURL: Function;
        [k: string]: any;
    }) => void;
    downloadFile: (src: File) => void;
    higherZindex: (parent: HTMLElement) => number;
    handleCssVars: (root?: string, cssVars?: {
        [k: string]: string;
    }, sheet?: CSSStyleSheet) => CssVarsType;
}
export declare class DomModule extends DomBaseModule {
    constructor();
    get _dom(): _domType;
}
declare const _dom: (module: DomModule) => _domType;
export default _dom;
