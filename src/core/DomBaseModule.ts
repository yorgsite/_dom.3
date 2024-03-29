import {DomRulesDataType, RRecord } from "./types";
import {DomCore } from "./DomCore";

import { DomStore } from "../tools/DomStore";
import { DomModel, DomModelClassType } from "./DomModel";

class DomModuleItem<T>{
	constructor(
		public data:T,
		public isPrivate:boolean=false
	){}
}

export class DomBaseModule{
	id:string=DomCore.uid;
	models:Map<string,DomModuleItem<DomModelClassType>>=new Map();
	// models:Map<string,DomModelClassType>=new Map();
	private _modules:Array<DomModuleItem<DomBaseModule>>=[];
	private _store:DomStore;

	constructor(){

	}
	get store():DomStore{
		return this._store||(this._store=new DomStore());
	}
	import(
		module:DomBaseModule|DomBaseModule[]
		|(DomModelClassType)|(DomModelClassType)[],
		isPrivate:boolean=false
	){
		// console.log('----import',module);
		
		if(module instanceof Array){
			module.map(m=>this.import(m,isPrivate));
		}else if(DomModel.isPrototypeOf(module)){
			const m = (module as DomModelClassType);
			DomModel.initTagName(m);
			this.models.set(m.tagName,new DomModuleItem<DomModelClassType>(m,isPrivate));
		}else if(!this._modules.find(m=>m.data===module)){
			this._modules.push(new DomModuleItem<DomBaseModule>(module as DomBaseModule,isPrivate));
		}
	}
	
	addModel<TT extends any>(
		tagName:TT,
		modelConstructor: ((targName:string,...args:Array<any>)=>HTMLElement)=undefined,
		cssRules:DomRulesDataType=undefined,
		isPrivate:boolean=false
	){
		let model;
		if(typeof(tagName)==='string'){

			class _Model_ extends DomModel{
				public static tagName:string=tagName as string;
				public static rulesData:DomRulesDataType|((instance:DomModelClassType)=>DomRulesDataType)=cssRules||{};
				constructor(
					params?:Record<string,any>,
					children:Array<string|HTMLElement>=[],			
				){
					super(params,children);
				}
				_domOnBuild(params?: Record<string, any>, children?: (string | HTMLElement)[]): HTMLElement {
					// console.log('+++++++ new ',this.tagName,params,children);
					
					return modelConstructor.apply(this,[tagName,params,children]);
				}
			}
			this.models.set(tagName,new DomModuleItem<DomModelClassType>(_Model_ as DomModelClassType,isPrivate));
		}

	}


	hasOwnModel(tagName:string,publicOnly:boolean=false):boolean{
		return this.models.has(tagName)&&(!publicOnly||!this.models.get(tagName).isPrivate);
	}
	hasModel(tagName:string,publicOnly:boolean=false):boolean{
		return this.hasOwnModel(tagName,publicOnly)||!!this._modules.find(m=>m.data.hasModel(tagName,true));
	}
	getModel(tagName:string,publicOnly:boolean=false):(DomModelClassType)|undefined{	
		
		if(this.hasOwnModel(tagName,publicOnly)){
			return this.models.get(tagName).data;
		}else {
			for(let mod of this._modules){
				if(!mod.isPrivate){
					const m=mod.data.getModel(tagName,true);
					if(m)return m;	
				}
			}
		}
	}
}
