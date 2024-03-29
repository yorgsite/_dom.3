import { DomCore } from "./DomCore";
import { DomModel } from "./DomModel";
import { DomUtils } from "./DomUtils";

export class DomShadow {
	static models = new Map();
	constructor(scope: HTMLElement, model: DomModel) {
		let shadow = scope.attachShadow({ mode: "open" });
		let attrs = DomUtils.getAttributes(scope);
		let style = [];
		for (let r in model.rules)
			style.push((model.rules as { [k: string]: CSSStyleRule })[r].cssText);
		shadow.appendChild(DomCore.html("style", { type: "text/css", textContent: style.join("\n") }));
		const wrapper = DomCore.render(null, model, attrs);
		shadow.appendChild(wrapper);
	}

	/**
	renders your model intanciable via html by using dom shadow
	* @parameter {string} tagName the model name.
	* @parameter {object} [argTypes] argument types by their name.
	*/
	static modelShadow(model: DomModel) {
		if (this.models.has(model.tagName)) return;
		class _class_ extends HTMLElement {
			private _shadow: DomShadow;
			constructor() {
				super();
				this._shadow = new DomShadow(this, model);
			}
			connectedCallback() {}
			attributeChangedCallback(name: any, oldValue: any, newValue: any) {}
		}
		this.models.set(model.tagName, _class_);
		customElements.define(model.tagName, _class_);
		// let name=DomCore.tagName2objName(tagName);
		// if(domModule.hasModel(tagName)){
		// 	const root=domModule.rootModule;
		// 	const model=domModule.getModel(tagName);
		// let name=DomUtils.tagName2objName(tagName);
		// 	let args=(_models[tagName].constructor+'').split(')',2)[0].split('(')[1].split(',');
		// 	let atl=args.map(a=>argTypes.hasOwnProperty(a)?argTypes[a]:0);
		// 	class _class_ extends HTMLElement {
		// 		constructor() {
		// 			super();
		// 			new DomShadow(this,tagName,args,atl);
		// 		}
		// 	}
		// const shadowData={name,[name]:class extends _class_ {}};
		// this.models.set(tagName,shadowData);
		// customElements.define(tagName, shadowData[name]);

		// 	// ******************
		// 	// let args=(model.constructor+'').split('(').slice(1);
		// 	// let ares=[];
		// 	// for(let i=0,ps,lv=1;i<args.length&&lv;i++){
		// 	// 	ps=args[i].split(')');
		// 	// 	lv+=1-ps.length;
		// 	// 	if(lv){
		// 	// 		ares.push(ps.join(')'));
		// 	// 		lv++;
		// 	// 	}
		// 	// }

		// }else{
		// 	throw(['',
		// 		'_dom.modelShadow Error:',
		// 		'argument[0] "tagName"="'+tagName+'" has no model declared.'
		// 	].join('\n'))
		// }
	}
}
