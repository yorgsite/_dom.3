import { DomModel } from "../model/DomModel";
export declare class DomModelAttrObserver {
    private modelInstance;
    private _attrObserver;
    constructor(modelInstance: DomModel);
    onChange(callback: (name: string, value: any, oldValue: any) => void): void;
}
