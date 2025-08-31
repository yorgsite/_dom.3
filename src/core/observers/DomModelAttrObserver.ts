import { DomModel } from "../model/DomModel";
import { DomAttributesObserver } from "./DomAttributesObserver";

export class DomModelAttrObserver {
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
