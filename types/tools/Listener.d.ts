export declare class ListenerEvent<TType extends string = string, TData extends any = any> {
    type: TType;
    data: TData;
    target: any;
    private _stopped;
    constructor(type: TType, data: TData, target: any);
    get stopped(): boolean;
    stop(): void;
}
export declare class ListenerCallback<TType extends string, TData> {
    type: TType;
    callback: (evt: ListenerEvent<TType, TData>) => any;
    once: boolean;
    constructor(type: TType, callback: (evt: ListenerEvent<TType, TData>) => any, once: boolean);
}
/**
*
*/
export declare class Listener<TType extends string = string, TData extends any = any> {
    private _target?;
    private _callbacks;
    constructor(_target?: any);
    private _on;
    has(type: TType): boolean;
    /**
    *
    * @param type the event type
    * @param callback
    * @param prepend
    * @returns
    */
    on(type: TType | TType[], callback: (evt: ListenerEvent<TType, TData>) => any, prepend?: boolean): this;
    once(type: TType | TType[], callback: (evt: ListenerEvent<TType, TData>) => any, prepend?: boolean): this;
    off(type: TType | TType[], callback: (evt: ListenerEvent<TType, TData>) => any): this;
    flush(type: TType, data: TData, target?: any): any[];
    clear(type?: TType | TType[]): void;
}
