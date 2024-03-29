import { RRecord } from "../core/types";
export declare class DomLang {
    private _map;
    private _lang;
    private _registered;
    private _buffer;
    private _changeLang;
    get lang(): string;
    set lang(v: string);
    /**
    * Adds a dictionary
    * @param name
    * @param data
    */
    add(name: string, data: RRecord<string>): void;
    /**
     * loads a dictionary
     * @param name
     * @param url
     * @returns
     */
    load(name: string, url: string): Promise<any>;
    getText(key: string, params?: {
        [k: string]: string | number;
    }): any;
    /**
     * Gets model translator instance
     * @param targetModel If given, assign translator for the target dom model. Translator is destroyed when the model is destroyed.
     * @returns model translator instance
     */
    register(targetModel?: any): DomLangRegIO;
    destroy(reg: DomLangReg): void;
}
export declare class DomLangReg {
    private _root;
    io: DomLangRegIO;
    nodes: DomLangText[];
    constructor(_root: DomLang);
    changeLang(): void;
    getText(key: string, params?: {
        [k: string]: string | number;
    }): any;
    getLangText<T = any>(key: string, params: {
        [k: string]: string | number;
    }, changeCB: (v: string, data: any) => void, target: T): DomLangText<T>;
    getTextNode(key: string, params?: {
        [k: string]: string | number;
    }): DomLangText<Text>;
    getTextLink<T = any>(key: string, params: {
        [k: string]: string | number;
    }, target: T, targetKey: string): DomLangText<T>;
    getTextWatch(key: string, params: {
        [k: string]: string | number;
    }, callback: (newValue: string, oldValue: string) => void): DomLangText<string>;
    destroyText(t: DomLangText): void;
    destroy(): void;
}
export declare class DomLangText<T = any> {
    private _reg;
    key: string;
    params: {
        [k: string]: string | number;
    };
    changeCB: (v: string, data: any) => void;
    target?: T;
    private _rid;
    constructor(_reg: DomLangReg, key: string, params: {
        [k: string]: string | number;
    }, changeCB: (v: string, data: any) => void, target?: T);
    get text(): any;
    setKey(key: string): void;
    setParams(params: {
        [k: string]: string | number;
    }): void;
    change(): this;
    destroy(): void;
}
export declare class DomLangRegIO {
    private _reg;
    constructor(_reg: DomLangReg);
    getText(key: string, params?: {
        [k: string]: string | number;
    }): string;
    getTextNode(key: string, params?: {
        [k: string]: string | number;
    }): DomLangText<Text>;
    getTextLink<T = any>(key: string, params: {
        [k: string]: string | number;
    }, target: T, targetKey: string): DomLangText<T>;
    getTextWatch(key: string, params: {
        [k: string]: string | number;
    }, callback: (newValue: string, oldValue: string) => void): DomLangText<string>;
    destroy(): void;
}
