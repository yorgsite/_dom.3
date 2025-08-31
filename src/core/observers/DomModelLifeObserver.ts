import { DomModel } from "../model/DomModel";
import { DomLifeObserver } from "./DomLifeObserver";

export class DomModelLifeObserver {
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
