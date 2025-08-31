import { ListenerEvent } from "../../tools/Listener";
import { CssVarsType, DomChildType, DomModelClassType, DomRulesDataType, DomRulesType } from "../types";
export declare class DomModel<TData extends Record<string, any> = Record<string, any>> {
    static tagName: string;
    static className: string;
    static shadowRules: boolean;
    static rulesData: DomRulesDataType | ((instance: DomModelClassType) => DomRulesDataType);
    static cssVars: CssVarsType | undefined;
    constructor(inputs?: TData, children?: Array<DomChildType>);
    get dom(): HTMLElement;
    get tagName(): string;
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
    onInput(name: string, callback: (evt: ListenerEvent<string, any>) => any): void;
    _domOn(type: string, callback: (evt: ListenerEvent<string, any>) => any): void;
    _domOnceBuilt(callback: (evt?: ListenerEvent<string, any>) => any): void;
    _domOnInit(params?: Record<string, any>, children?: Array<DomChildType>): Promise<unknown> | void;
    _domOnAfterInit(params?: Record<string, any>, children?: Array<DomChildType>): Promise<unknown> | void;
    _domOnAttributeChange(name: string, value: any, oldValue: any): Promise<unknown> | void;
    _domOnReady(): Promise<unknown> | void;
    _domOnDestroy(): Promise<unknown> | void;
    _domOnBuild(params?: Record<string, any>, children?: Array<DomChildType>): HTMLElement | Array<DomChildType> | Promise<HTMLElement> | Promise<Array<DomChildType>>;
}
