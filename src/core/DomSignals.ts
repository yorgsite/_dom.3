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
export class DomSignalContext {
	private currentEffect: () => void | null;
	private pendingEffects: Set<() => void> = new Set();
	private pendingEffectsId = 0;
	private callEffect(cb: () => void) {
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
	signal = <T>(value?: T): DomSignalInterface<T> => {
		const signal = (): T => {
			if (this.currentEffect) {
				registry.effects.add(this.currentEffect);
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
	effect = (callback: () => void, signals: DomSignalInterface<any>[] = []): void => {
		this.currentEffect = callback;
		signals.forEach(s => s.registry.effects.add(callback));
		callback();
		this.currentEffect = null;
	};
	computed = <T>(callback: () => T): DomSignalInterface<T> => {
		const signal = this.signal<T>();
		this.effect(() => {
			signal.set(callback());
		});
		return signal;
	};
}
// -------------

class DomSignals {
	public static contexts: DomSignalContext[] = [];
	public static annotatedProperties: WeakMap<any, string[]> = new WeakMap();

	public static getCurrentContext(): DomSignalContext {
		if (!this.contexts.length) {
			throw new Error(
				"\nNo signal current context found. Annotate your class with @signals or use a DomSignalContext instance."
			);
		}
		return this.contexts[0];
	}

	public static signal = <T>(value?: T): DomSignalInterface<T> =>
		this.getCurrentContext().signal<T>(value);

	public static effect = (callback: () => void, signals: DomSignalInterface<any>[] = []): void => {
		this.getCurrentContext().effect(callback, signals);
	};

	public static computed = <T>(callback: () => T): DomSignalInterface<T> => {
		return this.getCurrentContext().computed(callback);
	};

	/**
	 * Annotation for the class using signals
	 * @param target
	 * @returns
	 */
	public static signals = (target: any) => {
		const _this = this;
		const originalConstructor = target;
		// const propz = this.annotatedProperties.get(target) ?? [];
		// const builder = (scope: any, args: any[]) => {
		// 	// Handle members decorated with @MemberSignal()
		// 	propz.forEach(k => {
		// 		const privateField = `_signal_${k}`;
		// 		Object.defineProperty(scope, k, {
		// 			get: function () {
		// 				return this[privateField]();
		// 			},
		// 			set: function (newValue: string) {
		// 				this[privateField].set(newValue);
		// 			},
		// 			enumerable: true,
		// 			configurable: true,
		// 		});
		// 		Object.defineProperty(scope, privateField, {
		// 			value: _this.getCurrentContext().signal(),
		// 			writable: true,
		// 		});
		// 	});
		// 	target.apply(scope, args);
		// };

		// const CCC = eval(`class ${target.name}  {
		// 	constructor(...args) {
		// 		builder(this,args);
		// 	}
		// };${target.name}`);

		function construct(constructor: any, args: any[]) {
			_this.contexts.unshift(new DomSignalContext());
			const instance = new target(...args);
			_this.contexts.shift();
			return instance;
		}

		const f: any = function (...args: any[]) {
			return construct(originalConstructor, args);
		};

		f.prototype = originalConstructor.prototype;

		return f;
	};
	/**
	 * Annotation for class members using signals.
	 * The class must be decorated with @signals.
	 * The member will behave as a classical member
	 * but will trigger effects from the same context when modified.
	 * @param target
	 * @returns
	 */

	public static MemberSignal = <T>(ctx?: DomSignalContext) => {
		const _this = this;
		return function (target: any, propertyKey: string) {
			console.log("add member", propertyKey, target);
			if (!_this.annotatedProperties.has(target.constructor)) {
				_this.annotatedProperties.set(target.constructor, []);
			}
			_this.annotatedProperties.get(target.constructor).push(propertyKey);
		};
	};
	public static MemberSignal2 = <T>(ctx?: DomSignalContext) => {
		const _this = this;

		return function (target: any, propertyKey: string) {
			console.log("call MemberSignal2", target);
			const values = new WeakMap<any, DomSignalInterface<T>>();
			const getItem = function (scope: any) {
				if (!values.has(scope)) {
					values.set(scope, _this.getCurrentContext().signal());
				}
				return values.get(scope);
			};
			const getter = function () {
				return getItem(this)();
			};

			const setter = function (newVal: T) {
				console.log("Set newValue=", newVal);
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
export const signals = DomSignals.signals;
export const MemberSignal = DomSignals.MemberSignal;
export const MemberSignal2 = DomSignals.MemberSignal2;
export const signal = DomSignals.signal;
export const effect = DomSignals.effect;
export const computed = DomSignals.computed;
