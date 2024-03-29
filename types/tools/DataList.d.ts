export declare class DataListLink<T> {
    private _datalist;
    private _container;
    private _renderer;
    private _rid;
    private _data;
    dumb: boolean;
    constructor(_datalist: DataList<T>, _container: HTMLElement, _renderer: (data: T, id: number, list: T[]) => HTMLElement);
    _changed(): void;
    private refresh;
    get list(): DataList<T>;
    set list(v: DataList<T>);
    get container(): HTMLElement;
    set container(c: HTMLElement);
    get renderer(): (data: T, id: number, list: T[]) => HTMLElement;
    set renderer(r: (data: T, id: number, list: T[]) => HTMLElement);
    get data(): T[];
    set data(d: T[]);
}
export declare class DataList<T> {
    private _data;
    private _links;
    constructor(_data?: T[]);
    private _refreshLinks;
    get data(): T[];
    set data(d: T[]);
    link(container: HTMLElement, renderer: (data: T, id: number, list: T[]) => HTMLElement): DataListLink<T>;
    attach(link: DataListLink<T>): void;
    detach(link: DataListLink<T>): void;
    push(...args: T[]): void;
    pop(): T;
    unshift(...args: T[]): void;
    shift(): T;
    splice(id: number, length: number, ...args: T[]): T[];
    sort(method?: (a: T, b: T) => number): T[];
    reverse(): T[];
    map<R extends any = T>(method: (value: T, id: number, array: T[]) => R): DataList<R>;
    slice(start: number, end: number): DataList<T>;
    get length(): number;
}
