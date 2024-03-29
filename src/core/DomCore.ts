import { DomBaseModule } from "./DomBaseModule";
// import { DomModel, DomModelInstance } from "./DomModel";
import { DomChildType, DomModel } from "./DomModel";
import { DomParamsType } from "./types";



// type ValueOf<Obj> = Obj[keyof Obj];
// type OneOnly<Obj, Key extends keyof Obj> = { [key in Exclude<keyof Obj, Key>]: null } & Pick<Obj, Key>;
// type OneOfByKey<Obj> = { [key in keyof Obj]: OneOnly<Obj, key> };
// export type OneOf<Obj> = ValueOf<OneOfByKey<Obj>>;



export class DomCore{
	
	private static _uidDate=0;
	private static _uidCnt=0;
	static get uid():string{
		const d=Date.now();
		if(d===this._uidDate){
			this._uidCnt++;
		}else{
			this._uidCnt=0;
			this._uidDate=d;
		}
		return this._uidDate.toString(36)+'-'+this._uidCnt;
	}

	static html<T extends HTMLElement = HTMLElement>(
		tagName:string,
		params?:Record<string,any>,
		children?:Array<DomChildType>,
		namespace?:string
	):T{		
		const element = namespace?
		document.createElementNS(namespace,tagName)
		:document.createElement(tagName);
		if(params){
			this.parseProps(element,params);
		}
		if(children){
			element.append(...children.map(v=>v instanceof DomModel?v.dom:v) as Array<string|Node>);
		}
		return element as T;
	}

	static parseProps(target:Record<string,any>,data:Record<string,any>):any{
		Object.entries(data)
		.map(([key,value])=>{
			if(typeof(value)==='object'){
				this.parseProps(target[key],value);
			}else{
				target[key]=value;
			}
		});
	}

	static render<T extends HTMLElement = HTMLElement>(
		module:DomBaseModule|null,
		tagName:string|DomModel,
		params?:DomParamsType,
		children:Array<DomChildType>=[],
		namespace?:string
	):T{
		// console.log('XXX Render '+tagName+' = ',module?.hasModel2(tagName+''),params,children);
		if(module?.hasModel(tagName+'')){
			const m2 = module.getModel(tagName+'') as typeof DomModel;
			const instance = new m2(params,children);
			//@ts-ignore assign private
			instance._module=module;
			return instance.dom as T;
		}
		// else if(tagName instanceof DomModel){}
		return DomCore.html<T>(tagName+'',params,children,namespace);
	};
	
	static objName2tagName(tagName:string):string{
		return tagName.replace(/([A-Z])/g, (a, b)=>'-'+b.toLowerCase());
	}

	static tagName2objName(tagName:string):string{
		return tagName.replace(/\-([a-z])/g, (a, b)=>b.toUpperCase());
	}

}