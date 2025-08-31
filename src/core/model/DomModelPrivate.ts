// import { DomModelContructorType, DomModule, Listener, ListenerEvent } from "..";
import { Listener, ListenerEvent } from "../../tools/Listener";
import { DomCore } from "../DomCore";
import { DomCss } from "../DomCss";
import { DomModelAttrObserver } from "../observers/DomModelAttrObserver";
import { DomModelLifeObserver } from "../observers/DomModelLifeObserver";
import { DomChildType, DomModelClassType, DomRulesType } from "../types";
import { DomModel } from "./DomModel";
import { DomModelRegistry, domModelStaticMap } from "./DomModelRegistry";

export class DomModelPrivate<TData extends Record<string, any> = Record<string, any>> {
	// @ts-ignore WeakRef unidentified by typescript
	private instanceRef: InstanceType<typeof WeakRef<DomModel<TData>>>;
	private _dom: HTMLElement;
	public domCycleListener: Listener<string, any> = new Listener();
	private _rules: DomRulesType;
	private _cssVars: { [k: string]: string } | undefined;
	public requireLifeObserver = false;
	private modelLifeObserver: DomModelLifeObserver | null = null;
	private modelAttrObserver: DomModelAttrObserver | null = null;
	public inputListener: Listener<string, { name: string; value: any; oldValue: any }>;
	private _inputProxy: InstanceType<typeof Proxy>;

	constructor(
		private model: DomModelClassType,
		instance: DomModel,
		private _inputs: TData = {} as TData,
		private children: Array<DomChildType> = []
	) {
		// @ts-ignore WeakRef unidentified by typescript
		this.instanceRef = new WeakRef(instance);
	}
	async initDom() {
		this._dom = document.createElement(this.model.tagName);
		await this.initDomElement();
		if (this.model.shadowRules) {
			this.initDomShadowRules();
		}
		this.domCycleListener.flush("build", this);

		const afterProm = this.instance._domOnAfterInit(this._inputs, this.children);
		if (afterProm instanceof Promise) await afterProm;

		this.domCycleListener.flush("afterinit", this);

		this.initDomTriggers();
	}

	private async initDomElement() {
		const initProm = this.instance._domOnInit(this._inputs, this.children);
		if (initProm instanceof Promise) await initProm;
		this.domCycleListener.flush("init", this);

		if (this.model.className) {
			this._dom.className = this.model.className;
		}
		const domProm = this.instance._domOnBuild(this._inputs, this.children);
		let dom = domProm instanceof Promise ? await domProm : domProm;

		if (!(dom instanceof Array)) dom = [dom];

		if (
			!dom.every(d => d instanceof HTMLElement || d instanceof DomModel || typeof d === "string")
		) {
			throw [
				"",
				"_dom model " + this.model.name + " Error :",
				" - method _domOnBuild must return an HTMLElement or a non empty list of string | HTMLElement | DomModel.",
			].join("\n");
		}

		this._dom.append(...dom.map(d => (d instanceof DomModel ? d.dom : d)));
	}

	private initDomShadowRules() {
		const rattr = "_dom_" + Math.random().toString(36).slice(2);
		this._dom.setAttribute(rattr, "");
		const rdata = DomModelRegistry.getRulesData(this.model);
		for (let k in rdata) {
			rdata[k + "[" + rattr + "]"] = rdata[k];
			delete rdata[k];
		}

		const style = DomCore.html("style", { type: "text/css" }) as HTMLStyleElement;
		this._dom.appendChild(style);
		setTimeout(() => {
			this._rules = DomCss.rules(rdata, style.sheet);

			if (this.model.cssVars) {
				this._cssVars = DomCss.handleVars(
					this.model.tagName + "[" + rattr + "]",
					this.model.cssVars,
					style.sheet
				);
			}
		}, 1);
	}

	private initDomTriggers() {
		if (this.requireLifeObserver) this.initLifeObserver();

		if (this.overrided("_domOnReady")) {
			this.instance._domOn("ready", async (evt: ListenerEvent<"ready", any>) => {
				await this.instance._domOnReady();
			});
		}
		if (this.overrided("_domOnDestroy")) {
			this.instance._domOn("destroy", async (evt: ListenerEvent<"destroy", any>) => {
				await this.instance._domOnDestroy();
			});
		}
		if (this.overrided("_domOnAttributeChange")) {
			this.instance._domOn(
				"attributechange",
				async (evt: ListenerEvent<"attributechange", any>) => {
					await this.instance._domOnAttributeChange(
						evt.data.name,
						evt.data.value,
						evt.data.oldValue
					);
				}
			);
		}
		if (this._inputs && this.inputListener) {
			for (let k in this._inputs) {
				this.inputListener.flush(k, { name: k, value: this._inputs[k], oldValue: undefined });
			}
		}
	}
	private overrided(methodName: keyof DomModel) {
		return this.instance[methodName] !== DomModel.prototype[methodName];
	}

	private initLifeObserver() {
		if (!this.modelLifeObserver) {
			this.modelLifeObserver = new DomModelLifeObserver(this.instance);
			this.modelLifeObserver.onReady(() => {
				this.domCycleListener.flush("ready", this);
			});
			this.modelLifeObserver.onDestroy(() => {
				this.domCycleListener.flush("destroy", this);
			});
		}
	}
	// ------------------

	get instance(): DomModel {
		return this.instanceRef.deref();
	}

	get dom() {
		if (!this._dom) {
			this.initDom();
		}
		return this._dom;
	}

	get rules(): DomRulesType {
		return this.shadowRules ? this._rules : domModelStaticMap.get(this.model).rules;
	}
	get cssVars(): { [k: string]: string } {
		return this.shadowRules ? this._cssVars : domModelStaticMap.get(this.model).cssVars;
	}
	get shadowRules(): boolean {
		return this.model.shadowRules;
	}
	get inputs(): TData {
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
		return this._inputProxy as TData;
	}
	// ------------------
	clone() {
		return new this.model(this._inputs, this.children);
	}
	connect() {
		this.modelLifeObserver.connect();
	}
	disconnect() {
		if (this.modelLifeObserver) {
			this.modelLifeObserver.disconnect();
		}
	}
	setInput(name: string, value: any) {
		if (typeof this._inputs === "object") {
			const oldValue = this._inputs[name];
			(this._inputs as Record<string, any>)[name] = value;
			if (this.inputListener) {
				this.inputListener.flush(name, { name, value, oldValue });
			}
		}
	}
	onAttributeChange() {
		if (!this.modelAttrObserver) {
			this.modelAttrObserver = new DomModelAttrObserver(this.instance);
			this.modelAttrObserver.onChange((name, value, oldValue) => {
				this.domCycleListener.flush("attributechange", { name, value, oldValue });
			});
		}
	}
}
