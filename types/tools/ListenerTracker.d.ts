export declare class ListenerTracker {
    private _listenersData;
    private _eventTarget;
    constructor(eventTarget?: EventTarget);
    private _removeListenerData;
    get eventTarget(): EventTarget | null;
    set eventTarget(newTarget: EventTarget | null);
    addEventListener: (type: string, listener: (evt: Event) => void, options?: boolean | AddEventListenerOptions) => void;
    removeEventListener: (type: string, listener: (evt: Event) => void, options?: boolean | EventListenerOptions) => void;
    clearEventListeners(type: string): void;
}
