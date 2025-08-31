import { DomBaseModule } from "./DomBaseModule";
import { DomModel } from "./model/DomModel";
import { DomChildType, DomParamsType } from "./types";
export declare class DomCore {
    private static _uidDate;
    private static _uidCnt;
    private static libraries;
    static get uid(): string;
    static html<T extends HTMLElement = HTMLElement>(tagName: string, params?: Record<string, any>, children?: Array<DomChildType>, namespace?: string): T;
    static parseProps(target: Record<string, any>, data: Record<string, any>): any;
    static render<T extends HTMLElement = HTMLElement>(module: DomBaseModule | null, tagName: string | DomModel, params?: DomParamsType, children?: Array<DomChildType>, namespace?: string): T;
    static objName2tagName(tagName: string): string;
    static tagName2objName(tagName: string): string;
}
