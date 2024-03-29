export type PlayerTweenConfigType = {
    cubic?: [number, number];
    quadratic?: number;
    cos?: number;
};
export declare class Player {
    private static _players;
    private static _rqid;
    private static _lastTime;
    private static _update;
    private static addPlayer;
    private static removePlayer;
    static tween(cb: (p: number) => void, timeout: number, tconf?: PlayerTweenConfigType): Promise<unknown>;
    private _started;
    private _update;
    private _onUpdate;
    private _onStart;
    private _onStop;
    date: number;
    ft: number;
    elapsed: number;
    onUpdate(callback: (p: Player) => void): this;
    onStart(callback: (p: Player) => void): this;
    onStop(callback: (p: Player) => void): this;
    start(): this;
    stop(): this;
}
