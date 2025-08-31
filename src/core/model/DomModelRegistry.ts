import { DomCore } from "../DomCore";
import { DomCss } from "../DomCss";
import { CssVarsType, DomChildType, DomModelClassType, DomRulesType } from "../types";
import { DomModel } from "./DomModel";
import { DomModelPrivate } from "./DomModelPrivate";

export class DomModelRegistry {
	static register<TData extends Record<string, any> = Record<string, any>>(
		instance: DomModel,
		_inputs: TData = {} as TData,
		_children: Array<DomChildType> = []
	) {
		const model = instance.constructor as DomModelClassType;
		this.registerModel(model);
		domModelMap.set(instance, new DomModelPrivate<TData>(model, instance, _inputs, _children));
	}
	static get(instance: DomModel) {
		return domModelStaticMap.get(instance.constructor as DomModelClassType);
	}
	static registerModel(model: DomModelClassType) {
		if (!domModelStaticMap.has(model)) {
			const dms = new DomModelRegistry(model);
			dms.init();
			domModelStaticMap.set(model, dms);
		}
	}
	static getRulesData(model: DomModelClassType) {
		let data = typeof model.rulesData === "function" ? model.rulesData(model) : model.rulesData;
		return { [model.tagName]: data };
	}

	static getRules(model: DomModelClassType, sheet?: CSSStyleSheet): DomRulesType {
		return DomCss.rules(this.getRulesData(model), sheet);
	}

	public tagName: string;
	public rules: DomRulesType;
	public cssVars: CssVarsType | undefined;
	constructor(private readonly model: DomModelClassType) {}
	init() {
		this.initTagName();
		this.initRules();
	}
	initTagName() {
		if (!this.model.tagName) {
			this.model.tagName = DomCore.objName2tagName(this.model.name).slice(1);
			if (this.model.tagName.lastIndexOf("-model") === this.model.tagName.length - 6) {
				this.model.tagName = this.model.tagName.slice(0, -6);
			}
		}
	}
	initRules() {
		if (!this.rules) {
			this.rules = DomModelRegistry.getRules(this.model, null);
			if (this.model.cssVars) {
				this.cssVars = DomCss.handleVars(this.model.tagName, this.model.cssVars, null);
			}
		}
	}
}

export const domModelStaticMap = new WeakMap<DomModelClassType, DomModelRegistry>();
export const domModelMap = new WeakMap<DomModel, DomModelPrivate>();
