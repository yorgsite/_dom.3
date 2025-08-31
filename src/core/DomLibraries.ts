import { _domType } from "../_dom";

export class DomLibraries {}

export class DomLibrary {
	constructor(_dom: _domType, config: DomLibraryInterface) {}
}

export interface DomLibraryInterface {}
// DomCore.html("img", {
// 						src: uri,
// 						onload: (evt: { target: HTMLImageElement }) => resolve(evt.target),
// 						onerror: (error: Error) => reject(error),
// 					});
