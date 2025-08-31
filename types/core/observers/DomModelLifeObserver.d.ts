import { DomModel } from "../model/DomModel";
export declare class DomModelLifeObserver {
    private modelInstance;
    private _life;
    private _regz;
    constructor(modelInstance: DomModel);
    connect(): void;
    disconnect(): void;
    onReady(callback: () => void): void;
    onDestroy(callback: () => void, timeout?: number): void;
}
