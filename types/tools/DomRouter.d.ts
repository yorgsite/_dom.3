import { DomModel, DomModelClassType } from "../_dom";
import { ListenerEvent } from "./Listener";
type DomRouterDataType = {
    path: string;
    search: {
        [k: string]: string | boolean;
    };
    hash: {
        [k: string]: string | boolean;
    };
};
type DomRouterDataPartialType = {
    path?: string;
    search?: {
        [k: string]: string | boolean;
    };
    hash?: {
        [k: string]: string | boolean;
    };
};
type DomRouterEventType = 'change' | 'pathchange' | 'searchchange' | 'hashchange';
export type DomRouterOutletType = {
    [k: string]: any;
} & ({
    path: string;
} & ({
    getDom: (data: DomRouter) => HTMLElement | DomModel;
} | {
    model: DomModelClassType;
} | {
    redirect: string;
}));
export declare class DomRouter {
    private _basePath;
    private _rqid;
    private _listener;
    private _current;
    private _currentData;
    constructor(_basePath?: string);
    private _anim;
    get active(): boolean;
    get data(): DomRouterDataType;
    set data(v: DomRouterDataPartialType);
    get path(): string;
    get search(): {
        [k: string]: string | boolean;
    };
    get hash(): {
        [k: string]: string | boolean;
    };
    start(): this;
    stop(): this;
    on(type: DomRouterEventType, callback: (evt: ListenerEvent<string, any>) => any): this;
    getOutlet(routes: DomRouterOutletType[], basePath?: string): HTMLElement;
    link<E extends HTMLElement = HTMLElement>(element: E, path: string, hash?: {
        [k: string]: any;
    } | boolean): E;
    getLink(contents: string | HTMLElement, path: string, hash?: {
        [k: string]: any;
    } | boolean): HTMLAnchorElement;
    private static _instance;
    static get instance(): DomRouter;
    static link<E extends HTMLElement = HTMLElement>(element: E, path: string, hash?: {
        [k: string]: any;
    } | boolean): E;
    static getLink(contents: string | HTMLElement | Text, path: string, hash?: {
        [k: string]: any;
    } | boolean): HTMLAnchorElement;
    static toLink(anchorElement: HTMLAnchorElement): HTMLAnchorElement;
    static getOutlet(routes: DomRouterOutletType[], basePath?: string): HTMLElement;
    static getData(): DomRouterDataType;
    static setData(v: DomRouterDataPartialType): void;
    static getPath(): string;
    static setPath(p: string): void;
    static getSearch(): {
        [k: string]: any;
    };
    static setSearch(obj: {
        [k: string]: any;
    }): void;
    static getHash(): {
        [k: string]: any;
    };
    static setHash(obj: {
        [k: string]: any;
    }): void;
    static obj2Hash(obj: {
        [k: string]: any;
    }): string;
    static hash2Obj(hash: string): {
        [k: string]: any;
    };
}
export {};
