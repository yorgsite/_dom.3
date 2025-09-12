export interface DomSignalRegistryInterface<T> {
    effects: Set<() => void>;
    listeners: ((v: T) => void)[];
}
export interface DomSignalInterface<T> {
    (): T;
    set(v: T): void;
    listen: (callback: (v: T) => void) => void;
    registry: DomSignalRegistryInterface<T>;
}
export declare const MemberSignal: <T>() => (target: any, propertyKey: string) => void;
export declare const signal: <T>(value?: T) => DomSignalInterface<T>;
export declare const effect: (callback: () => void, signals?: DomSignalInterface<any>[]) => void;
export declare const computed: <T>(callback: () => T) => DomSignalInterface<T>;
