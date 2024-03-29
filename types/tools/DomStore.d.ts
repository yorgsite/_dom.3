export type DomStoreValueType = string | number | boolean;
export type DomStoreWatcherType = (type: string, value: any, old: any) => void;
export type DomStoreDataType = {
    [n: string]: DomStoreValueType;
};
export declare class DomStoreLink {
    element: DomStoreElement;
    target: {
        [k: string]: any;
    };
    key: string;
    id: any;
    io: {
        input?: (v: any) => any;
        output?: (v: any) => any;
    };
    value: DomStoreValueType;
    listeners: {
        type: string;
        callback: (evt: Event) => void;
    }[];
    constructor(element: DomStoreElement, target: {
        [k: string]: any;
    }, key: string, id: any, io?: {
        input?: (v: any) => any;
        output?: (v: any) => any;
    });
    checkTargetValue(): void;
    getTargetValue(): any;
    setValue(value: DomStoreValueType): DomStoreLink;
    destroy(): void;
}
export declare class DomStoreElement {
    private store;
    private name;
    value: DomStoreValueType;
    linkz: Map<any, DomStoreLink>;
    constructor(store: DomStore, name: string, value: DomStoreValueType);
    setValue(value: DomStoreValueType): void;
    setLink(target: {
        [k: string]: any;
    }, key: string, id: any, io: {
        input?: (v: any) => any;
        output?: (v: any) => any;
    }): void;
    removeLink(id: any): void;
    valueChanged(value: any, link?: DomStoreLink): void;
    destroy(): void;
    static fromLink(store: DomStore, name: string, target: {
        [k: string]: any;
    }, key: string, id: any, io: {
        input?: (v: any) => any;
        output?: (v: any) => any;
    }): DomStoreElement;
}
export declare class DomStoreLocalStorageLink {
    private _store;
    private _prefix;
    private static _postPrefix;
    constructor(_store: DomStore, _prefix: string);
    get prefix(): string;
    get entries(): [string, DomStoreValueType][];
    get object(): {
        [k: string]: DomStoreValueType;
    };
    get(key: string): any;
    set(key: string, value: DomStoreValueType): void;
}
export declare class DomStore {
    private elements;
    watchers: Map<string, DomStoreWatcherType[]>;
    private _proxy;
    _localStorages: Map<string, DomStoreLocalStorageLink>;
    constructor();
    get values(): {
        [k: string]: any;
    };
    set(name: string, value: DomStoreValueType): void;
    get(name: string): DomStoreValueType;
    link(name: string, target: {
        [k: string]: any;
    }, key: string, id?: any, io?: {
        input?: (v: any) => any;
        output?: (v: any) => any;
    }): void;
    unlink(name: string, id: any): void;
    watch(name: string, callback: DomStoreWatcherType): void;
    unwatch(name: string, callback?: DomStoreWatcherType): void;
    linkLocalStorage(prefix: string): void;
    delete(name: string, keepWatching?: boolean): void;
    destroy(): void;
    toData(): DomStoreDataType;
    fromData(obj: DomStoreDataType): this;
    static textable(target: any, key?: string): boolean;
    static numberable(target: any, key?: string): boolean;
    static booleanable(target: any, key?: string): boolean;
}
