
export class ListenerEvent<TType extends string = string, TData extends any = any>{
	private _stopped: boolean = false;
	constructor(
		public type: TType,
		public data: TData,
		public target: any
	) { }
	get stopped() {
		return this._stopped;
	}
	stop() {
		this._stopped = true;
	}
}

export class ListenerCallback<TType extends string, TData>{
	constructor(
		public type: TType,
		public callback: (evt: ListenerEvent<TType, TData>) => any,
		public once: boolean
	) { }
}

/**
* 
*/
export class Listener<TType extends string = string, TData extends any = any>{
	private _callbacks: Map<string, ListenerCallback<TType, TData>[]> = new Map();
	constructor(private _target?: any) { }

	private _on(
		type: TType | TType[],
		callback: (evt: ListenerEvent<TType, TData>) => any,
		once: boolean = false,
		prepend: boolean = false,
		one: boolean = false
	) {
		if (type instanceof Array) type.map(t => this._on(t, callback, once, prepend));
		else if (one) {
			this._callbacks.set(type, [new ListenerCallback<TType, TData>(type, callback, once)]);
		} else {
			if (!this._callbacks.has(type)) this._callbacks.set(type, []);
			this._callbacks.get(type)[prepend ? 'unshift' : 'push'](new ListenerCallback<TType, TData>(type, callback, once));
		}
		return this;
	}
	has(type: TType) {
		return this._callbacks.has(type);
	}
	/**
	* 
	* @param type the event type
	* @param callback 
	* @param prepend 
	* @returns 
	*/
	on(type: TType | TType[], callback: (evt: ListenerEvent<TType, TData>) => any, prepend: boolean = false) {
		return this._on(type, callback, false, prepend);
	}
	once(type: TType | TType[], callback: (evt: ListenerEvent<TType, TData>) => any, prepend: boolean = false) {
		return this._on(type, callback, true, prepend);
	}
	off(type: TType | TType[], callback: (evt: ListenerEvent<TType, TData>) => any) {
		if (type instanceof Array) type.map(t => this.off(t, callback));
		else if (this._callbacks.has(type)) {
			const lst = this._callbacks.get(type);
			const id = lst.findIndex(l => l.callback === callback);
			if (id > -1) {
				lst.splice(id, 1);
				if (!lst.length) this._callbacks.delete(type);
			}
		}
		return this;
	}
	flush(type: TType, data: TData, target?: any) {
		const result: any[] = [];
		if (this._callbacks.has(type)) {
			const evt = new ListenerEvent<TType, TData>(type, data, target || this._target);
			const oldlist = this._callbacks.get(type);
			const nulist: ListenerCallback<TType, TData>[] = [];
			this._callbacks.set(type, nulist);
			for (let ci = 0; ci < oldlist.length; ci++) {
				result.push(oldlist[ci].callback(evt));
				if (!oldlist[ci].once) nulist.push(oldlist[ci]);
				if (evt.stopped) {
					nulist.push(...oldlist.slice(ci + 1));
					break;
				}
			}
		}
		return result;
	}
	clear(type?: TType | TType[]) {
		if (type instanceof Array) {
			type.map(t => this.clear(t));
		} else if (type) {
			if (this._callbacks.has(type)) {
				this._callbacks.delete(type);
			}
		} else {
			Array.from(this._callbacks.keys())
				.map(k => this._callbacks.delete(k));
		}
	}
}
