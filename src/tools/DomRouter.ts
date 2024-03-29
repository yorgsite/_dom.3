import { DomModel, DomModelClassType } from "../_dom";
import { Listener, ListenerEvent } from "./Listener";

type DomRouterDataType={
	path:string;
	search:{[k:string]:string|boolean};
	hash:{[k:string]:string|boolean};
};
type DomRouterDataPartialType={
	path?:string;
	search?:{[k:string]:string|boolean};
	hash?:{[k:string]:string|boolean};
};
type DomRouterEventType='change'|'pathchange'|'searchchange'|'hashchange';

export type DomRouterOutletType = {[k:string]:any} & ({
	path:string;
} & (
	{
		getDom:(data:DomRouter)=>HTMLElement|DomModel;
	}|{
		model:DomModelClassType,
	}|{
		redirect:string;
	}
));


export class DomRouter{
	private _rqid:number=0;
	private _listener=new Listener<DomRouterEventType,any>();
	private _current:{
		path:string;
		search:string;
		hash:string;
	}={
		path:'',
		search:'',
		hash:''
	};
	private _currentData:DomRouterDataType={
		path:'',
		search:{},
		hash:{}
	};
	constructor(
		private _basePath:string=''
	){}
	
	private _anim=()=>{
		this._rqid=requestAnimationFrame(this._anim);
		const oldData:DomRouterDataType={
			path:this._currentData.path,
			search:this._currentData.search,
			hash:this._currentData.hash
		};
		let changed=false;

		if(window.location.pathname!==this._current.path){
			changed=true;
			const oldValue = this._currentData.path;
			this._current.path=window.location.pathname;
			this._currentData.path=DomRouter.getPath();
			this._listener.flush('pathchange',{value:this._currentData.path,oldValue});
		}
		if(window.location.search!==this._current.search){
			changed=true;
			const oldValue = this._currentData.search;
			this._current.search=window.location.search;
			this._currentData.search=DomRouter.getSearch();
			this._listener.flush('searchchange',{value:this._currentData.search,oldValue});
		}
		if(window.location.hash!==this._current.hash){
			changed=true;
			const oldValue = this._currentData.hash;
			this._current.hash=window.location.hash;
			this._currentData.hash=DomRouter.getHash();
			this._listener.flush('hashchange',{value:this._currentData.hash,oldValue});
		}
		if(changed){
			this._listener.flush('change',{value:this._currentData,oldValue:oldData});
		}
	};

	get active():boolean{return !!this._rqid;}
	get data():DomRouterDataType{return this._currentData;}
	set data(v:DomRouterDataPartialType){
		DomRouter.setData(v);
	}
	get path(){return this._currentData.path;}
	get search(){return this._currentData.search;}
	get hash(){return this._currentData.hash;}

	start(){
		if(!this._rqid){
			this._rqid=requestAnimationFrame(this._anim);
		}
		return this;
	}
	stop(){
		if(DomRouter._instance===this){
			console.warn('DomRouter.instance can\'t be stopped');
			return this;
		}
		if(this._rqid){
			cancelAnimationFrame(this._rqid);
			this._rqid=0;
		}
		return this;
	}

	on(type:DomRouterEventType,callback:(evt:ListenerEvent<string,any>)=>any){
		this._listener.on(type,callback);
		return this;
	}

	getOutlet(routes:DomRouterOutletType[],basePath:string=''):HTMLElement{
		return new DomRouterOutlet(this,routes,this._basePath+basePath).dom;
	}

	link<E extends HTMLElement = HTMLElement>(element:E,path:string,hash:{[k:string]:any}|boolean=false):E{
		return DomRouter.link<E>(element,this._basePath+path,hash);
	}
	getLink(contents:string|HTMLElement,path:string,hash:{[k:string]:any}|boolean=false):HTMLAnchorElement{
		return DomRouter.getLink(contents,this._basePath+path,hash);
	}


	// ----------------------------------
	private static _instance:DomRouter;

	static get instance():DomRouter{
		return this._instance||(this._instance=new DomRouter().start());
	}

	static link<E extends HTMLElement = HTMLElement>(element:E,path:string,hash:{[k:string]:any}|boolean=false):E{
		const b=typeof(hash)==='boolean';
		const h = b?'':this.obj2Hash(hash);
		const url=path+(h?'#'+h:'');
		element.onclick=evt=>{
			const uri=url+(b&&hash?window.location.hash:'');
			window.history.pushState({uri},'',uri);
			return false;
		};
		if(element instanceof HTMLAnchorElement){
			element.href=url;
		}
		return element;
	}

	static getLink(contents:string|HTMLElement|Text,path:string,hash:{[k:string]:any}|boolean=false):HTMLAnchorElement{
		const element = document.createElement('a');
		if(typeof(contents)==='string'){
			element.innerHTML=contents;
		}else{
			element.append(contents);
		}
		return this.link<HTMLAnchorElement>(element,path,hash);
	}
	static toLink(anchorElement:HTMLAnchorElement):HTMLAnchorElement{
		anchorElement.onclick=evt=>{
			window.history.pushState({url:anchorElement.href},'',anchorElement.href);
			return false;
		};
		return anchorElement;
	}
	static getOutlet(routes:DomRouterOutletType[],basePath:string=''):HTMLElement{
		return this.instance.getOutlet(routes,basePath);
	}

	static getData():DomRouterDataType{
		return {
			path:this.getPath(),
			search:this.getSearch(),
			hash:this.getHash()
		};
	}
	static setData(v:DomRouterDataPartialType){
		const p = 'path' in v ? v.path : window.location.pathname;
		const s = 'search' in v ? DomRouter.obj2Hash(v.search) : window.location.search;
		const h = 'hash' in v ? DomRouter.obj2Hash(v.hash) : window.location.hash;
		const newurl = window.location.protocol + "//" + window.location.host+ (p&&p.charAt(0)!=='/' ? '/'+p:'')+ s +h;
		window.history.pushState({path:newurl},'',newurl);
	}
	static getPath(){
		return window.location.pathname;
	}
	static setPath(p:string){
		const newurl = window.location.protocol + "//" + window.location.host
		+(p&&p.charAt(0)==='/' ? '':'/')+p+ window.location.search +window.location.hash;
		
		window.history.pushState({path:newurl},'',newurl);
	}
	static getSearch(){
		return this.hash2Obj(window.location.search);
	}
	static setSearch(obj : {[k:string]:any}){
		window.location.search=this.obj2Hash(obj);
	}
	static getHash(){
		return this.hash2Obj(window.location.hash);
	}
	static setHash(obj : {[k:string]:any}){
		window.location.hash=this.obj2Hash(obj);
	}
	static obj2Hash(obj : {[k:string]:any}){
		return Object.entries(obj)
		.map(([k,v])=>k+'='+encodeURIComponent(v))
		.join('&');
	}
	static hash2Obj(hash:string){
		hash = (hash&&(hash.charAt(0)==='#'||hash.charAt(0)==='?')?hash.slice(1):hash);
		if(!hash)return {};
		const obj : {[k:string]:any} = {};
		hash
		.split("&")
		.map(v => {
			const id = v.indexOf('=');
			const [key, value] = id>-1?[v.slice(0,id),decodeURIComponent(v.slice(id+1))]:[v,true];
			if(String(key) in obj){
				if(!(obj[String(key)] instanceof Array))obj[String(key)]=[obj[String(key)]];
				obj[String(key)].push(value);
			}else{
				obj[String(key)]=value;
			}
		})
		return obj;
	}	
}

class DomRouterOutlet{
	public dom=document.createElement('dom-router-outlet');
	private _path:string;
	constructor(
		private _router:DomRouter,
		private _routes:DomRouterOutletType[],
		private _basePath:string=''
	){
		if(!this._routes.find(r=>r.path==='*')){
			throw(['',
				'DomRouterOutlet Error :',
				'routes list is missing the default route {path:\'*\',...}.'
			].join('\n'))
		}
		if(_router.path)this._pathChanged(_router.path);
		_router.on('pathchange',evt=>this._pathChanged(evt.data.value));
	}
	private _pathChanged(path:string){
		if(this._path===path)return;
		this._path=path;
		// console.log('_pathChanged',this._path);
		
		let route = this._routes.find(r=>this._basePath+r.path===path);
		if(!route)route=this._routes.find(r=>r.path==='*');
		if(route){
			if(route.path===route.redirect){
				//DomRouterOutlet error
				throw(['',
					'DomRouterOutlet Error :',
					'Properties path and redirect "'+route.path+'" must be different.'
				].join('\n'))
			}else if(route.redirect){
				// console.log(this._routes);
				
				if(!this._routes.find(r=>r.path===route.redirect)){
					// console.log(this._routes.slice(0),path,this._routes.find(r=>r.path===path));
					
					throw(['',
						'DomRouterOutlet Error :',
						'Bad redirection "'+route.redirect+'" not found.'
					].join('\n'))
				}
				DomRouter.setPath(this._basePath+route.redirect);
			}else if(route.getDom){
				this.dom.innerHTML='';
				const dd=route.getDom(this._router);
				const dom =  dd instanceof DomModel?dd.dom:dd;
				this.dom.append(dom);
			}else if(route.model){
				this.dom.innerHTML='';
				const dom=new route.model().dom;
				this.dom.append(dom);
			}
		}
	}
}