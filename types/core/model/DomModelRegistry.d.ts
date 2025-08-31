import { CssVarsType, DomChildType, DomModelClassType, DomRulesType } from "../types";
import { DomModel } from "./DomModel";
import { DomModelPrivate } from "./DomModelPrivate";
export declare class DomModelRegistry {
    private readonly model;
    static register<TData extends Record<string, any> = Record<string, any>>(instance: DomModel, _inputs?: TData, _children?: Array<DomChildType>): void;
    static get(instance: DomModel): DomModelRegistry;
    static registerModel(model: DomModelClassType): void;
    static getRulesData(model: DomModelClassType): {
        [x: string]: import("../types").DomRulesDataType;
    };
    static getRules(model: DomModelClassType, sheet?: CSSStyleSheet): DomRulesType;
    tagName: string;
    rules: DomRulesType;
    cssVars: CssVarsType | undefined;
    constructor(model: DomModelClassType);
    init(): void;
    initTagName(): void;
    initRules(): void;
}
export declare const domModelStaticMap: WeakMap<DomModelClassType, DomModelRegistry>;
export declare const domModelMap: WeakMap<DomModel<Record<string, any>>, DomModelPrivate<Record<string, any>>>;
