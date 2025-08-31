// function enumerable(value: boolean) {
// 	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
// 		descriptor.enumerable = value;
// 	};
// }
// export function unoverridable(
// 	target: any,
// 	propertyKey: string,
// 	descriptor: PropertyDescriptor
// ): any {
// 	const originalMethod = descriptor.value;

// 	descriptor.value = function (...args: any[]) {
// 		if (this.constructor.prototype[propertyKey] !== target[propertyKey]) {
// 			throw new Error(
// 				`Method "${propertyKey}" cannot be overridden in class "${this.constructor.name}"`
// 			);
// 		}
// 		return originalMethod.apply(this, args);
// 	};

// 	return descriptor;
// }
