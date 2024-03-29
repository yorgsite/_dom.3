

export class EventBuffer{
	private _eventpile:{target:EventTarget,type:string,callback:(evt:Event)=>any}[]=[];
	private _listening:boolean=false;
	get listening(){
		return this._listening;
	}
	on(target:EventTarget,type:string,callback:(evt:Event)=>any){
		this._eventpile.push({target,type,callback});
		return this;
	}
	start(){
		if(!this._listening){
			this._eventpile.map(ev=>ev.target.addEventListener(ev.type,ev.callback));
			this._listening=true;
		}
		return this;
	}
	stop(){
		if(this._listening){
			this._eventpile.map(ev=>ev.target.removeEventListener(ev.type,ev.callback));
			this._listening=false;
		}
		return this;
	}
	clear(){
		this.stop();
		this._eventpile=[];
		return this;
	}
}
// 