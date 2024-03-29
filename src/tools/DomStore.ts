
export type DomStoreValueType=string|number|boolean;

export type DomStoreWatcherType=(type:string,value:any,old:any)=>void;

export type DomStoreDataType={[n:string]:DomStoreValueType};


export class DomStoreLink{
	public value:DomStoreValueType;
	public listeners:{type:string,callback:(evt:Event)=>void}[]=[];
	constructor(
		public element:DomStoreElement,
		public target:{[k:string]:any},
		public key:string,
		public id:any,
		public io:{input?:(v:any)=>any,output?:(v:any)=>any}={}
	){
		// console.log(target,io.input);
		
		if(!this.io.input)this.io.input=v=>v;
		if(!this.io.output)this.io.output=v=>v;
		if(DomStore.booleanable(this.target,this.key)){
			// this.value=target.checked;
			this.listeners.push({type:'change',callback:(evt:Event)=>{
				this.checkTargetValue();
			}});
		}else if(DomStore.numberable(this.target,this.key)){
			this.listeners.push({type:'input',callback:(evt:Event)=>{
				this.checkTargetValue();
			}});
		}else if(DomStore.textable(this.target,this.key)){
			const type = target instanceof HTMLSelectElement ? 'change' : 'input';
			this.listeners.push({type,callback:(evt:Event)=>{
				this.checkTargetValue();
			}});
		}
		this.listeners.map(l=>target.addEventListener(l.type,l.callback));
	}
	checkTargetValue(){
		const v = this.io.output(this.getTargetValue());
		if(v!==this.value){
			this.value=v;
			this.element.valueChanged(this.value,this);
		}
	}
	getTargetValue(){
		if(DomStore.booleanable(this.target,this.key))return this.target.checked;
		if(DomStore.numberable(this.target,this.key))return parseFloat(this.target.value);
		if(DomStore.textable(this.target,this.key))return this.target.value;
		return false;
	}
	
	setValue(value:DomStoreValueType):DomStoreLink{
		if(DomStore.booleanable(this.target,this.key)){
			this.value=!!value;
			this.target.checked=this.io.input(this.value);
		}else if(DomStore.numberable(this.target,this.key)){
			this.value=typeof(value)==='number'?value:parseFloat(value+'');
			this.target.value=''+this.io.input(this.value);
		}else if(DomStore.textable(this.target,this.key)){
			this.value=value+'';
			this.target.value=this.io.input(this.value);
		}else{		
			this.value=value;
			this.target[this.key]=this.io.input(this.value);
		}
		
		return this;
	}
	destroy(){
		this.listeners.map(l=>this.target.removeEventListener(l.type,l.callback));
		this.listeners=[];
	}
}

export class DomStoreElement{
	public linkz:Map<any,DomStoreLink>=new Map();
	constructor(
		private store:DomStore,
		private name:string,
		public value:DomStoreValueType
	){

	}
	setValue(value:DomStoreValueType){
		this.valueChanged(value);
	}
	setLink(
		target:{[k:string]:any},
		key:string,
		id:any,
		io:{input?:(v:any)=>any,output?:(v:any)=>any}
	){
		this.removeLink(id);
		this.linkz.set(id,new DomStoreLink(this,target,key,id,io).setValue(this.value));
	}
	removeLink(id:any){
		if(this.linkz.has(id)){
			this.linkz.get(id).destroy();
			this.linkz.delete(id);
		}
	}

	valueChanged(value:any,link?:DomStoreLink){
		if(this.value!==value){
			const old=this.value;
			this.value=value;
			Array.from(this.linkz.values())
			.filter(s=>s!==link)
			.map(s=>s.setValue(this.value));
			if(this.store.watchers.has(this.name)){
				this.store.watchers.get(this.name).map(cb=>cb('change',this.value,old));
			}
			Array.from(this.store._localStorages.values())
			.forEach(ls=>ls.set(this.name,value))	
		}
	}
	destroy(){
		Array.from(this.linkz.values())
		.map(s=>s.destroy());
		this.linkz=new Map();
	}

	static fromLink(
		store:DomStore,
		name:string,
		target:{[k:string]:any},
		key:string,
		id:any,
		io:{input?:(v:any)=>any,output?:(v:any)=>any}
	):DomStoreElement{
		const element = new DomStoreElement(store,name,false);
		const link = new DomStoreLink(element,target,key,id,io);
		element.linkz.set(id,link);
		link.checkTargetValue();
		return element;
	}
}

export class DomStoreLocalStorageLink{
	private static _postPrefix='-DomStoreLocalStorageLink-';
	// instance
	constructor(
		private _store:DomStore,
		private _prefix:string
	){
		this.entries.forEach(([k,v])=>{
			this._store.set(k,v);
		});
		window.addEventListener('storage',evt=>{
			if(evt.storageArea===localStorage&&evt.key.indexOf(this.prefix)===0){
				const key = evt.key.slice(this.prefix.length);
				if(evt.newValue===null){
					this._store.delete(key);
				}else{
					this._store.set(key,JSON.parse(evt.newValue));
				}
			}		
		});
	}
	get prefix(){
		return DomStoreLocalStorageLink._postPrefix+this._prefix;
	}
	get entries():[string,DomStoreValueType][]{
		return Object.entries(localStorage)
		.filter(v=>v[0].indexOf(this.prefix)===0)
		.map(([k,v])=>[k.slice(this.prefix.length),JSON.parse(v)]);
	}
	get object():{[k:string]:DomStoreValueType}{
		const obj:{[k:string]:DomStoreValueType}={};
		this.entries.forEach(([k,v])=>obj[k]=v);
		return obj;
	}
	get(key:string){
		const value=localStorage.getItem(this.prefix+key);
		return value===null?value:JSON.parse(value);
	}
	set(key:string,value:DomStoreValueType){
		return localStorage.setItem(this.prefix+key,JSON.stringify(value));
	}
}


interface DomStoreProxyType{
	revocable<T extends object, S extends object>(
        target: T,
        handler: ProxyHandler<S>,
    ): { proxy: T; revoke: () => void };
    new <T extends object>(target: T, handler: ProxyHandler<T>): T;
    new <T extends object, S extends object>(target: S, handler: ProxyHandler<S>): T;
	[k:string]:any;
};

export class DomStore{
	private elements:Map<string,DomStoreElement>=new Map();
	public watchers:Map<string,DomStoreWatcherType[]>=new Map();
	private _proxy:typeof Proxy;
	_localStorages:Map<string,DomStoreLocalStorageLink>=new Map();
	constructor(){

	}

	get values():{[k:string]:any}{
		const obj:DomStoreDataType = {};
		return this._proxy||(this._proxy=new Proxy<{[k:string]:any}>({} as {[k:string]:any} ,{
			get:(tgt,prop:string)=>this.get(prop),
			set:(tgt,prop:string,val:DomStoreValueType)=>{
				this.set(prop,val);
				return true;
			}
		}) as DomStoreProxyType);
	}

	set(name:string,value:DomStoreValueType){
		//this._localStorages.set(prefix,new DomStoreLocalStorageLink(this,prefix));
		if(this.elements.has(name)){
			this.elements.get(name).setValue(value);
		}else{
			this.elements.set(name,new DomStoreElement(this,name,value));
		}
	}
	get(name:string):DomStoreValueType{
		return this.elements.has(name)?this.elements.get(name).value:'';
	}
	link(
		name:string,
		target:{[k:string]:any},
		key:string,
		id:any=target,
		io:{input?:(v:any)=>any,output?:(v:any)=>any}={}
	){
		if(!id)id=target;
		if(this.elements.has(name)){
			this.elements.get(name).setLink(target,key,id,io);
		}else{
			this.elements.set(name,DomStoreElement.fromLink(this,name,target,key,id,io));
		}
	}
	unlink(name:string,id:any){
		if(this.elements.has(name)){
			this.elements.get(name).removeLink(id);
		}
	}
	watch(
		name:string,
		callback:DomStoreWatcherType
	){
		if(!this.watchers.has(name)){
			this.watchers.set(name,[]);
		}
		this.watchers.get(name).push(callback);
	}
	unwatch(
		name:string,
		callback?:DomStoreWatcherType
	){
		if(this.watchers.has(name)){
			if(callback){
				const wl = this.watchers.get(name);
				const id = wl.findIndex(w=>w===callback);
				if(id>-1){
					wl.splice(id,1);
					if(!wl.length)this.watchers.delete(name);
				}
			}else{
				this.watchers.delete(name);
			}
		}
	}
	
	linkLocalStorage(prefix:string){
		if(!this._localStorages.has(prefix)){
			this._localStorages.set(prefix,new DomStoreLocalStorageLink(this,prefix));
		}
	}

	delete(name:string,keepWatching:boolean=false){
		if(this.elements.has(name)){
			this.elements.get(name).destroy();
			this.elements.delete(name);
		}
		if(!keepWatching&&this.watchers.has(name)){
			this.watchers.delete(name);
		}
	}
	destroy(){
		Array.from(this.elements.values())
		.map(s=>s.destroy());
		this.elements=new Map();
		this.watchers=new Map();
	}
	toData():DomStoreDataType{
		const obj : DomStoreDataType = {};
		Array.from(this.elements.keys())
		.map(name=>obj[name]=this.elements.get(name).value);
		return obj;
	}
	fromData(obj : DomStoreDataType){
		Object.entries(obj).map(([n,v])=>this.set(n,v));
		return this;
	}

	static textable(target:any,key?:string):boolean{
		return (key==='value'||!key)&&(target instanceof HTMLInputElement
		||target instanceof HTMLSelectElement
		||target instanceof HTMLTextAreaElement);
	}
	static numberable(target:any,key?:string):boolean{
		return (key==='value'||!key)&&(target instanceof HTMLInputElement && target.type==='number');
	}
	static booleanable(target:any,key?:string):boolean{
		return (key==='checked'||!key)&&(target instanceof HTMLInputElement && target.type==='checkbox');
	}
	// static sourceable(target:any,key?:string):boolean{
	// 	return (key==='src'||!key)&&(target instanceof HTMLImageElement || target instanceof HTMLVideoElement || target instanceof HTMLAudioElement || target instanceof HTMLIFrameElement);
	// }
	// static size2dable(target:any,key?:string):boolean{
	// 	return (key==='width'||key==='height'||!key)&&(target instanceof HTMLImageElement || target instanceof HTMLVideoElement || target instanceof HTMLCanvasElement || target instanceof HTMLIFrameElement);
	// }
}



