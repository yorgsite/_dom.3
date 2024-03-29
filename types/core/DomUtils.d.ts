export declare class DomUtils {
    static loadImage(src: string): Promise<HTMLImageElement>;
    static img2canvas(img: HTMLImageElement): HTMLCanvasElement;
    static loadCanvas(src: string): Promise<HTMLCanvasElement>;
    static download(fileName: string, src: String | HTMLImageElement | File | Blob | {
        toDataURL: Function;
        [k: string]: any;
    }): void;
    static downloadFile(src: File): void;
    static getParentPile(dom: HTMLElement, condition: Function, maxDeep?: number): HTMLElement[] | null;
    static findParent(dom: HTMLElement, condition: Function, maxDeep?: number): HTMLElement | null;
    static getAttributes(target: HTMLElement): Record<string, any>;
}
