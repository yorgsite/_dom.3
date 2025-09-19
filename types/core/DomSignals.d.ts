export interface DomSignalRegistredEffectInterface {
    callback: () => void;
    registries: Set<DomSignalRegistryInterface<any>>;
}
export interface DomSignalRegistryInterface<T> {
    effects: Set<DomSignalRegistredEffect>;
}
export interface DomSignalInterface<T, TR> {
    (): TR;
    set(v: T): void;
    registry: DomSignalRegistryInterface<T>;
}
declare class DomSignalEffectHandler {
    constructor(register: DomSignalRegistredEffect);
    destroy(): void;
}
declare class DomSignalRegistredEffect {
    callback: () => void | Promise<void>;
    alive: boolean;
    registries: Set<DomSignalRegistryInterface<any>>;
    constructor(callback: () => void | Promise<void>);
}
declare class DomSignalOptions<T, TR> {
    equal: (v1: T, v2: T) => boolean;
    transform: (v: T) => TR;
    constructor(opt?: Partial<DomSignalOptions<T, TR>>);
}
export declare const MemberSignal: <T>() => (target: any, propertyKey: string) => void, signal: <T, TR = T>(value?: T, opt?: Partial<DomSignalOptions<T, TR>>) => DomSignalInterface<T, TR>, effect: (callback: () => void) => DomSignalEffectHandler, computed: <T>(callback: () => T | Promise<T>, opt?: Partial<DomSignalOptions<T, T>>) => () => T;
export {};
