

export class DomLifeObserver{
	private _observer:MutationObserver;
	private _ondestroy:()=>void=()=>{};
	private _onready:()=>void=()=>{};
	private _ready=false;
	private _intree=false;
	constructor(
		private target:HTMLElement
	){
		this._observer = new MutationObserver(this._mutationCallback);
		this.connect();
	}
	get ready(){
		return this._ready;
	}
	connect(){
		this.disconnect();
		// if(document.documentElement.contains(this.target)){
		// 	this._intree=this._ready=true;
		// 	requestAnimationFrame(()=>{
		// 		if(document.documentElement.contains(this.target)){
		// 			this._onready();
		// 		}
		// 	});
		// }
		// console.log('observe');
		
		this._observer.observe(document.documentElement, { childList: true , subtree: true});
	}
	disconnect(){
		if(!this._intree&&this._ready){
			this._ready=false;
			this._ondestroy();
		}
		this._observer.disconnect();
	}
	private _mutationCallback=(mutationList:MutationRecord[])=>{
		// console.log('MCB');
		for (const mutation of mutationList) {
			if (mutation.type === "childList") {
				const nl = this._intree ? mutation.removedNodes : mutation.addedNodes;
				if (nl.length) {
					const rnl=Array.from(nl);
					if(rnl.indexOf(this.target) > -1 || rnl.find(parent => parent.contains(this.target))){
						// console.log('======',
						// this.target,
						// this._intree,
						// this._intree ? 'mutation.removedNodes' : 'mutation.addedNodes',
						// rnl);
						
						if(!this._intree){
							this._intree=true;
						}else{
							this._intree=false;
						}
						if(this._intree!==this._ready){
							if(!this._ready){
								this._ready=true;
								this._onready();
							}else{
								requestAnimationFrame(()=>{
									if(!this._intree){
										this.disconnect();
									}
								});
							}
						}
					}
				}
				// break;
			}
		}			
	}
	public onReady(callback:()=>void){
		this._onready	= callback;
	}
	public onDestroy(callback:()=>void){
		this._ondestroy	= callback;
	}
}

