

export class DomAttributesObserver{
	private _observer:MutationObserver;
	private _attrBuffer:Map<string,any>=new Map();
	private _onchange:(name:string,value:any,oldValue:any)=>void=()=>{};
	constructor(
		private target:HTMLElement
	){
		this._observer = new MutationObserver(this._mutationCallback);
		this.connect();
	}

	connect(){
		this.disconnect();
		this._observer.observe(this.target, { attributes: true});
	}
	disconnect(){
		this._observer.disconnect();
	}
	private _mutationCallback=(mutationList:MutationRecord[])=>{
		for (const mutation of mutationList) {
			if (mutation.type === "attributes") {
				const name=mutation.attributeName;
				const oldValue=this._attrBuffer.get(name);
				const value = (mutation.target as HTMLElement).getAttribute(name);
				this._attrBuffer.set(name,value);
				// console.log(' -changed '+name,' from ',oldValue,' to ',value);
				this._onchange(name,value,oldValue);
			}
		}
	}
	public onChange(callback:(name:string,value:any,oldValue:any)=>void){
		this._onchange	= callback;
	}

}