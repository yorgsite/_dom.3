export declare class Cookie {
    /**
    *
    * @param name
    * @returns
    */
    static get(name: string): string | null;
    /**
    *
    * @param name
    * @returns
    */
    static has(name: string): boolean;
    /**
    *
    * @param name
    * @param path
    */
    static delete(name: string, path?: string): void;
    /**
    *
    * @param name
    * @param value
    * @param options
    */
    static set(name: string, value: string, options?: CookiesOptionsType): void;
    /**
    *
    * @returns
    */
    static getAll(): {
        [k: string]: string;
    };
}
export type CookiesOptionsType = {
    secure?: boolean;
    session?: boolean;
    path?: string;
    domain?: string;
    expires?: string;
    expireDays?: number;
    expireHours?: number;
    expireMinutes?: number;
};
