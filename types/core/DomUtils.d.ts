export declare class LoadMediaProgress {
    url: string;
    loaded: number;
    total: number;
    percent: number;
    constructor(url: string, loaded?: number, total?: number, percent?: number);
}
export declare class DomUtils {
    static loadMediaUri(url: string, onProgress?: (p: LoadMediaProgress) => void): Promise<string>;
    static loadImage(src: string, onProgress?: (p: LoadMediaProgress) => void): Promise<HTMLImageElement>;
    static img2canvas(img: HTMLImageElement): HTMLCanvasElement;
    static loadCanvas(src: string): Promise<HTMLCanvasElement>;
    static download(fileName: string, src: String | HTMLImageElement | File | Blob | {
        toDataURL: Function;
        [k: string]: any;
    }): void;
    static downloadFile(src: File): void;
    static getParentPile(dom: HTMLElement, condition: (dom: Element) => boolean | void, maxDeep?: number): HTMLElement[] | null;
    static findParent(dom: HTMLElement, condition: (dom: Element) => boolean | void, maxDeep?: number): HTMLElement | null;
    static getAttributes(target: HTMLElement): Record<string, any>;
    static getScrollBarWidth(force?: boolean): number;
}
