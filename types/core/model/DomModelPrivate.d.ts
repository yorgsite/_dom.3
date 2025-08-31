import { Listener } from "../../tools/Listener";
import { DomChildType, DomModelClassType, DomRulesType } from "../types";
import { DomModel } from "./DomModel";
export declare class DomModelPrivate<TData extends Record<string, any> = Record<string, any>> {
    private model;
    private _inputs;
    private children;
    private instanceRef;
    private _dom;
    domCycleListener: Listener<string, any>;
    private _rules;
    private _cssVars;
    requireLifeObserver: boolean;
    private modelLifeObserver;
    private modelAttrObserver;
    inputListener: Listener<string, {
        name: string;
        value: any;
        oldValue: any;
    }>;
    private _inputProxy;
    constructor(model: DomModelClassType, instance: DomModel, _inputs?: TData, children?: Array<DomChildType>);
    initDom(): Promise<void>;
    private initDomElement;
    private initDomShadowRules;
    private initDomTriggers;
    private overrided;
    private initLifeObserver;
    get instance(): DomModel;
    get dom(): HTMLElement;
    get rules(): DomRulesType;
    get cssVars(): {
        [k: string]: string;
    };
    get shadowRules(): boolean;
    get inputs(): TData;
    clone(): DomModel<Record<string, any>>;
    connect(): void;
    disconnect(): void;
    setInput(name: string, value: any): void;
    onAttributeChange(): void;
}
