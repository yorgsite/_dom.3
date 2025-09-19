export interface DomSignalRegistredEffectInterface {
	callback: () => void;
	registries: Set<DomSignalRegistryInterface<any>>;
}
export interface DomSignalRegistryInterface<T> {
	effects: Set<DomSignalRegistredEffect>;
}
export interface DomSignalInterface<T, TR> {
	(): TR;
	set(v: T): void;
	registry: DomSignalRegistryInterface<T>;
}

const effectHandlers = new WeakMap<DomSignalEffectHandler, DomSignalRegistredEffect>();
class DomSignalEffectHandler {
	constructor(register: DomSignalRegistredEffect) {
		effectHandlers.set(this, register);
	}
	destroy() {
		const regEffect = effectHandlers.get(this);
		regEffect.alive = false;
		regEffect.registries.forEach(r => {
			r.effects.delete(regEffect);
		});
		regEffect.registries.clear();
	}
}
class DomSignalRegistredEffect {
	alive = true;
	registries = new Set<DomSignalRegistryInterface<any>>();
	constructor(public callback: () => void | Promise<void>) {}
}

class DomSignalOptions<T, TR> {
	equal!: (v1: T, v2: T) => boolean;
	transform!: (v: T) => TR;
	constructor(opt?: Partial<DomSignalOptions<T, TR>>) {
		this.equal = opt?.equal ?? ((v1, v2) => v1 === v2);
		this.transform = opt?.transform ?? (v => v as unknown as TR);
	}
}

class DomSignals {
	private currentEffects: DomSignalRegistredEffect[] = [];
	private pendingEffects: Set<DomSignalRegistredEffect> = new Set();
	private pendingEffectsId = 0;
	private callEffect(eff: DomSignalRegistredEffect) {
		this.pendingEffects.add(eff);
		if (!this.pendingEffectsId) {
			this.pendingEffectsId = requestAnimationFrame(() => {
				const stack = Array.from(this.pendingEffects.values());
				this.pendingEffects.clear();
				this.pendingEffectsId = 0;
				stack.filter(elt => elt.alive).forEach(elt => elt.callback());
			});
		}
	}
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
		const options = new DomSignalOptions(opt);
		let returnedValue = options.transform(value);
		const signal = (): TR => {
			if (this.currentEffects[0]) {
				registry.effects.add(this.currentEffects[0]);
				this.currentEffects[0].registries.add(registry);
			}
			return returnedValue;
		};
		signal.set = (v: T, forceChange: boolean = false) => {
			if (forceChange || !options.equal(v, value)) {
				value = v;
				returnedValue = options.transform(value);
				registry.effects.forEach(e => this.callEffect(e));
			}
		};

		const registry: DomSignalRegistryInterface<T> = { effects: new Set() };
		signal.registry = registry;

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
		this.currentEffects.unshift(regEffect);
		callback();
		this.currentEffects.shift();
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
	): (() => T) => {
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
