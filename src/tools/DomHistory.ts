export class DomHistoryEvent<T> {
	constructor(public readonly type: string, public readonly target: DomHistory<T>) {}
}
export class DomHistory<T> {
	private pile: T[] = [];
	index: number = 0;
	private listeners: Set<(evt: DomHistoryEvent<T>) => void> = new Set();
	constructor(private pileSize: number = 10) {}
	get current(): T | null {
		return this.pile[this.index] ?? null;
	}
	clear(newCurrent?: T | boolean) {
		let value: T | undefined;
		if (newCurrent === true && this.pile.length) {
			value = this.current;
		} else if (!["undefined", "boolean"].includes(typeof newCurrent)) {
			value = newCurrent as T;
		}
		this.pile = [];
		if (value !== undefined) {
			this.push(value);
		}
		this.listeners.forEach(l => l(new DomHistoryEvent<T>("clear", this)));
	}
	register(callback: (evt: DomHistoryEvent<T>) => void) {
		this.listeners.add(callback);
	}
	unregister(callback: (evt: DomHistoryEvent<T>) => void) {
		this.listeners.delete(callback);
	}
	canUndo() {
		return this.index > 0;
	}
	canRedo() {
		return this.index < this.pile.length - 1;
	}
	undo() {
		if (this.canUndo()) {
			this.index--;
			this.listeners.forEach(l => l(new DomHistoryEvent<T>("undo", this)));
		}
	}
	redo() {
		if (this.canRedo()) {
			this.index++;
			this.listeners.forEach(l => l(new DomHistoryEvent<T>("redo", this)));
		}
	}
	push(current: T) {
		if (this.index < this.pile.length - 1) {
			this.pile = this.pile.slice(0, this.index + 1);
		}
		this.pile.push(current);
		this.index = this.pile.length - 1;
		if (this.pile.length > this.pileSize) {
			this.pile.shift();
			this.index--;
		}
		this.listeners.forEach(l => l(new DomHistoryEvent<T>("push", this)));
	}
}
