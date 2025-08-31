import { DomModel } from "./model/DomModel";
export declare class DomShadow {
    static models: Map<any, any>;
    constructor(scope: HTMLElement, model: DomModel);
    /**
    renders your model intanciable via html by using dom shadow
    * @parameter {string} tagName the model name.
    * @parameter {object} [argTypes] argument types by their name.
    */
    static modelShadow(model: DomModel): void;
}
