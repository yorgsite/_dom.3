export declare class DomLifeObserver {
    private target;
    private _observer;
    private _ondestroy;
    private _onready;
    private _ready;
    private _intree;
    constructor(target: HTMLElement);
    get ready(): boolean;
    connect(): void;
    disconnect(): void;
    private _mutationCallback;
    onReady(callback: () => void): void;
    onDestroy(callback: () => void): void;
}
