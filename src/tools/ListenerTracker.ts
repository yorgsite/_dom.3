export class ListenerTracker {
	private _listenersData: Map<
		string,
		{
			listener: (evt: Event) => void;
			options?: boolean | AddEventListenerOptions;
		}[]
	> = new Map();
	private _eventTarget: EventTarget = null;
	constructor(eventTarget?: EventTarget) {
		this.eventTarget = eventTarget || null;
	}

	private _removeListenerData(
		type: string,
		listener: (evt: Event) => void,
		options?: boolean | AddEventListenerOptions
	) {
		if (this._listenersData.has(type)) {
			const list = this._listenersData.get(type);
			const id = list.findIndex(
				v =>
					v.listener === listener &&
					(v.options === options ||
						(typeof v.options === "object" && typeof options === "object")) &&
					JSON.stringify(v.options) === JSON.stringify(options)
			);
			if (id > -1) {
				list.splice(id, 1);
				if (!list.length) {
					this._listenersData.delete(type);
				}
			}
		}
	}

	get eventTarget(): EventTarget | null {
		return this._eventTarget;
	}
	set eventTarget(newTarget: EventTarget | null) {
		if (newTarget !== this._eventTarget) {
			if (this._eventTarget) {
				this._eventTarget.addEventListener = EventTarget.prototype.addEventListener;
				this._eventTarget.removeEventListener = EventTarget.prototype.removeEventListener;
			}
			Array.from(this._listenersData.keys()).forEach(t =>
				this._listenersData.get(t).forEach(lst => {
					if (this._eventTarget)
						EventTarget.prototype.removeEventListener.apply(this._eventTarget, [
							t,
							lst.listener,
							lst.options,
						]);
					if (newTarget)
						EventTarget.prototype.addEventListener.apply(newTarget, [t, lst.listener, lst.options]);
				})
			);
			if (newTarget) {
				newTarget.addEventListener = this.addEventListener;
				newTarget.removeEventListener = this.removeEventListener;
			}
			this._eventTarget = newTarget;
		}
	}
	addEventListener = (
		type: string,
		listener: (evt: Event) => void,
		options?: boolean | AddEventListenerOptions
	) => {
		const cb =
			typeof options === "object" && options.once
				? (evt: Event) => {
						this._removeListenerData(type, cb, options);
						listener(evt);
				  }
				: listener;
		if (this._eventTarget) {
			EventTarget.prototype.addEventListener.apply(this._eventTarget, [type, cb, options]);
		}
		if (!this._listenersData.has(type)) {
			this._listenersData.set(type, []);
		}
		this._listenersData.get(type).push({ listener: cb, options });
	};
	removeEventListener = (
		type: string,
		listener: (evt: Event) => void,
		options?: boolean | EventListenerOptions
	) => {
		this._removeListenerData(type, listener, options);
		if (this._eventTarget) {
			EventTarget.prototype.removeEventListener.apply(this._eventTarget, [type, listener, options]);
		}
	};
	clearEventListeners(type: string) {
		if (!type) {
			Array.from(this._listenersData.keys()).forEach(t => this.clearEventListeners(t));
		} else if (this._listenersData.has(type)) {
			this._listenersData
				.get(type)
				.forEach(lst => this.removeEventListener(type, lst.listener, lst.options));
		}
	}
}
