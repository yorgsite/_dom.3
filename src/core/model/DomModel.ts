// import { DomModelContructorType, DomModule, Listener, ListenerEvent } from "..";
import { Listener, ListenerEvent } from "../../tools/Listener";
import {
	CssVarsType,
	DomChildType,
	DomModelClassType,
	DomRulesDataType,
	DomRulesType,
} from "../types";
import { domModelMap, DomModelRegistry } from "./DomModelRegistry";

export class DomModel<TData extends Record<string, any> = Record<string, any>> {
	public static tagName: string;
	public static className: string;
	public static shadowRules = false;
	public static rulesData: DomRulesDataType | ((instance: DomModelClassType) => DomRulesDataType) =
		{};
	public static cssVars: CssVarsType | undefined;

	// -----------------

	constructor(inputs: TData = {} as TData, children: Array<DomChildType> = []) {
		DomModelRegistry.register(this, inputs, children);
	}
	// -----------------

	public get dom(): HTMLElement {
		return domModelMap.get(this).dom;
	}

	get tagName(): string {
		return (this.constructor as DomModelClassType).tagName;
	}

	get rules(): DomRulesType {
		return domModelMap.get(this).rules;
	}
	get cssVars(): { [k: string]: string } {
		return domModelMap.get(this).cssVars;
	}

	get shadowRules(): boolean {
		return domModelMap.get(this).shadowRules;
	}

	get inputs(): TData {
		return domModelMap.get(this).inputs as TData;
	}
	clone() {
		return domModelMap.get(this).clone();
	}
	connect() {
		domModelMap.get(this).connect();
	}
	disconnect() {
		domModelMap.get(this).disconnect();
	}

	setInput(name: string, value: any) {
		domModelMap.get(this).setInput(name, value);
	}

	onInput(name: string, callback: (evt: ListenerEvent<string, any>) => any) {
		const priv = domModelMap.get(this);
		if (!priv.inputListener) {
			priv.inputListener = new Listener();
			this._domOn("attributechange", (evt: ListenerEvent<string, any>) => {
				priv.inputListener.flush(name, evt.data);
			});
		}
		priv.inputListener.on(name, callback);
	}

	_domOn(type: string, callback: (evt: ListenerEvent<string, any>) => any) {
		const priv = domModelMap.get(this);
		if (["ready", "destroy"].includes(type)) {
			priv.requireLifeObserver = true;
		} else if ((type = "attributechange")) {
			priv.onAttributeChange();
		}
		priv.domCycleListener.on(type, callback);
	}
	_domOnceBuilt(callback: (evt?: ListenerEvent<string, any>) => any) {
		if (this.dom) {
			callback();
		} else {
			domModelMap.get(this).domCycleListener.once("afterinit", callback);
		}
	}

	// ----------------- Overrides --*

	_domOnInit(
		params?: Record<string, any>,
		children: Array<DomChildType> = []
	): Promise<unknown> | void {}
	_domOnAfterInit(
		params?: Record<string, any>,
		children: Array<DomChildType> = []
	): Promise<unknown> | void {}
	_domOnAttributeChange(name: string, value: any, oldValue: any): Promise<unknown> | void {}
	_domOnReady(): Promise<unknown> | void {}
	_domOnDestroy(): Promise<unknown> | void {}
	_domOnBuild(
		params?: Record<string, any>,
		children: Array<DomChildType> = []
	): HTMLElement | Array<DomChildType> | Promise<HTMLElement> | Promise<Array<DomChildType>> {
		return undefined;
	}
}
