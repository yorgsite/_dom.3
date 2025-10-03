// ------------ signal
export interface DomSignalInterface<T, TR> {
	(): TR;
	set(v: T): void;
}
export class DomSignalOptions<T, TR> {
	equal!: (v1: T, v2: T) => boolean;
	transform!: (v: T) => TR;
	constructor(opt?: Partial<DomSignalOptions<T, TR>>) {
		this.equal = opt?.equal ?? ((v1, v2) => v1 === v2);
		this.transform = opt?.transform ?? (v => v as unknown as TR);
	}
}
export class DomSignalRegistry<T, TR> {
	effects: Set<DomSignalRegistredEffect> = new Set();
	outValue: TR;
	constructor(
		private signals: DomSignals,
		private inValue: T,
		private options: DomSignalOptions<T, TR>
	) {
		this.outValue = options.transform(inValue);
	}

	get = (): TR => {
		const currentEffects = this.signals.currentEffects;
		if (currentEffects[0]) {
			this.effects.add(currentEffects[0]);
			currentEffects[0].registries.add(this);
		}
		return this.outValue;
	};
	set = (v: T, forceChange: boolean = false) => {
		if (forceChange || !this.options.equal(v, this.inValue)) {
			this.inValue = v;
			this.outValue = this.options.transform(this.inValue);
			this.effects.forEach(this.signals.callEffect);
		}
	};
}

// ------------ effect
const effectHandlers = new WeakMap<DomSignalEffectHandler, DomSignalRegistredEffect>();
class DomSignalRegistredEffect {
	alive = true;
	registries = new Set<DomSignalRegistry<any, any>>();
	constructor(public callback: () => void | Promise<void>) {}
	callEffect(currentEffects: DomSignalRegistredEffect[]) {
		this.unregister();
		currentEffects.unshift(this);
		this.callback();
		currentEffects.shift();
	}
	unregister() {
		this.registries.forEach(r => {
			r.effects.delete(this);
		});
		this.registries.clear();
	}
}
export class DomSignalEffectHandler {
	constructor(register: DomSignalRegistredEffect) {
		effectHandlers.set(this, register);
	}
	destroy() {
		const regEffect = effectHandlers.get(this);
		regEffect.alive = false;
		regEffect.unregister();
	}
}

// ------------ computed
export interface DomSignalComputedInterface<T> {
	(): T;
	destroy(): void;
}

// ------------ signals
class DomSignals {
	public currentEffects: DomSignalRegistredEffect[] = [];
	private pendingEffects: Set<DomSignalRegistredEffect> = new Set();
	private pendingEffectsId = 0;
	public readonly callEffect = (eff: DomSignalRegistredEffect) => {
		this.pendingEffects.add(eff);
		if (!this.pendingEffectsId) {
			this.pendingEffectsId = requestAnimationFrame(() => {
				const stack = Array.from(this.pendingEffects.values());
				this.pendingEffects.clear();
				this.pendingEffectsId = 0;
				stack.filter(elt => elt.alive).forEach(elt => elt.callEffect(this.currentEffects));
			});
		}
	};
	/**
	 * Creates a signal that will trigger effects when it changes.
	 * @param value initial value.
	 * @param opt signal options to test equality and transform result.
	 * @returns a signal with a 'set' method to change its value.
	 */
	public signal = <T, TR = T>(
		value?: T,
		opt?: Partial<DomSignalOptions<T, TR>>
	): DomSignalInterface<T, TR> => {
		const options = new DomSignalOptions<T, TR>(opt);
		const registry = new DomSignalRegistry<T, TR>(this, value, options);
		const signal = () => registry.get();
		signal.set = registry.set;
		return signal;
	};
	/**
	 * Effect reacting to signal handled in the callback when they changes.
	 * @param callback callback reacting to handled signals.
	 * @returns an effect handler with a destroy method to unregister the effect.
	 * Not necessary in most cases but useful if the effect is used in an element
	 * that could be destroyed while one of the handled signals would persist.
	 */
	public effect = (callback: () => void): DomSignalEffectHandler => {
		const regEffect = new DomSignalRegistredEffect(callback);
		regEffect.callEffect(this.currentEffects);
		return new DomSignalEffectHandler(regEffect);
	};
	/**
	 * Readonly signal witch value will change when a signal handled in the callback changes.
	 * @param callback callback reacting to handled signals.
	 * @returns a readonly signal with 'destroy' method to unregister the computed effect.
	 * Not necessary in most cases but useful if the effect is used in an element
	 * that could be destroyed while one of the handled signals would persist.
	 */
	public computed = <T>(
		callback: () => T | Promise<T>,
		opt?: Partial<DomSignalOptions<T, T>>
	): DomSignalComputedInterface<T> => {
		const signal = this.signal<T>(undefined, opt);
		const result = () => signal();
		result.destroy = this.effect(async () => {
			signal.set(await callback());
		}).destroy;
		return result;
	};

	/**
	 * Decorator for class members using signals.
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
	public MemberSignal = <T>() => {
		const _this = this;

		return function (target: any, propertyKey: string) {
			const values = new WeakMap<any, DomSignalInterface<T, T>>();
			const getItem = function (scope: any) {
				if (!values.has(scope)) {
					values.set(scope, _this.signal());
				}
				return values.get(scope);
			};

			Object.defineProperty(target, propertyKey, {
				get: function () {
					return getItem(this)();
				},
				set: function (newVal: T) {
					getItem(this).set(newVal);
				},
				enumerable: true,
				configurable: true,
			});
		};
	};
}

export const { MemberSignal, signal, effect, computed } = new DomSignals();
