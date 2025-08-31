import { DomCore } from "./DomCore";

export class LoadMediaProgress {
	constructor(
		public url: string,
		public loaded: number = 0,
		public total: number = 0,
		public percent: number = 0
	) {}
}

const closures: {
	scrollBarWidth: number;
} = {
	scrollBarWidth: -1,
};

// btoa(Array.from(new Uint8Array(arraybuffer)).map(b => String.fromCharCode(b)).join(''))
export class DomUtils {
	static loadMediaUri(
		url: string,
		onProgress: (p: LoadMediaProgress) => void = () => {}
	): Promise<string> {
		const progress = new LoadMediaProgress(url);
		return new Promise((resolve: (uri: string) => any, reject) => {
			var xmlHTTP = new XMLHttpRequest();
			xmlHTTP.open("GET", url, true);
			xmlHTTP.responseType = "arraybuffer";
			xmlHTTP.onload = function (e) {
				var blob = new Blob([this.response]);
				resolve(window.URL.createObjectURL(blob));
			};
			xmlHTTP.onprogress = function (e) {
				progress.loaded = e.loaded;
				progress.total = e.total;
				progress.percent = e.loaded / e.total;
				onProgress(progress);
			};
			xmlHTTP.onloadstart = function () {};
			xmlHTTP.onerror = function (err) {
				reject(err);
			};
			xmlHTTP.send();
		});
	}

	static loadImage(
		src: string,
		onProgress: (p: LoadMediaProgress) => void = () => {}
	): Promise<HTMLImageElement> {
		return new Promise((resolve: (gg: HTMLImageElement) => any, reject) => {
			this.loadMediaUri(src, onProgress)
				.then(uri => {
					DomCore.html("img", {
						src: uri,
						onload: (evt: { target: HTMLImageElement }) => resolve(evt.target),
						onerror: (error: Error) => reject(error),
					});
				})
				.catch(error => reject(error));
		});
	}

	static img2canvas(img: HTMLImageElement): HTMLCanvasElement {
		const canvas = DomCore.html("canvas", {
			width: img.width,
			height: img.height,
		}) as HTMLCanvasElement;
		canvas.getContext("2d")?.drawImage(img, 0, 0);
		return canvas;
	}

	static loadCanvas(src: string) {
		return new Promise((resolve: (gg: HTMLCanvasElement) => any, reject) => {
			DomUtils.loadImage(src)
				.then(img => resolve(DomUtils.img2canvas(img)))
				.catch(reject);
		});
	}

	static download(
		fileName: string,
		src: String | HTMLImageElement | File | Blob | { toDataURL: Function; [k: string]: any }
	) {
		let href = "";
		if (src instanceof HTMLImageElement) {
			if (src.complete) {
				href = DomUtils.img2canvas(src).toDataURL();
			} else {
				src.addEventListener("load", () => this.download(fileName, src));
				return;
			}
		} else if (typeof src !== "string" && "toDataURL" in src) {
			href = src.toDataURL();
		} else if (src instanceof File || src instanceof Blob) {
			href = URL.createObjectURL(src);
		} else if (typeof src === "string") {
			href = URL.createObjectURL(new Blob([src], { type: "text/plain" }));
		}
		if (href) {
			const dom = DomCore.html("a", {
				style: { display: "none" },
				href,
				download: fileName,
			});
			document.body.appendChild(dom);
			dom.click();
			document.body.removeChild(dom);
		}
	}

	static downloadFile(src: File) {
		DomUtils.download(src.name, src);
	}

	static getParentPile(
		dom: HTMLElement,
		condition: (dom: Element) => boolean | void,
		maxDeep: number = 10
	): HTMLElement[] | null {
		let errs = [];
		if (!(dom instanceof HTMLElement)) errs.push('arg[0] "dom" is not an HTMLElement.');
		if (typeof condition !== "function") errs.push('arg[1] "condition" is not a function.');
		if (typeof maxDeep !== "number" || maxDeep < 2)
			errs.push('arg[2] "maxDeep" is not a number with a value > 1 ."');
		if (errs.length) {
			console.error("----------_dom.getParentPile Error");
			console.log("arguments=", arguments);
			throw "\n_dom.getParentPile Error:\n" + errs.map(e => "	- " + e).join("\n");
		}
		const pile: HTMLElement[] = [];
		for (let i = 0; i < maxDeep && dom.parentNode; i++) {
			if (i > 0) {
				pile.unshift(dom);
				if (condition(dom)) return pile;
			}
			if (dom.parentNode instanceof HTMLElement) {
				dom = dom.parentNode;
			} else {
				break;
			}
		}
		return null;
	}
	static findParent(
		dom: HTMLElement,
		condition: (dom: Element) => boolean | void,
		maxDeep: number = 10
	): HTMLElement | null {
		const pile: HTMLElement[] = this.getParentPile(dom, condition, maxDeep);
		return (pile && pile[0]) || null;
	}

	static getAttributes(target: HTMLElement): Record<string, any> {
		const result: Record<string, any> = {};
		for (var i = 0, atts = target.attributes, n = atts.length; i < n; i++) {
			let name = atts[i].nodeName;
			let value: any = atts[i].nodeValue;

			if (["false", "off"].includes(value)) {
				value = false;
			} else if (["true", "on"].includes(value)) {
				value = true;
			} else {
				try {
					value = JSON.parse(value);
				} catch (e) {}
			}

			result[name] = value;
		}
		return result;
	}

	static getScrollBarWidth(force = false) {
		if (!force && closures.scrollBarWidth !== -1) return closures.scrollBarWidth;
		let el = document.createElement("div");
		el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
		document.body.appendChild(el);
		let width = el.offsetWidth - el.clientWidth;
		el.remove();
		document.documentElement.style.setProperty("--scrollbar-width", width + "px");
		return (closures.scrollBarWidth = width);
	}

	// static objName2tagName(objName){
	// 	return objName.split(/([A-Z])/).map((v,i)=>i%2?'-'+v.toLowerCase():v).join('');
	// }
	// static tagName2objName(tagName){
	// 	return tagName.split(/-([a-zA-Z])/).map((v,i)=>i%2?v.toUpperCase():v).join('');
	// }
	/*
		let values = args.slice(1)
		.map((a,si)=>{
			let attr,i=si+1;
			if(scope.hasAttribute(a)){
				attr=scope.getAttribute(a);
				if(typeof(argTypes[i])==='function'){
					attr=argTypes[i](attr);
				}else if(argTypes[i]==='boolean'){
					attr=['false','0','off'].includes(attr)?false:!!attr.length;
				}else if(argTypes[i]==='int'){
					attr=parseInt(attr);
				}else if(argTypes[i]==='number'){
					attr=parseFloat(attr);
				}else if(argTypes[i]==='function'){
					attr=new Function(''+attr).bind(scope);
				}else if(argTypes[i]!=='string'){
					try {attr=JSON.parse(attr);} catch (e) {}
				}

			}
			return attr;
		});

*/
}
