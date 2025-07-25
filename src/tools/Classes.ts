export class Classes {
	static getPile(v: any) {
		let tmp = v.prototype ? v : v.constructor;
		const list = [tmp];
		for (let ch; (ch = tmp?.prototype?.__proto__?.constructor) && ch !== tmp; ) {
			list.push((tmp = ch));
		}
		return list;
	}
	static getNamePile(v: any): string[] {
		return this.getPile(v).map(v => v.name);
	}

	static inherit(constructor: any, parentConstructor: any): boolean {
		let tmp = constructor.prototype ? constructor : constructor.constructor;
		// console.log(' *> ',constructor,tmp);
		if (tmp === parentConstructor) return true;
		for (let ch; (ch = tmp?.prototype?.__proto__?.constructor) && ch !== tmp; ) {
			tmp = ch;
			if (tmp === parentConstructor) return true;
		}
		return false;
	}
}
