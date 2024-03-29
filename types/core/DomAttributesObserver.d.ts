export declare class DomAttributesObserver {
    private target;
    private _observer;
    private _attrBuffer;
    private _onchange;
    constructor(target: HTMLElement);
    connect(): void;
    disconnect(): void;
    private _mutationCallback;
    onChange(callback: (name: string, value: any, oldValue: any) => void): void;
}
