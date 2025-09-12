export interface DomSignalRegistryInterface<T> {
	effects: Set<() => void>;
	listeners: ((v: T) => void)[];
}
export interface DomSignalInterface<T> {
	(): T;
	set(v: T): void;
	listen: (callback: (v: T) => void) => void;
	registry: DomSignalRegistryInterface<T>;
}

class DomSignals {
	private static currentEffects: (() => void)[] = [];
	private static pendingEffects: Set<() => void> = new Set();
	private static pendingEffectsId = 0;
	private static callEffect(cb: () => void) {
		this.pendingEffects.add(cb);
		if (!this.pendingEffectsId) {
			this.pendingEffectsId = requestAnimationFrame(() => {
				const pe2 = Array.from(this.pendingEffects.values());
				this.pendingEffects.clear();
				this.pendingEffectsId = 0;
				pe2.forEach(element => {
					element();
				});
			});
		}
	}
	static signal = <T>(value?: T): DomSignalInterface<T> => {
		const signal = (): T => {
			if (this.currentEffects[0]) {
				registry.effects.add(this.currentEffects[0]);
			}
			return value;
		};
		signal.set = (v: T, forceChange: boolean = false) => {
			if (v !== value || forceChange) {
				value = v;
				registry.effects.forEach(e => this.callEffect(e));
				registry.listeners.forEach(cb => cb(v));
			}
		};
		signal.listen = (callback: (v: T) => void) => {
			registry.listeners.push(callback);
		};

		const registry: DomSignalRegistryInterface<T> = { effects: new Set(), listeners: [] };
		signal.registry = registry;

		return signal;
	};
	static effect = (callback: () => void, signals: DomSignalInterface<any>[] = []): void => {
		this.currentEffects.unshift(callback);
		signals.forEach(s => s.registry.effects.add(callback));
		callback();
		this.currentEffects.shift();
	};
	static computed = <T>(callback: () => T): DomSignalInterface<T> => {
		const signal = this.signal<T>();
		this.effect(() => {
			signal.set(callback());
		});
		return signal;
	};

	/**
	 * Decorator for class members using signals.
	 * The class must be decorated with .@signals.
	 * The member will behave as a classical member
	 * but will trigger effects from the same context when modified.
	 * @exemple
	 * ```typescript
	 * class MyClass{
	 *   \@MemberSignal//<-- member Decorator
	 *   signal:string;
	 *   constructor(){
	 *     effect(()=>console.log(this.signal));
	 *     setTimeout(()=>this.signal='value');
	 *   }
	 * }
	 * // Is equvalent to
	 * class MyClass{
	 *   signal=signal<string>();
	 *   constructor(){
	 *     effect(()=>console.log(this.signal()));
	 *     setTimeout(()=>this.signal.set('value'));
	 *   }
	 * }
	 * ```
	 * @param target
	 * @returns
	 */
	public static MemberSignal = <T>() => {
		const _this = this;

		return function (target: any, propertyKey: string) {
			const values = new WeakMap<any, DomSignalInterface<T>>();
			const getItem = function (scope: any) {
				if (!values.has(scope)) {
					values.set(scope, _this.signal());
				}
				return values.get(scope);
			};
			const getter = function () {
				return getItem(this)();
			};

			const setter = function (newVal: T) {
				getItem(this).set(newVal);
			};

			Object.defineProperty(target, propertyKey, {
				get: getter,
				set: setter,
				enumerable: true,
				configurable: true,
			});
		};
	};
}
export const MemberSignal = DomSignals.MemberSignal;
export const signal = DomSignals.signal;
export const effect = DomSignals.effect;
export const computed = DomSignals.computed;
