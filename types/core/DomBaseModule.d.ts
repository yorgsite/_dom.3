import { DomRulesDataType } from "./types";
import { DomStore } from "../tools/DomStore";
import { DomModelClassType } from "./DomModel";
declare class DomModuleItem<T> {
    data: T;
    isPrivate: boolean;
    constructor(data: T, isPrivate?: boolean);
}
export declare class DomBaseModule {
    id: string;
    models: Map<string, DomModuleItem<DomModelClassType>>;
    private _modules;
    private _store;
    constructor();
    get store(): DomStore;
    import(module: DomBaseModule | DomBaseModule[] | (DomModelClassType) | (DomModelClassType)[], isPrivate?: boolean): void;
    addModel<TT extends any>(tagName: TT, modelConstructor?: ((targName: string, ...args: Array<any>) => HTMLElement), cssRules?: DomRulesDataType, isPrivate?: boolean): void;
    hasOwnModel(tagName: string, publicOnly?: boolean): boolean;
    hasModel(tagName: string, publicOnly?: boolean): boolean;
    getModel(tagName: string, publicOnly?: boolean): (DomModelClassType) | undefined;
}
export {};
