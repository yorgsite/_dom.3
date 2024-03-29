export declare class EventBuffer {
    private _eventpile;
    private _listening;
    get listening(): boolean;
    on(target: EventTarget, type: string, callback: (evt: Event) => any): this;
    start(): this;
    stop(): this;
    clear(): this;
}
