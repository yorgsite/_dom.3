import { DomCore } from "./DomCore";
import {
	CssVarsType,
	DomRulesDataType,
	DomRulesRulesResultType,
	DomRulesType,
	RRecord,
} from "./types";

export class DomCss {
	private static defaultCssRef = new Map<string, Map<string, string>>();
	private static flatSelectors = ["@font-face"];

	static get sheet(): CSSStyleSheet {
		if (document.styleSheets.length == 0) {
			document.documentElement.appendChild(document.createElement("style"));
		}
		return document.styleSheets[document.styleSheets.length - 1];
	}

	/**
	 * Get browser native element default css values.
	 * Called multiple times the method could be time consumming.
	 * The result will be computed only once for a given tagName until 'force' is set to true
	 * @param tagName tag name of the native element to test
	 * @param force force recomputation
	 * @returns the default css values.
	 */
	static defaultCss(tagName: string | HTMLElement, force: boolean = false): Map<string, string> {
		let tgt: HTMLElement, map: Map<string, any>;
		if (tagName instanceof HTMLElement) {
			tgt = tagName;
			tagName = tagName.tagName;
		}
		tagName = tagName.toLowerCase();

		if (force || tgt || !this.defaultCssRef.has(tagName)) {
			let dom,
				body = document.documentElement;
			try {
				dom = document.createElement(tagName);
				body.appendChild(dom);
				let cs: any = window.getComputedStyle(dom);
				map = new Map();
				Object.keys(cs)
					.map((id: string) => cs[id + ""])
					.filter(k => k.charAt(0) !== "-" && cs[k] !== "")
					.forEach(k => map.set(k, cs[k]));
				if (!tgt) this.defaultCssRef.set(tagName, map);
				body.removeChild(dom);
			} catch (e) {
				//in case of other catch
				if (dom && dom.parentNode) body.removeChild(dom);
				throw "\n_dom.properties Error:\n" + e;
			}
		} else {
			map = this.defaultCssRef.get(tagName);
		}
		return map;
	}

	/**
	 *
	 * @param data fonts urls or styleset by font-family
	 * @param sheet target stylesheet
	 * @returns
	 */
	static fonts(
		data: { [k: string]: { [k: string]: string } | string | string[] },
		sheet?: CSSStyleSheet
	): { [k: string]: CSSRule } {
		if (!(sheet instanceof CSSStyleSheet)) sheet = this.sheet;
		const rules: { [k: string]: CSSRule } = {};
		Object.keys(data).forEach(family => {
			const d =
				typeof data[family] === "string"
					? {
							src: "url('" + data[family] + "')",
					  }
					: data[family] instanceof Array
					? {
							src: (data[family] as string[]).map(src => "url('" + src + "')").join(","),
					  }
					: data[family];
			const str = Object.entries(d)
				.concat([["fontFamily", family]])
				.map(([k, v]) => k.replace(/([A-Z])/g, (a, b) => "-" + b.toLowerCase()) + ": " + v + ";")
				.join("");
			sheet.insertRule("@font-face{\n" + str + "\n}", sheet.cssRules.length);
			rules[family] = sheet.cssRules[sheet.cssRules.length - 1];
		});
		return rules;
	}

	/**
	 * Create a new js cssRule object;
	 * @param selector selector the new rule css query.
	 * @param data style data.
	 * @param sheet target stylesheet
	 * @param rootRules rules group object
	 * @param aliases rule aliases mapping
	 * @returns
	 */
	static rule(
		selector: string,
		data: DomRulesDataType,
		sheet?: CSSStyleSheet,
		rootRules?: Record<string, CSSStyleRule>,
		aliases?: Record<string, string | number>
	): CSSStyleRule {
		if (typeof selector !== "string" || !selector.length) {
			console.error("----------_dom.rule Error");
			console.log("selector=", selector);
			throw "\n_dom.rule Error:\nselector is not a valid css query.";
		}
		if (!(sheet instanceof CSSStyleSheet)) sheet = this.sheet;
		let rule: CSSRule;
		if (DomCss.flatSelectors.includes(selector)) {
			if (selector === "@font-face") {
				console.warn(
					"_dom.rule is depracated for the selector '@font-face' use _dom.fonts instead."
				);
			}
			const str = Object.keys(data)
				.map(k => k.replace(/([A-Z])/g, (a, b) => "-" + b.toLowerCase()) + ": " + data[k] + ";")
				.join("");
			sheet.insertRule(selector + "{\n" + str + "\n}", sheet.cssRules.length);
			rule = sheet.cssRules[sheet.cssRules.length - 1];
		} else {
			sheet.insertRule(selector + "{\n\n}", sheet.cssRules.length);
			rule = sheet.cssRules[sheet.cssRules.length - 1];
			if (data) {
				let iterRules = (dat: RRecord<string | number>, tgt: CSSRule) => {
					for (let name in dat) {
						if (typeof dat[name] === "object") {
							const r = rule as CSSGroupingRule | CSSKeyframesRule;
							if (r instanceof CSSKeyframesRule) {
								r.appendRule(name + "{\n\n}");
							} else {
								r.insertRule(name + "{\n\n}", r.cssRules.length);
							}
							iterRules(
								dat[name] as RRecord<string | number>,
								r.cssRules[(rule as CSSKeyframesRule).cssRules.length - 1]
							);
						} else {
							((tgt as CSSStyleRule).style as { [index: string]: any })[name] = dat[name];
						}
						if (rootRules && name in aliases) rootRules[aliases[name]] = rootRules[name];
					}
				};
				iterRules(data, rule);
			}
		}
		return rule as CSSStyleRule;
	}

	/**
	 * Create a collection of cssRule objects;
	 * @param data sass like structured object
	 * @param sheet target stylesheet
	 * @param uniquePrefix if set, will encapsulate datas with a unique className.
	 * an object {className:string,rules:object([ruleName]:CSSStyleRule} will be returned.
	 * @returns
	 */
	static rules(
		data: RRecord<string | number>,
		sheet?: CSSStyleSheet,
		uniquePrefix: string = ""
	): DomRulesType {
		let className = "";
		if (uniquePrefix) {
			className = uniquePrefix + "-" + DomCore.uid;
			data = { ["." + className]: data };
		}
		let rules: Record<string, CSSStyleRule> = {},
			rdata = this.getRulesData(data);
		if (!(sheet instanceof CSSStyleSheet)) sheet = this.sheet;

		for (let k in rdata.rules) {
			try {
				rules[k] = this.rule(
					k,
					rdata.rules[k] as DomRulesDataType,
					sheet,
					rules,
					rdata.alias as Record<string, string | number>
				);
			} catch (e) {
				console.warn('_dom.rules Warning:\nInsertion of rule "' + k + '" failed!\n\n' + e);
			}
			if (k in rdata.alias) rules[rdata.alias[k] as string] = rules[k];
		}
		return className ? { className, rules } : rules;
	}

	static rulesText(data: RRecord<string | number>) {
		// export type RulesData = {rules:RRecord<string|number>,alias:RRecord<string|number>};
		const rdata = this.getRulesData(data);
		let result = [];
		for (let k in rdata.rules) {
			const rr = [],
				dr = rdata.rules[k] as Record<string, string | number>;
			for (let r in dr) {
				rr.push("	" + DomCore.objName2tagName(r) + " : " + dr[r] + ";");
			}
			result.push([k + "{", ...rr, "}"].join("\n"));
		}
		return result;
	}

	/**
	 * Handle css variables
	 * @param root css root query
	 * @param cssVars default css vars values (not applied if allready exist)
	 * @param sheet target css styleSheet
	 * @returns a proxy for the css vars values
	 */
	static handleVars(
		root?: string,
		cssVars?: { [k: string]: string },
		sheet?: CSSStyleSheet
	): CssVarsType {
		if (!root) root = ":root";

		let rule = this.findRule(root, sheet);
		if (!rule) {
			const sheet = this.sheet;
			const ruleId = sheet.cssRules.length;
			sheet.insertRule(root + "{\n\n}", ruleId);
			rule = sheet.cssRules[sheet.cssRules.length - 1] as CSSStyleRule;
		}
		const proxy = new Proxy(
			{},
			{
				get: (tgt, prop: string) =>
					prop === "setVars"
						? (vars: { [k: string]: string }) =>
								Object.entries(vars).forEach(([k, v]) => (proxy[k] = v))
						: rule.style.getPropertyValue("--" + prop),
				set: (tgt, prop: string, val) => {
					rule.style.setProperty("--" + prop, val);
					return true;
				},
			}
		) as CssVarsType;

		if (cssVars) {
			Object.entries(cssVars).forEach(([k, v]) => {
				if (!proxy[k]) proxy[k] = v;
			});
		}

		return proxy;
	}

	/**
	 * Finds a css rule in any available stylesheet.
	 * The last rule found is returned for a same selector.
	 * @param selector the selector of the rule
	 * @param sheet search only in this styleSheet when provided
	 * @returns the css rule or null if not found.
	 */
	static findRule(selector: string, sheet?: CSSStyleSheet): CSSStyleRule | null {
		const rules = this.findRules(selector, sheet);
		return rules.length ? rules[rules.length - 1] : null;
	}

	/**
	 * Finds all css rules corresponding to the selector
	 * @param selector the selector of the rule.
	 * @param sheet search only in this styleSheet when provided
	 * @returns the list of rules found.
	 */
	static findRules(selector: string, sheet?: CSSStyleSheet): CSSStyleRule[] {
		return (sheet ? [sheet] : Array.from(document.styleSheets)).flatMap(sheet => {
			return Array.from(sheet.cssRules).filter(
				(rule: CSSStyleRule) => rule.selectorText === selector
			);
		}) as CSSStyleRule[];
	}

	/**
	 * Transforms sass like data to css like data.
	 * @param data sass like structured object
	 * @returns data with css rules and aliases.
	 */
	static getRulesData(data: RRecord<string | number>): DomRulesRulesResultType {
		let res: DomRulesRulesResultType = { rules: {}, alias: {} };
		const collect = function (
			dat: RRecord<string | number>,
			vars: Record<string, any>,
			pile: any[],
			qres?: DomRulesRulesResultType
		) {
			let obj: RRecord<string | number> = {},
				rname: string;
			if (pile.length) rname = pile.join("");
			for (let prop in dat) {
				let c = prop.charAt(0);
				if (c === "$") {
					// vars
					const propReg = prop.replace(/([$])/, "\\$1") + "(?![\\w-])";
					// prepare regexp replacement as var key
					vars[propReg] = dat[prop];
				} else if (DomCss.flatSelectors.includes(prop)) {
					res.rules[prop] = dat[prop];
				} else if (c === "@") {
					// media query,animation etc..
					let sres = { rules: {}, alias: {} };
					collect(dat[prop] as RRecord<string | number>, Object.assign({}, vars), [], sres);

					qres.rules[prop] = sres.rules;
				} else if (typeof dat[prop] === "object") {
					// sub queries
					const s =
						c === "&" ? prop.slice(1) : !pile.length || [">", ":"].includes(c) ? prop : " " + prop;
					s.split(",").forEach(name => {
						collect(
							dat[prop] as RRecord<string | number>,
							Object.assign({}, vars),
							pile.concat([name]),
							qres || res
						);
					});
				} else if (prop === "alias") {
					res.alias[rname] = dat[prop];
				} else {
					let tmp = dat[prop] + "";
					Object.keys(vars).forEach(k => {
						// tmp = tmp.indexOf(k) > -1 ? tmp.split(k).join(vars[k]) : tmp;
						tmp = tmp.replace(new RegExp(k), vars[k]);
					});
					obj[prop] = tmp;
				}
			}
			if (rname) {
				if (qres.rules[rname]) Object.assign(res.rules[rname], obj);
				else qres.rules[rname] = obj;
			} else if (Object.keys(obj).length) {
				Object.assign(res.rules, obj);
			}
		};
		collect(data, {}, [], res);

		return res;
	}

	static getValue(node: HTMLElement, name: string) {
		if (node.nodeType == 1) {
			name = DomCore.tagName2objName(name);
			return (
				(node.style as { [index: string]: any })[name] ||
				document.defaultView.getComputedStyle(node, "").getPropertyValue(name)
			);
		}
		return "";
	}

	static higherZindex(parent: HTMLElement = document.body) {
		let z = 0;
		for (let i = 0; i < parent.childNodes.length && z < Infinity; i++) {
			z = Math.max(z, parseInt(this.getValue(parent.childNodes[i] as HTMLElement, "z-index")) || 0);
		}
		return z;
	}
}
