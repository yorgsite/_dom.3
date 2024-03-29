import { DomModel } from "../_dom";
import { RRecord } from "../core/types";

export class DomLang {
	private _map = new Map<string, RRecord<string>>();
	private _lang: string;
	private _registered: DomLangReg[] = [];
	private _buffer = new Map<string, string>();
	private _changeLang() {
		this._registered.forEach(r => r.changeLang());
	}
	get lang() {
		return this._lang;
	}
	set lang(v) {
		if (v !== this._lang && this._map.has(v)) {
			this._buffer = new Map();
			this._lang = v;
			this._changeLang();
		}
	}
	/**
	* Adds a dictionary
	* @param name 
	* @param data 
	*/
	add(name: string, data: RRecord<string>) {
		this._map.set(name, data);
		if (!this._lang) this.lang = name;
		else if (this.lang === name) this._changeLang();
	}
	/**
	 * loads a dictionary
	 * @param name 
	 * @param url 
	 * @returns 
	 */
	load(name: string, url: string): Promise<any> {
		return new Promise((res, rej) => {
			fetch(url).then(d => d.json()).then(json => {
				this.add(name, json);
				res(json);
			})
		});
	}
	getText(key: string, params?: { [k: string]: string | number }) {
		let tmp: any = '';
		if (this._buffer.has(key)) tmp = this._buffer.get(key);
		else if (this._map.has(this._lang)) {
			tmp = this._map.get(this._lang);
			key.split('.').some(k => {
				if (tmp.hasOwnProperty(k)) {
					tmp = tmp[k];
				} else {
					tmp = '';
					return true;
				}
			});
			this._buffer.set(key, tmp);
		} else {
			return '';
		}
		if (params) Object.entries(params)
			.forEach(([k, v]) => tmp = tmp.split('{{' + k + '}}').join(v));

		return tmp;
	}
	/**
	 * Gets model translator instance
	 * @param targetModel If given, assign translator for the target dom model. Translator is destroyed when the model is destroyed.
	 * @returns model translator instance
	 */
	register(targetModel?: any): DomLangRegIO {
		const dlr = new DomLangReg(this);
		this._registered.push(dlr);
		if (targetModel && targetModel.on) targetModel.on('destroy', () => dlr.destroy());
		return dlr.io;
	}
	destroy(reg: DomLangReg) {
		const id = this._registered.findIndex(v => v === reg);
		if (id > -1) {
			this._registered.splice(id, 1);
		}
	}
};

export class DomLangReg {
	io: DomLangRegIO = new DomLangRegIO(this);
	nodes: DomLangText[] = [];
	constructor(private _root: DomLang) { }
	changeLang() {
		this.nodes.forEach(n => n.change());
	}
	getText(key: string, params?: { [k: string]: string | number }) {
		return this._root.getText(key, params);
	}
	getLangText<T = any>(
		key: string,
		params: { [k: string]: string | number },
		changeCB: (v: string, data: any) => void,
		target: T
	): DomLangText<T> {
		const dlt = new DomLangText<T>(this, key, params, changeCB, target);
		this.nodes.push(dlt);
		return dlt;
	}
	getTextNode(
		key: string,
		params?: { [k: string]: string | number }
	): DomLangText<Text> {
		const textNode = document.createTextNode(this._root.getText(key, params));
		return this.getLangText<Text>(key, params || {}, (text, tgt) => tgt.nodeValue = text, textNode);
	}
	getTextLink<T = any>(
		key: string,
		params: { [k: string]: string | number },
		target: T, targetKey: string,
	): DomLangText<T> {
		return this.getLangText<T>(key, params || {}, (text, tgt) => tgt[targetKey] = text, target)
			.change();
	}
	getTextWatch(
		key: string,
		params: { [k: string]: string | number },
		callback: (newValue: string, oldValue: string) => void,
	): DomLangText<string> {
		const lt = this.getLangText<string>(key, params || {}, (text, tgt) => {
			if (text !== tgt) {
				let old = tgt;
				lt.target = text;
				callback(lt.target, old);
			}
		}, null).change();
		return lt;
	}

	destroyText(t: DomLangText) {
		const id = this.nodes.findIndex(v => v === t);
		if (id > -1) {
			this.nodes.splice(id, 1);
		}
	}
	destroy() {
		this._root.destroy(this);
	}
};

export class DomLangText<T = any>{
	private _rid = 0;
	constructor(
		private _reg: DomLangReg,
		public key: string,
		public params: { [k: string]: string | number },
		public changeCB: (v: string, data: any) => void,
		public target?: T
	) { }
	get text() {
		return this._reg.getText(this.key, this.params);
	}
	setKey(key: string) {
		this.key = key;
		this.change();
	}
	setParams(params: { [k: string]: string | number }) {
		this.params = params;
		this.change();
	}
	change() {
		if (!this._rid) {
			this._rid = requestAnimationFrame(() => {
				this._rid = 0;
				this.changeCB(this.text, this.target);
			});
		}
		return this;
	}
	destroy() {
		this._reg.destroyText(this);
	}
};


export class DomLangRegIO {
	constructor(private _reg: DomLangReg) { }
	getText(key: string, params?: { [k: string]: string | number }): string {
		return this._reg.getText(key, params);
	}
	getTextNode(
		key: string,
		params?: { [k: string]: string | number }
	): DomLangText<Text> {
		return this._reg.getTextNode(key, params);
	}
	getTextLink<T = any>(
		key: string,
		params: { [k: string]: string | number },
		target: T, targetKey: string,
	): DomLangText<T> {
		return this._reg.getTextLink<T>(key, params, target, targetKey);
	}
	getTextWatch(
		key: string,
		params: { [k: string]: string | number },
		callback: (newValue: string, oldValue: string) => void,
	): DomLangText<string> {
		return this._reg.getTextWatch(key, params, callback);
	}
	destroy() {
		this._reg.destroy();
	}
};