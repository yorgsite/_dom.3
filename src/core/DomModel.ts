// import { DomModelContructorType, DomModule, Listener, ListenerEvent } from "..";
import { CssVarsType, RRecord, DomRulesType, DomRulesDataType } from "./types";
import { DomCore } from "./DomCore";
import { DomCss } from "./DomCss";
import { DomLifeObserver } from "./DomLifeObserver";
import { Classes } from "../tools/Classes";
import { Listener, ListenerEvent } from "../tools/Listener";
import { DomAttributesObserver, DomModule } from "../_dom";

export type DomModelClassType = (new (...args: any[]) => DomModel) &
	Pick<typeof DomModel, keyof typeof DomModel>;

// export type DomElementType = (new (
// 	...args:any[]
// ) => HTMLElement) & Pick<typeof HTMLElement, keyof typeof HTMLElement>;
export type HTMLChildType = string | Text | HTMLElement;
// export type DomChildType=HTMLChildType|DomModelClassType;
export type DomChildType = HTMLChildType | DomModel;

class DomModelCore {
	static getRulesData(model: DomModelClassType) {
		let data = typeof model.rulesData === "function" ? model.rulesData(model) : model.rulesData;
		return { [model.tagName]: data };
	}

	static getRules(model: DomModelClassType, sheet?: CSSStyleSheet): DomRulesType {
		return DomCss.rules(this.getRulesData(model), sheet);
	}
}

class DomModelLifeObserver {
	private _life: DomLifeObserver;
	private _regz = {
		ready: false,
		destroy: false,
	};
	constructor(private modelInstance: DomModel) {}
	connect() {
		this._life.connect();
	}
	disconnect() {
		this._life.disconnect();
	}
	public onReady(callback: () => void) {
		if (this._regz.destroy) {
			throw [
				"",
				"_dom.model " + this.modelInstance.tagName + " build Error:",
				" - onReady must be called before onDestroy.",
			].join("\n");
		}
		this._regz.ready = true;
		const _init = () => {
			this._life = this._life || new DomLifeObserver(this.modelInstance.dom);
			this._life.onReady(callback);
		};
		if (this.modelInstance.dom) {
			_init();
		} else requestAnimationFrame(_init);
	}
	public onDestroy(callback: () => void, timeout: number = 1) {
		this._regz.destroy = true;
		const _init = () => {
			this._life = this._life || new DomLifeObserver(this.modelInstance.dom);
			this._life.onDestroy(callback);
		};
		if (this.modelInstance.dom) {
			_init();
		} else requestAnimationFrame(_init);
	}
}

class DomModelAttrObserver {
	private _attrObserver: DomAttributesObserver | null = null;
	constructor(private modelInstance: DomModel) {}
	public onChange(callback: (name: string, value: any, oldValue: any) => void) {
		const _init = () => {
			this._attrObserver = this._attrObserver || new DomAttributesObserver(this.modelInstance.dom);
			this._attrObserver.onChange(callback);
		};
		if (this.modelInstance.dom) {
			_init();
		} else requestAnimationFrame(_init);
	}
}

export class DomModel<T extends HTMLElement = HTMLElement> {
	private static _rules: DomRulesType;
	private static _cssVars: CssVarsType | undefined;

	public static tagName: string;
	public static className: string;
	public static shadowRules = false;
	public static rulesData: DomRulesDataType | ((instance: DomModelClassType) => DomRulesDataType) =
		{};
	public static cssVars: CssVarsType | undefined;

	// -----------------

	static initRules() {
		if (!this._rules) {
			this._rules = DomModelCore.getRules(this, null);
			if (this.cssVars) {
				this._cssVars = DomCss.handleVars(this.tagName, this.cssVars, null);
			}
		}
	}

	static initTagName(constr: DomModelClassType) {
		if (!constr.tagName) {
			constr.tagName = DomCore.objName2tagName(constr.name).slice(1);
			if (constr.tagName.lastIndexOf("-model") === constr.tagName.length - 6) {
				constr.tagName = constr.tagName.slice(0, -6);
			}
		}
	}

	static rules() {
		return this._rules;
	}

	// -----------------

	private _modelLifeObserver: DomModelLifeObserver | null = null;
	private _modelAttrObserver: DomModelAttrObserver | null = null;
	private _inputListener: Listener<string, { name: string; value: any; oldValue: any }>;
	private _mp_listener: Listener<string, any> = new Listener();
	private _module: DomModule;
	private _rules: DomRulesType;
	private _cssVars: { [k: string]: string } | undefined;
	private _inputProxy: InstanceType<typeof Proxy>;
	private _requireLifeObserver = false;

	// public dom:HTMLElement;
	private _dom: HTMLElement;
	public get dom() {
		if (!this._dom) {
			this.___init_dom_model(this._inputs, this._children);
		}
		return this._dom;
	}
	constructor(
		private _inputs: Record<string, any> = {},
		private _children: Array<DomChildType> = []
	) {}
	clone() {
		// console.log('%c-----CLONE-----','color:#a0e');
		// console.log(this.constructor.name);
		return new (this.constructor as DomModelClassType)(this._inputs, this._children);
	}
	private ___init_dom_model(inputs?: Record<string, any>, children: Array<DomChildType> = []) {
		const constr = this.constructor as DomModelClassType;
		// if(!constr.tagName)alert(DomCore.objName2tagName(constr.name).slice(1));
		DomModel.initTagName(constr);

		this._domOnInit(inputs, children);
		this._mp_listener.flush("init", this);

		this._dom = document.createElement(this.tagName);
		if (constr.className) {
			this._dom.className = constr.className;
		}

		let dom = this._domOnBuild(inputs, children);
		if (!(dom instanceof Array)) dom = [dom];

		if (
			!dom.every(d => d instanceof HTMLElement || d instanceof DomModel || typeof d === "string")
		) {
			throw [
				"",
				"_dom model " + this.constructor.name + " Error :",
				" - method _domOnBuild must return an HTMLElement or a non empty list of string | HTMLElement | DomModel.",
			].join("\n");
		}

		this._dom.append(...dom.map(d => (d instanceof DomModel ? d.dom : d)));

		if (constr.shadowRules) {
			const rattr = "_dom_" + Math.random().toString(36).slice(2);
			this._dom.setAttribute(rattr, "");
			const rdata = DomModelCore.getRulesData(constr);
			for (let k in rdata) {
				rdata[k + "[" + rattr + "]"] = rdata[k];
				delete rdata[k];
			}

			// console.log('-- rdata',rdata,DomCss.rulesText(rdata).join('\n'));

			const style = DomCore.html("style", { type: "text/css" }) as HTMLStyleElement;
			this._dom.appendChild(style);
			setTimeout(() => {
				this._rules = DomCss.rules(rdata, style.sheet);

				if (constr.cssVars) {
					this._cssVars = DomCss.handleVars(
						this.tagName + "[" + rattr + "]",
						constr.cssVars,
						style.sheet
					);
				}
			}, 1);
		} else {
			constr.initRules();
		}
		this._mp_listener.flush("build", this);

		this._domOnAfterInit(inputs, children);
		this._mp_listener.flush("afterinit", this);

		if (this._requireLifeObserver) this._initLifeObserver();

		if (this._domOnReady !== DomModel.prototype._domOnReady) {
			this._domOn("ready", (evt: ListenerEvent<"ready", any>) => {
				this._domOnReady();
			});
		}
		if (this._domOnDestroy !== DomModel.prototype._domOnDestroy) {
			this._domOn("destroy", (evt: ListenerEvent<"destroy", any>) => {
				this._domOnDestroy();
			});
		}
		if (this._domOnAttributeChange !== DomModel.prototype._domOnAttributeChange) {
			this._domOn("attributechange", (evt: ListenerEvent<"attributechange", any>) => {
				this._domOnAttributeChange(evt.data.name, evt.data.value, evt.data.oldValue);
			});
		}
		if (inputs && this._inputListener) {
			for (let k in inputs) {
				this._inputListener.flush(k, { name: k, value: inputs[k], oldValue: undefined });
			}
		}
	}
	// -----------------

	get tagName(): string {
		return (this.constructor as typeof DomModel).tagName;
	}

	get rules(): DomRulesType {
		const constr = this.constructor as typeof DomModel;
		return constr.shadowRules ? this._rules : constr._rules;
	}
	get cssVars(): { [k: string]: string } {
		const constr = this.constructor as typeof DomModel;
		return constr.shadowRules ? this._cssVars : constr._cssVars;
	}

	get shadowRules(): boolean {
		return (this.constructor as typeof DomModel).shadowRules;
	}
	get module(): DomModule {
		return this._module;
	}

	get inputs() {
		if (!this._inputProxy) {
			this._inputProxy = new Proxy(
				{},
				{
					get: (tgt, prop: string) => this._inputs[prop],
					set: (tgt, prop: string, value: any) => {
						this.setInput(prop, value);
						return true;
					},
				}
			);
		}
		return this._inputProxy;
	}

	private _initLifeObserver() {
		if (!this._modelLifeObserver) {
			this._modelLifeObserver = new DomModelLifeObserver(this);
			this._modelLifeObserver.onReady(() => {
				this._mp_listener.flush("ready", this);
			});
			this._modelLifeObserver.onDestroy(() => {
				this._mp_listener.flush("destroy", this);
			});
		}
	}
	connect() {
		this._modelLifeObserver.connect();
	}
	disconnect() {
		if (this._modelLifeObserver) {
			this._modelLifeObserver.disconnect();
		}
	}

	setInput(name: string, value: any) {
		const oldValue = this._inputs[name];
		this._inputs[name] = value;
		if (this._inputListener) {
			this._inputListener.flush(name, { name, value, oldValue });
		}
	}

	onInput(name: string, callback: (evt: ListenerEvent<string, any>) => any) {
		if (!this._inputListener) {
			this._inputListener = new Listener();
			this._domOn("attributechange", (evt: ListenerEvent<string, any>) => {
				this._inputListener.flush(name, evt.data);
			});
		}
		this._inputListener.on(name, callback);
	}

	_domOn(type: string, callback: (evt: ListenerEvent<string, any>) => any) {
		// console.log("°°°°°°°°°° ON ",this.tagName,type);
		if (["ready", "destroy"].includes(type)) {
			// console.log('on',type,this.dom);
			this._requireLifeObserver = true;
			// if(type==='ready'&&this._mp_listener.has('destroy')){
			// 	throw(['',
			// 		'_dom.model '+this.tagName+' build Error:',
			// 		' - onReady must be called before onDestroy.'
			// 	].join('\n'));
			// }
		} else if ((type = "attributechange")) {
			if (!this._modelAttrObserver) {
				this._modelAttrObserver = new DomModelAttrObserver(this);
				this._modelAttrObserver.onChange((name, value, oldValue) => {
					this._mp_listener.flush("attributechange", { name, value, oldValue });
				});
			}
		}
		this._mp_listener.on(type, callback);
	}
	_domOnceBuilt(callback: (evt?: ListenerEvent<string, any>) => any) {
		if (this._dom) {
			callback();
		} else {
			this._mp_listener.once("afterinit", callback);
		}
	}

	// ----------------- Overrides

	_domOnInit(params?: Record<string, any>, children: Array<DomChildType> = []) {}
	_domOnAfterInit(params?: Record<string, any>, children: Array<DomChildType> = []) {}
	_domOnAttributeChange(name: string, value: any, oldValue: any) {}
	_domOnReady() {}
	_domOnDestroy() {}
	_domOnBuild(
		params?: Record<string, any>,
		children: Array<DomChildType> = []
	): HTMLElement | Array<DomChildType> {
		return undefined;
	}
}
