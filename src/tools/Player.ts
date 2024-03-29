export type PlayerTweenConfigType={
	cubic?:[number,number];
	quadratic?:number;
	cos?:number;
};

export class Player {
	private static _players: Player[] = [];
	private static _rqid: number = 0;
	private static _lastTime: number = 0;
	private static _update = () => {
		this._rqid = requestAnimationFrame(this._update);
		const d = Date.now();
		const ft = d - this._lastTime;
		this._lastTime = d;
		this._players.forEach(p => p._update(d, ft));
	}
	private static addPlayer(player: Player) {
		const d = Date.now();
		if (!this._rqid) {
			this._rqid = requestAnimationFrame(this._update);
			this._lastTime = d;
		}
		const ft = d - this._lastTime;
		player._update(d, ft);
		this._players.push(player);
	}
	private static removePlayer(player: Player) {
		this._players.splice(this._players.findIndex(p => player), 1);
		if (!this._players.length) cancelAnimationFrame(this._rqid);
	}

	static tween(cb:(p:number)=>void,timeout:number,tconf:PlayerTweenConfigType={}){
		const sd=Date.now();
		let formula=(p:number)=>p;
		if('cos' in tconf){
			// formula=(p:number)=>0.5-Math.cos(p*Math.PI)*0.5;
			formula=(p:number)=>{
				if(p<0.5){
					return 0.5-Math.pow(Math.cos(p*Math.PI),tconf.cos)*0.5;
				}else{
					return 0.5+Math.pow(Math.cos((1-p)*Math.PI),tconf.cos)*0.5;
				}
			};
		}else if('quadratic' in tconf){
			const arr2=[0,tconf.quadratic,1];
			formula=(perc:number)=>(Math.pow(1-perc,2)*arr2[0]
			+2*(1-perc)*perc*arr2[1]
			+Math.pow(perc,2)*arr2[2]);
		}else if('cubic' in tconf){				
			const arr2=[0,tconf.cubic[0],tconf.cubic[1],1];
			formula=(perc:number)=>(Math.pow(1-perc,3)*arr2[0]
			+3*Math.pow(1-perc,2)*perc*arr2[1]
			+3*(1-perc)*Math.pow(perc,2)*arr2[2]+Math.pow(perc,3)*arr2[3]);
		}
		return new Promise((resolve)=>{
			new Player()
			.onStop(p=>resolve(p))
			.onUpdate(p=>{
				const perc=Math.min(p.elapsed/timeout,1);
				cb(formula(perc));
				if(perc===1){
					p.stop();
				}
			}).start();
		})
	}

	// ---------------------------

	private _started: number = 0;
	private _update(date: number, ft: number) {
		this.date = date;
		this.ft = ft;
		this.elapsed = date - this._started;
		this._onUpdate(this);
	}
	private _onUpdate: (p: Player) => void = () => { };
	private _onStart: (p: Player) => void = () => { };
	private _onStop: (p: Player) => void = () => { };

	public date: number;
	public ft: number;
	public elapsed: number;
	onUpdate(callback:(p: Player) => void) {
		this._onUpdate=callback;
		return this;
	}
	onStart(callback:(p: Player) => void) {
		this._onStart=callback;
		return this;
	}
	onStop(callback:(p: Player) => void) {
		this._onStop=callback;
		return this;
	}
	start() {
		if (!this._started) {
			this._started = Date.now();
			Player.addPlayer(this);
			this._onStart(this);
		}
		return this;
	}
	stop() {
		if (this._started) {
			Player.removePlayer(this);
			this._onStop(this);
			this._started = 0;
		}
		return this;
	}
}

