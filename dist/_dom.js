var _dom;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 957:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomModule = void 0;
var _dom_1 = __webpack_require__(957);
var DomBaseModule_1 = __webpack_require__(903);
var DomCore_1 = __webpack_require__(573);
var DomCss_1 = __webpack_require__(971);
var DomUtils_1 = __webpack_require__(657);
var DomModel_1 = __webpack_require__(815);
var Cookie_1 = __webpack_require__(36);
__exportStar(__webpack_require__(573), exports);
__exportStar(__webpack_require__(971), exports);
__exportStar(__webpack_require__(125), exports);
__exportStar(__webpack_require__(657), exports);
__exportStar(__webpack_require__(815), exports);
__exportStar(__webpack_require__(689), exports);
__exportStar(__webpack_require__(194), exports);
__exportStar(__webpack_require__(879), exports);
__exportStar(__webpack_require__(784), exports);
__exportStar(__webpack_require__(138), exports);
__exportStar(__webpack_require__(920), exports);
__exportStar(__webpack_require__(449), exports);
__exportStar(__webpack_require__(499), exports);
__exportStar(__webpack_require__(222), exports);
__exportStar(__webpack_require__(834), exports);
__exportStar(__webpack_require__(483), exports);
var DomModule = /** @class */ (function (_super) {
    __extends(DomModule, _super);
    function DomModule() {
        return _super.call(this) || this;
    }
    Object.defineProperty(DomModule.prototype, "_dom", {
        get: function () {
            return _dom(this);
        },
        enumerable: false,
        configurable: true
    });
    return DomModule;
}(DomBaseModule_1.DomBaseModule));
exports.DomModule = DomModule;
var _dom = function (module) {
    /**
     * Create an HTMLElement
     * @param tagName tagName the element tagName, model name or model
     * @param params element attributes.
     * @param children element children. can contain strings and html elements.
     * @param namespace element namesapace if any.
     * @returns a new html element
     */
    var _dom = (function (tagName, params, children, namespace) {
        if (children === void 0) { children = []; }
        // console.log('_dom',arguments);
        return DomCore_1.DomCore.render(module, tagName, params, children, namespace);
    });
    Object.defineProperty(_dom, "uid", { get: function () { return DomCore_1.DomCore.uid; } });
    Object.defineProperty(_dom, "sheet", { get: function () { return DomCss_1.DomCss.sheet; } });
    Object.defineProperty(_dom, "module", { get: function () { return module; } });
    Object.defineProperty(_dom, "store", { get: function () { return module.store; } });
    Object.defineProperty(_dom, "cookie", { get: function () { return Cookie_1.Cookie; } });
    _dom.parseProps = function (target, data) {
        return DomCore_1.DomCore.parseProps(target, data);
    };
    _dom.import = function (__dom, isPrivate) {
        if (isPrivate === void 0) { isPrivate = false; }
        if (__dom instanceof Array) {
            __dom.map(function (d) { return _dom.import(d, isPrivate); });
        }
        else if (_dom_1.Classes.inherit(__dom, DomModel_1.DomModel)) {
            module.import(__dom, isPrivate);
        }
        else {
            module.import(__dom.module, isPrivate);
        }
    };
    /**
    * Add a custom element to this module.
    * NB: the **__dom** property will be added to the element, pointing to it's interface (model instance).
    * interface['dom'] : dom element;
    * interface[tagName] : element tagName;
    * @param tagName the custom element name. Should contain at least one "-" to avoid conflict with natives HTMLElements.
    * @param constructor receive the arguments of <b>_dom(tagName,params)</b>
    Must return an HTMLElement.
    <b>NB</b> : constructor Must be a function and <b>NOT a lambda expression</b> because it is scoped to its interface.
    * @param cssRules is or returns an object describing rules like _dom.rules,
    but the created collection will be instancied only once and shared among interfaces.
    Adds the 'rules' property to the interface.
    */
    _dom.model = function (tagName, modelConstructor, cssRules, isPrivate) {
        if (cssRules === void 0) { cssRules = undefined; }
        if (isPrivate === void 0) { isPrivate = false; }
        module.addModel(tagName, modelConstructor, cssRules, isPrivate);
    };
    /**
     *
     * @param element
     * @param data
     */
    _dom.attr = function (element, data) {
        DomCore_1.DomCore.parseProps(element, data);
    };
    /**
    *
    * @param data fonts urls or styleset by font-family
    ex :
    <code>
    _dom.fonts({
        'fontA': {
            src: "url('assets/fonts/fontA.ttf')",
            fontWeight: "100 400"
        },
        'fontB': [
            'assets/fonts/fontB.ttf',
            'assets/fonts/fontB.woff'
        ],
        'fontC': 'assets/fonts/fontC.ttf',
    })
    </code>
    * @param sheet target stylesheet
    * @returns
    */
    _dom.fonts = function (data, sheet) {
        return DomCss_1.DomCss.fonts(data, sheet);
    };
    /**
     * Create a new js cssRule object;
     * @param selector the new rule css query.
     * @param data style datas.
     * @param sheet target stylesheet
     * @returns
     */
    _dom.rule = function (selector, data, sheet) {
        return DomCss_1.DomCss.rule(selector, data, sheet);
    };
    /**
     * Create a collection of cssRule objects;
     * @param data sass like structured object
     * @param sheet target stylesheet
     * @param uniquePrefix if set, will encapsulate datas with a unique className.
     * an object {className:string,rules:object([ruleName]:CSSStyleRule} will be returned.
     * @returns
     */
    _dom.rules = function (data, sheet, uniquePrefix) {
        if (uniquePrefix === void 0) { uniquePrefix = ""; }
        return DomCss_1.DomCss.rules(data, sheet, uniquePrefix);
    };
    // --------- utils
    _dom.getAttributes = function (target) {
        return DomUtils_1.DomUtils.getAttributes(target);
    };
    _dom.loadMediaUri = function (src, onProgress) {
        if (onProgress === void 0) { onProgress = function () { }; }
        return DomUtils_1.DomUtils.loadMediaUri(src, onProgress);
    };
    _dom.loadImage = function (src, onProgress) {
        if (onProgress === void 0) { onProgress = function () { }; }
        return DomUtils_1.DomUtils.loadImage(src, onProgress);
    };
    _dom.img2canvas = function (img) {
        return DomUtils_1.DomUtils.img2canvas(img);
    };
    _dom.loadCanvas = function (src) {
        return DomUtils_1.DomUtils.loadCanvas(src);
    };
    _dom.getParentPile = function (dom, condition, maxDeep) {
        if (maxDeep === void 0) { maxDeep = 10; }
        return DomUtils_1.DomUtils.getParentPile(dom, condition, maxDeep);
    };
    _dom.findParent = function (dom, condition, maxDeep) {
        if (maxDeep === void 0) { maxDeep = 10; }
        return DomUtils_1.DomUtils.findParent(dom, condition, maxDeep);
    };
    _dom.download = function (fileName, src) {
        DomUtils_1.DomUtils.download(fileName, src);
    };
    _dom.downloadFile = function (src) {
        DomUtils_1.DomUtils.downloadFile(src);
    };
    _dom.higherZindex = function (parent) {
        if (parent === void 0) { parent = document.body; }
        return DomCss_1.DomCss.higherZindex(parent);
    };
    /**
     * Handle css variables
     * @param root css root query
     * @param cssVars default css vars values
     * @param sheet target css styleSheet
     * @returns a proxy for the css vars values
     */
    _dom.handleCssVars = function (root, cssVars, sheet) {
        return DomCss_1.DomCss.handleVars(root, cssVars, sheet);
    };
    return _dom;
};
exports["default"] = _dom;


/***/ }),

/***/ 903:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomBaseModule = void 0;
var DomCore_1 = __webpack_require__(573);
var DomStore_1 = __webpack_require__(499);
var DomModel_1 = __webpack_require__(815);
var DomModelRegistry_1 = __webpack_require__(468);
var DomModuleItem = /** @class */ (function () {
    function DomModuleItem(data, isPrivate) {
        if (isPrivate === void 0) { isPrivate = false; }
        this.data = data;
        this.isPrivate = isPrivate;
    }
    return DomModuleItem;
}());
var DomBaseModule = /** @class */ (function () {
    function DomBaseModule() {
        this.id = DomCore_1.DomCore.uid;
        this.models = new Map();
        // models:Map<string,DomModelClassType>=new Map();
        this._modules = [];
    }
    Object.defineProperty(DomBaseModule.prototype, "store", {
        get: function () {
            return this._store || (this._store = new DomStore_1.DomStore());
        },
        enumerable: false,
        configurable: true
    });
    DomBaseModule.prototype.import = function (module, isPrivate) {
        var _this = this;
        if (isPrivate === void 0) { isPrivate = false; }
        if (module instanceof Array) {
            module.map(function (m) { return _this.import(m, isPrivate); });
        }
        else if (DomModel_1.DomModel.isPrototypeOf(module)) {
            var m = module;
            DomModelRegistry_1.DomModelRegistry.registerModel(m);
            this.models.set(m.tagName, new DomModuleItem(m, isPrivate));
        }
        else if (!this._modules.find(function (m) { return m.data === module; })) {
            this._modules.push(new DomModuleItem(module, isPrivate));
        }
    };
    DomBaseModule.prototype.addModel = function (tagName, modelConstructor, cssRules, isPrivate) {
        if (modelConstructor === void 0) { modelConstructor = undefined; }
        if (cssRules === void 0) { cssRules = undefined; }
        if (isPrivate === void 0) { isPrivate = false; }
        var model;
        if (typeof tagName === "string") {
            var _Model_ = /** @class */ (function (_super) {
                __extends(_Model_, _super);
                function _Model_(params, children) {
                    if (children === void 0) { children = []; }
                    return _super.call(this, params, children) || this;
                }
                _Model_.prototype._domOnBuild = function (params, children) {
                    // console.log('+++++++ new ',this.tagName,params,children);
                    return modelConstructor.apply(this, [tagName, params, children]);
                };
                _Model_.tagName = tagName;
                _Model_.rulesData = cssRules || {};
                return _Model_;
            }(DomModel_1.DomModel));
            this.models.set(tagName, new DomModuleItem(_Model_, isPrivate));
        }
    };
    DomBaseModule.prototype.hasOwnModel = function (tagName, publicOnly) {
        if (publicOnly === void 0) { publicOnly = false; }
        return this.models.has(tagName) && (!publicOnly || !this.models.get(tagName).isPrivate);
    };
    DomBaseModule.prototype.hasModel = function (tagName, publicOnly) {
        if (publicOnly === void 0) { publicOnly = false; }
        return (this.hasOwnModel(tagName, publicOnly) ||
            !!this._modules.find(function (m) { return m.data.hasModel(tagName, true); }));
    };
    DomBaseModule.prototype.getModel = function (tagName, publicOnly) {
        if (publicOnly === void 0) { publicOnly = false; }
        if (this.hasOwnModel(tagName, publicOnly)) {
            return this.models.get(tagName).data;
        }
        else {
            for (var _i = 0, _a = this._modules; _i < _a.length; _i++) {
                var mod = _a[_i];
                if (!mod.isPrivate) {
                    var m = mod.data.getModel(tagName, true);
                    if (m)
                        return m;
                }
            }
        }
    };
    return DomBaseModule;
}());
exports.DomBaseModule = DomBaseModule;


/***/ }),

/***/ 573:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomCore = void 0;
var DomLibraries_1 = __webpack_require__(947);
// import { DomModel, DomModelInstance } from "./DomModel";
var DomModel_1 = __webpack_require__(815);
// type ValueOf<Obj> = Obj[keyof Obj];
// type OneOnly<Obj, Key extends keyof Obj> = { [key in Exclude<keyof Obj, Key>]: null } & Pick<Obj, Key>;
// type OneOfByKey<Obj> = { [key in keyof Obj]: OneOnly<Obj, key> };
// export type OneOf<Obj> = ValueOf<OneOfByKey<Obj>>;
var DomCore = /** @class */ (function () {
    function DomCore() {
    }
    Object.defineProperty(DomCore, "uid", {
        get: function () {
            var d = Date.now();
            if (d === this._uidDate) {
                this._uidCnt++;
            }
            else {
                this._uidCnt = 0;
                this._uidDate = d;
            }
            return this._uidDate.toString(36) + "-" + this._uidCnt;
        },
        enumerable: false,
        configurable: true
    });
    DomCore.html = function (tagName, params, children, namespace) {
        var element = namespace
            ? document.createElementNS(namespace, tagName)
            : document.createElement(tagName);
        if (params) {
            this.parseProps(element, params);
        }
        if (children) {
            element.append.apply(element, children.map(function (v) { return (v instanceof DomModel_1.DomModel ? v.dom : v); }));
        }
        return element;
    };
    DomCore.parseProps = function (target, data) {
        var _this = this;
        Object.entries(data).map(function (_a) {
            var key = _a[0], value = _a[1];
            if (typeof value === "object") {
                _this.parseProps(target[key], value);
            }
            else {
                target[key] = value;
            }
        });
    };
    DomCore.render = function (module, tagName, params, children, namespace) {
        if (children === void 0) { children = []; }
        // console.log('XXX Render '+tagName+' = ',module?.hasModel2(tagName+''),params,children);
        if (module === null || module === void 0 ? void 0 : module.hasModel(tagName + "")) {
            var m2 = module.getModel(tagName + "");
            var instance = new m2(params, children);
            //@ts-ignore assign private
            instance._module = module;
            return instance.dom;
        }
        // else if(tagName instanceof DomModel){}
        return DomCore.html(tagName + "", params, children, namespace);
    };
    DomCore.objName2tagName = function (tagName) {
        return tagName.replace(/([A-Z])/g, function (a, b) { return "-" + b.toLowerCase(); });
    };
    DomCore.tagName2objName = function (tagName) {
        return tagName.replace(/\-([a-z])/g, function (a, b) { return b.toUpperCase(); });
    };
    DomCore._uidDate = 0;
    DomCore._uidCnt = 0;
    DomCore.libraries = new DomLibraries_1.DomLibraries();
    return DomCore;
}());
exports.DomCore = DomCore;


/***/ }),

/***/ 971:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomCss = exports.CssVars = void 0;
var DomCore_1 = __webpack_require__(573);
var CssVars = /** @class */ (function () {
    function CssVars(root, camelised, sheet) {
        if (root === void 0) { root = ":root"; }
        if (camelised === void 0) { camelised = false; }
        var _this = this;
        this.root = root;
        this.camelised = camelised;
        this.keys = function () {
            var keys = [];
            for (var i = 0; i < _this.rule.style.length; i++) {
                keys.push(_this.rule.style.item(i));
            }
            keys = keys.filter(function (k) { return k.slice(0, 2) === "--"; }).map(function (k) { return k.slice(2); });
            return _this.camelised ? keys.map(function (k) { return _this.camelise(k); }) : keys;
        };
        this.entries = function () {
            return _this.keys().map(function (k) { return [k, _this.get(k)]; });
        };
        this.getVars = function () {
            return Object.fromEntries(_this.entries());
        };
        this.setVars = function (vars, keepDefault) {
            if (keepDefault === void 0) { keepDefault = false; }
            Object.entries(vars)
                .filter(function (_a) {
                var k = _a[0], v = _a[1];
                return !keepDefault || !_this.has(k);
            })
                .forEach(function (_a) {
                var k = _a[0], v = _a[1];
                return _this.set(k, v);
            });
        };
        var rule = DomCss.findRule(root, sheet);
        if (!rule) {
            var sheet_1 = DomCss.sheet;
            var ruleId = sheet_1.cssRules.length;
            sheet_1.insertRule(root + "{\n\n}", ruleId);
            rule = sheet_1.cssRules[sheet_1.cssRules.length - 1];
        }
        this.rule = rule;
    }
    Object.defineProperty(CssVars.prototype, "proxy", {
        get: function () {
            var _this = this;
            if (!this._proxy) {
                this._proxy = new Proxy({}, {
                    get: function (tgt, prop) {
                        switch (prop) {
                            case "getVars":
                                return _this.getVars;
                            case "setVars":
                                return _this.setVars;
                            default:
                                return _this.get(prop);
                        }
                    },
                    set: function (tgt, prop, val) {
                        _this.set(prop, val);
                        return true;
                    },
                });
            }
            return this._proxy;
        },
        enumerable: false,
        configurable: true
    });
    CssVars.prototype.uncamelise = function (key) {
        return key.replace(/[-]+([\w])/g, function (s) { return s.toUpperCase(); });
    };
    CssVars.prototype.camelise = function (key) {
        return key.replace(/[A-Z]/g, function (s) { return "-" + s.toLowerCase(); });
    };
    CssVars.prototype.has = function (key) {
        return !!this.get(key);
    };
    CssVars.prototype.get = function (key) {
        if (this.camelised)
            key = this.uncamelise(key);
        return this.rule.style.getPropertyValue("--" + key);
    };
    CssVars.prototype.set = function (key, value) {
        if (this.camelised)
            key = this.uncamelise(key);
        this.rule.style.setProperty("--" + key, value);
    };
    return CssVars;
}());
exports.CssVars = CssVars;
var DomCss = /** @class */ (function () {
    function DomCss() {
    }
    Object.defineProperty(DomCss, "sheet", {
        get: function () {
            if (document.styleSheets.length == 0) {
                document.documentElement.appendChild(document.createElement("style"));
            }
            return document.styleSheets[document.styleSheets.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get browser native element default css values.
     * Called multiple times the method could be time consumming.
     * The result will be computed only once for a given tagName until 'force' is set to true
     * @param tagName tag name of the native element to test
     * @param force force recomputation
     * @returns the default css values.
     */
    DomCss.defaultCss = function (tagName, force) {
        if (force === void 0) { force = false; }
        var tgt, map;
        if (tagName instanceof HTMLElement) {
            tgt = tagName;
            tagName = tagName.tagName;
        }
        tagName = tagName.toLowerCase();
        if (force || tgt || !this.defaultCssRef.has(tagName)) {
            var dom = void 0, body = document.documentElement;
            try {
                dom = document.createElement(tagName);
                body.appendChild(dom);
                var cs_1 = window.getComputedStyle(dom);
                map = new Map();
                Object.keys(cs_1)
                    .map(function (id) { return cs_1[id + ""]; })
                    .filter(function (k) { return k.charAt(0) !== "-" && cs_1[k] !== ""; })
                    .forEach(function (k) { return map.set(k, cs_1[k]); });
                if (!tgt)
                    this.defaultCssRef.set(tagName, map);
                body.removeChild(dom);
            }
            catch (e) {
                //in case of other catch
                if (dom && dom.parentNode)
                    body.removeChild(dom);
                throw "\n_dom.properties Error:\n" + e;
            }
        }
        else {
            map = this.defaultCssRef.get(tagName);
        }
        return map;
    };
    /**
     *
     * @param data fonts urls or styleset by font-family
     * @param sheet target stylesheet
     * @returns
     */
    DomCss.fonts = function (data, sheet) {
        if (!(sheet instanceof CSSStyleSheet))
            sheet = this.sheet;
        var rules = {};
        Object.keys(data).forEach(function (family) {
            var d = typeof data[family] === "string"
                ? {
                    src: "url('" + data[family] + "')",
                }
                : data[family] instanceof Array
                    ? {
                        src: data[family].map(function (src) { return "url('" + src + "')"; }).join(","),
                    }
                    : data[family];
            var str = Object.entries(d)
                .concat([["fontFamily", family]])
                .map(function (_a) {
                var k = _a[0], v = _a[1];
                return k.replace(/([A-Z])/g, function (a, b) { return "-" + b.toLowerCase(); }) + ": " + v + ";";
            })
                .join("");
            sheet.insertRule("@font-face{\n" + str + "\n}", sheet.cssRules.length);
            rules[family] = sheet.cssRules[sheet.cssRules.length - 1];
        });
        return rules;
    };
    /**
     * Create a new js cssRule object;
     * @param selector selector the new rule css query.
     * @param data style data.
     * @param sheet target stylesheet
     * @param rootRules rules group object
     * @param aliases rule aliases mapping
     * @returns
     */
    DomCss.rule = function (selector, data, sheet, rootRules, aliases) {
        if (typeof selector !== "string" || !selector.length) {
            console.error("----------_dom.rule Error");
            console.log("selector=", selector);
            throw "\n_dom.rule Error:\nselector is not a valid css query.";
        }
        if (!(sheet instanceof CSSStyleSheet))
            sheet = this.sheet;
        var rule;
        if (DomCss.flatSelectors.includes(selector)) {
            if (selector === "@font-face") {
                console.warn("_dom.rule is depracated for the selector '@font-face' use _dom.fonts instead.");
            }
            var str = Object.keys(data)
                .map(function (k) { return k.replace(/([A-Z])/g, function (a, b) { return "-" + b.toLowerCase(); }) + ": " + data[k] + ";"; })
                .join("");
            sheet.insertRule(selector + "{\n" + str + "\n}", sheet.cssRules.length);
            rule = sheet.cssRules[sheet.cssRules.length - 1];
        }
        else {
            sheet.insertRule(selector + "{\n\n}", sheet.cssRules.length);
            rule = sheet.cssRules[sheet.cssRules.length - 1];
            if (data) {
                var iterRules_1 = function (dat, tgt) {
                    for (var name_1 in dat) {
                        if (typeof dat[name_1] === "object") {
                            var r = rule;
                            if (r instanceof CSSKeyframesRule) {
                                r.appendRule(name_1 + "{\n\n}");
                            }
                            else {
                                r.insertRule(name_1 + "{\n\n}", r.cssRules.length);
                            }
                            iterRules_1(dat[name_1], r.cssRules[rule.cssRules.length - 1]);
                        }
                        else {
                            tgt.style[name_1] = dat[name_1];
                        }
                        if (rootRules && name_1 in aliases)
                            rootRules[aliases[name_1]] = rootRules[name_1];
                    }
                };
                iterRules_1(data, rule);
            }
        }
        return rule;
    };
    /**
     * Create a collection of cssRule objects;
     * @param data sass like structured object
     * @param sheet target stylesheet
     * @param uniquePrefix if set, will encapsulate datas with a unique className.
     * an object {className:string,rules:object([ruleName]:CSSStyleRule} will be returned.
     * @returns
     */
    DomCss.rules = function (data, sheet, uniquePrefix) {
        var _a;
        if (uniquePrefix === void 0) { uniquePrefix = ""; }
        var className = "";
        if (uniquePrefix) {
            className = uniquePrefix + "-" + DomCore_1.DomCore.uid;
            data = (_a = {}, _a["." + className] = data, _a);
        }
        var rules = {}, rdata = this.getRulesData(data);
        if (!(sheet instanceof CSSStyleSheet))
            sheet = this.sheet;
        for (var k in rdata.rules) {
            try {
                rules[k] = this.rule(k, rdata.rules[k], sheet, rules, rdata.alias);
            }
            catch (e) {
                console.warn('_dom.rules Warning:\nInsertion of rule "' + k + '" failed!\n\n' + e);
            }
            if (k in rdata.alias)
                rules[rdata.alias[k]] = rules[k];
        }
        return className ? { className: className, rules: rules } : rules;
    };
    DomCss.rulesText = function (data) {
        // export type RulesData = {rules:RRecord<string|number>,alias:RRecord<string|number>};
        var rdata = this.getRulesData(data);
        var result = [];
        for (var k in rdata.rules) {
            var rr = [], dr = rdata.rules[k];
            for (var r in dr) {
                rr.push("	" + DomCore_1.DomCore.objName2tagName(r) + " : " + dr[r] + ";");
            }
            result.push(__spreadArray(__spreadArray([k + "{"], rr, true), ["}"], false).join("\n"));
        }
        return result;
    };
    /**
     * Handle css variables
     * @param root css root query
     * @param cssVars default css vars values (not applied if allready exist)
     * @param sheet target css styleSheet
     * @returns a proxy for the css vars values
     */
    DomCss.handleVars = function (root, cssVars, sheet) {
        var cv = new CssVars(root, false, sheet);
        if (cssVars)
            cv.setVars(cssVars, true);
        return cv.proxy;
        // if (!root) root = ":root";
        // let rule = this.findRule(root, sheet);
        // if (!rule) {
        // 	const sheet = this.sheet;
        // 	const ruleId = sheet.cssRules.length;
        // 	sheet.insertRule(root + "{\n\n}", ruleId);
        // 	rule = sheet.cssRules[sheet.cssRules.length - 1] as CSSStyleRule;
        // }
        // const proxy = new Proxy(
        // 	{},
        // 	{
        // 		get: (tgt, prop: string) =>
        // 			prop === "setVars"
        // 				? (vars: { [k: string]: string }) =>
        // 						Object.entries(vars).forEach(([k, v]) => (proxy[k] = v))
        // 				: rule.style.getPropertyValue("--" + prop),
        // 		set: (tgt, prop: string, val) => {
        // 			rule.style.setProperty("--" + prop, val);
        // 			return true;
        // 		},
        // 	}
        // ) as CssVarsType;
        // if (cssVars) {
        // 	Object.entries(cssVars).forEach(([k, v]) => {
        // 		if (!proxy[k]) proxy[k] = v;
        // 	});
        // }
        // return proxy;
    };
    /**
     * Finds a css rule in any available stylesheet.
     * The last rule found is returned for a same selector.
     * @param selector the selector of the rule
     * @param sheet search only in this styleSheet when provided
     * @returns the css rule or null if not found.
     */
    DomCss.findRule = function (selector, sheet) {
        var rules = this.findRules(selector, sheet);
        return rules.length ? rules[rules.length - 1] : null;
    };
    /**
     * Finds all css rules corresponding to the selector
     * @param selector the selector of the rule.
     * @param sheet search only in this styleSheet when provided
     * @returns the list of rules found.
     */
    DomCss.findRules = function (selector, sheet) {
        return (sheet ? [sheet] : Array.from(document.styleSheets)).flatMap(function (sheet) {
            return Array.from(sheet.cssRules).filter(function (rule) { return rule.selectorText === selector; });
        });
    };
    /**
     * Transforms sass like data to css like data.
     * @param data sass like structured object
     * @returns data with css rules and aliases.
     */
    DomCss.getRulesData = function (data) {
        var res = { rules: {}, alias: {} };
        var collect = function (dat, vars, pile, qres) {
            var obj = {}, rname;
            if (pile.length)
                rname = pile.join("");
            var _loop_1 = function (prop) {
                var c = prop.charAt(0);
                if (c === "$") {
                    // vars
                    var propReg = prop.replace(/([$])/, "\\$1") + "(?![\\w-])";
                    // prepare regexp replacement as var key
                    vars[propReg] = dat[prop];
                }
                else if (DomCss.flatSelectors.includes(prop)) {
                    res.rules[prop] = dat[prop];
                }
                else if (c === "@") {
                    // media query,animation etc..
                    var sres = { rules: {}, alias: {} };
                    collect(dat[prop], Object.assign({}, vars), [], sres);
                    qres.rules[prop] = sres.rules;
                }
                else if (typeof dat[prop] === "object") {
                    // sub queries
                    var s = c === "&" ? prop.slice(1) : !pile.length || [">", ":"].includes(c) ? prop : " " + prop;
                    s.split(",").forEach(function (name) {
                        collect(dat[prop], Object.assign({}, vars), pile.concat([name]), qres || res);
                    });
                }
                else if (prop === "alias") {
                    res.alias[rname] = dat[prop];
                }
                else {
                    var tmp_1 = dat[prop] + "";
                    Object.keys(vars).forEach(function (k) {
                        // tmp = tmp.indexOf(k) > -1 ? tmp.split(k).join(vars[k]) : tmp;
                        tmp_1 = tmp_1.replace(new RegExp(k), vars[k]);
                    });
                    obj[prop] = tmp_1;
                }
            };
            for (var prop in dat) {
                _loop_1(prop);
            }
            if (rname) {
                if (qres.rules[rname])
                    Object.assign(res.rules[rname], obj);
                else
                    qres.rules[rname] = obj;
            }
            else if (Object.keys(obj).length) {
                Object.assign(res.rules, obj);
            }
        };
        collect(data, {}, [], res);
        return res;
    };
    DomCss.getValue = function (node, name) {
        if (node.nodeType == 1) {
            name = DomCore_1.DomCore.tagName2objName(name);
            return (node.style[name] ||
                document.defaultView.getComputedStyle(node, "").getPropertyValue(name));
        }
        return "";
    };
    DomCss.higherZindex = function (parent) {
        if (parent === void 0) { parent = document.body; }
        var z = 0;
        for (var i = 0; i < parent.childNodes.length && z < Infinity; i++) {
            z = Math.max(z, parseInt(this.getValue(parent.childNodes[i], "z-index")) || 0);
        }
        return z;
    };
    DomCss.defaultCssRef = new Map();
    DomCss.flatSelectors = ["@font-face"];
    return DomCss;
}());
exports.DomCss = DomCss;


/***/ }),

/***/ 947:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomLibrary = exports.DomLibraries = void 0;
var DomLibraries = /** @class */ (function () {
    function DomLibraries() {
    }
    return DomLibraries;
}());
exports.DomLibraries = DomLibraries;
var DomLibrary = /** @class */ (function () {
    function DomLibrary(_dom, config) {
    }
    return DomLibrary;
}());
exports.DomLibrary = DomLibrary;
// DomCore.html("img", {
// 						src: uri,
// 						onload: (evt: { target: HTMLImageElement }) => resolve(evt.target),
// 						onerror: (error: Error) => reject(error),
// 					});


/***/ }),

/***/ 125:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.computed = exports.effect = exports.signal = exports.MemberSignal = void 0;
var DomSignals = /** @class */ (function () {
    function DomSignals() {
    }
    DomSignals.callEffect = function (cb) {
        var _this_1 = this;
        this.pendingEffects.add(cb);
        if (!this.pendingEffectsId) {
            this.pendingEffectsId = requestAnimationFrame(function () {
                var pe2 = Array.from(_this_1.pendingEffects.values());
                _this_1.pendingEffects.clear();
                _this_1.pendingEffectsId = 0;
                pe2.forEach(function (element) {
                    element();
                });
            });
        }
    };
    var _a;
    _a = DomSignals;
    DomSignals.currentEffects = [];
    DomSignals.pendingEffects = new Set();
    DomSignals.pendingEffectsId = 0;
    DomSignals.signal = function (value) {
        var signal = function () {
            if (_a.currentEffects[0]) {
                registry.effects.add(_a.currentEffects[0]);
            }
            return value;
        };
        signal.set = function (v, forceChange) {
            if (forceChange === void 0) { forceChange = false; }
            if (v !== value || forceChange) {
                value = v;
                registry.effects.forEach(function (e) { return _a.callEffect(e); });
                registry.listeners.forEach(function (cb) { return cb(v); });
            }
        };
        signal.listen = function (callback) {
            registry.listeners.push(callback);
        };
        var registry = { effects: new Set(), listeners: [] };
        signal.registry = registry;
        return signal;
    };
    DomSignals.effect = function (callback, signals) {
        if (signals === void 0) { signals = []; }
        _a.currentEffects.unshift(callback);
        signals.forEach(function (s) { return s.registry.effects.add(callback); });
        callback();
        _a.currentEffects.shift();
    };
    DomSignals.computed = function (callback) {
        var signal = _a.signal();
        _a.effect(function () {
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
    DomSignals.MemberSignal = function () {
        var _this = _a;
        return function (target, propertyKey) {
            var values = new WeakMap();
            var getItem = function (scope) {
                if (!values.has(scope)) {
                    values.set(scope, _this.signal());
                }
                return values.get(scope);
            };
            var getter = function () {
                return getItem(this)();
            };
            var setter = function (newVal) {
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
    return DomSignals;
}());
exports.MemberSignal = DomSignals.MemberSignal;
exports.signal = DomSignals.signal;
exports.effect = DomSignals.effect;
exports.computed = DomSignals.computed;


/***/ }),

/***/ 657:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomUtils = exports.LoadMediaProgress = void 0;
var DomCore_1 = __webpack_require__(573);
var LoadMediaProgress = /** @class */ (function () {
    function LoadMediaProgress(url, loaded, total, percent) {
        if (loaded === void 0) { loaded = 0; }
        if (total === void 0) { total = 0; }
        if (percent === void 0) { percent = 0; }
        this.url = url;
        this.loaded = loaded;
        this.total = total;
        this.percent = percent;
    }
    return LoadMediaProgress;
}());
exports.LoadMediaProgress = LoadMediaProgress;
var closures = {
    scrollBarWidth: -1,
};
// btoa(Array.from(new Uint8Array(arraybuffer)).map(b => String.fromCharCode(b)).join(''))
var DomUtils = /** @class */ (function () {
    function DomUtils() {
    }
    DomUtils.loadMediaUri = function (url, onProgress) {
        if (onProgress === void 0) { onProgress = function () { }; }
        var progress = new LoadMediaProgress(url);
        return new Promise(function (resolve, reject) {
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
            xmlHTTP.onloadstart = function () { };
            xmlHTTP.onerror = function (err) {
                reject(err);
            };
            xmlHTTP.send();
        });
    };
    DomUtils.loadImage = function (src, onProgress) {
        var _this = this;
        if (onProgress === void 0) { onProgress = function () { }; }
        return new Promise(function (resolve, reject) {
            _this.loadMediaUri(src, onProgress)
                .then(function (uri) {
                DomCore_1.DomCore.html("img", {
                    src: uri,
                    onload: function (evt) { return resolve(evt.target); },
                    onerror: function (error) { return reject(error); },
                });
            })
                .catch(function (error) { return reject(error); });
        });
    };
    DomUtils.img2canvas = function (img) {
        var _a;
        var canvas = DomCore_1.DomCore.html("canvas", {
            width: img.width,
            height: img.height,
        });
        (_a = canvas.getContext("2d")) === null || _a === void 0 ? void 0 : _a.drawImage(img, 0, 0);
        return canvas;
    };
    DomUtils.loadCanvas = function (src) {
        return new Promise(function (resolve, reject) {
            DomUtils.loadImage(src)
                .then(function (img) { return resolve(DomUtils.img2canvas(img)); })
                .catch(reject);
        });
    };
    DomUtils.download = function (fileName, src) {
        var _this = this;
        var href = "";
        if (src instanceof HTMLImageElement) {
            if (src.complete) {
                href = DomUtils.img2canvas(src).toDataURL();
            }
            else {
                src.addEventListener("load", function () { return _this.download(fileName, src); });
                return;
            }
        }
        else if (typeof src !== "string" && "toDataURL" in src) {
            href = src.toDataURL();
        }
        else if (src instanceof File || src instanceof Blob) {
            href = URL.createObjectURL(src);
        }
        else if (typeof src === "string") {
            href = URL.createObjectURL(new Blob([src], { type: "text/plain" }));
        }
        if (href) {
            var dom = DomCore_1.DomCore.html("a", {
                style: { display: "none" },
                href: href,
                download: fileName,
            });
            document.body.appendChild(dom);
            dom.click();
            document.body.removeChild(dom);
        }
    };
    DomUtils.downloadFile = function (src) {
        DomUtils.download(src.name, src);
    };
    DomUtils.getParentPile = function (dom, condition, maxDeep) {
        if (maxDeep === void 0) { maxDeep = 10; }
        var errs = [];
        if (!(dom instanceof HTMLElement))
            errs.push('arg[0] "dom" is not an HTMLElement.');
        if (typeof condition !== "function")
            errs.push('arg[1] "condition" is not a function.');
        if (typeof maxDeep !== "number" || maxDeep < 2)
            errs.push('arg[2] "maxDeep" is not a number with a value > 1 ."');
        if (errs.length) {
            console.error("----------_dom.getParentPile Error");
            console.log("arguments=", arguments);
            throw "\n_dom.getParentPile Error:\n" + errs.map(function (e) { return "	- " + e; }).join("\n");
        }
        var pile = [];
        for (var i = 0; i < maxDeep && dom.parentNode; i++) {
            if (i > 0) {
                pile.unshift(dom);
                if (condition(dom))
                    return pile;
            }
            if (dom.parentNode instanceof HTMLElement) {
                dom = dom.parentNode;
            }
            else {
                break;
            }
        }
        return null;
    };
    DomUtils.findParent = function (dom, condition, maxDeep) {
        if (maxDeep === void 0) { maxDeep = 10; }
        var pile = this.getParentPile(dom, condition, maxDeep);
        return (pile && pile[0]) || null;
    };
    DomUtils.getAttributes = function (target) {
        var result = {};
        for (var i = 0, atts = target.attributes, n = atts.length; i < n; i++) {
            var name_1 = atts[i].nodeName;
            var value = atts[i].nodeValue;
            if (["false", "off"].includes(value)) {
                value = false;
            }
            else if (["true", "on"].includes(value)) {
                value = true;
            }
            else {
                try {
                    value = JSON.parse(value);
                }
                catch (e) { }
            }
            result[name_1] = value;
        }
        return result;
    };
    DomUtils.getScrollBarWidth = function (force) {
        if (force === void 0) { force = false; }
        if (!force && closures.scrollBarWidth !== -1)
            return closures.scrollBarWidth;
        var el = document.createElement("div");
        el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
        document.body.appendChild(el);
        var width = el.offsetWidth - el.clientWidth;
        el.remove();
        document.documentElement.style.setProperty("--scrollbar-width", width + "px");
        return (closures.scrollBarWidth = width);
    };
    return DomUtils;
}());
exports.DomUtils = DomUtils;


/***/ }),

/***/ 815:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomModel = void 0;
// import { DomModelContructorType, DomModule, Listener, ListenerEvent } from "..";
var Listener_1 = __webpack_require__(834);
var DomModelRegistry_1 = __webpack_require__(468);
var DomModel = /** @class */ (function () {
    // -----------------
    function DomModel(inputs, children) {
        if (inputs === void 0) { inputs = {}; }
        if (children === void 0) { children = []; }
        DomModelRegistry_1.DomModelRegistry.register(this, inputs, children);
    }
    Object.defineProperty(DomModel.prototype, "dom", {
        // -----------------
        get: function () {
            return DomModelRegistry_1.domModelMap.get(this).dom;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomModel.prototype, "tagName", {
        get: function () {
            return this.constructor.tagName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomModel.prototype, "rules", {
        get: function () {
            return DomModelRegistry_1.domModelMap.get(this).rules;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomModel.prototype, "cssVars", {
        get: function () {
            return DomModelRegistry_1.domModelMap.get(this).cssVars;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomModel.prototype, "shadowRules", {
        get: function () {
            return DomModelRegistry_1.domModelMap.get(this).shadowRules;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomModel.prototype, "inputs", {
        get: function () {
            return DomModelRegistry_1.domModelMap.get(this).inputs;
        },
        enumerable: false,
        configurable: true
    });
    DomModel.prototype.clone = function () {
        return DomModelRegistry_1.domModelMap.get(this).clone();
    };
    DomModel.prototype.connect = function () {
        DomModelRegistry_1.domModelMap.get(this).connect();
    };
    DomModel.prototype.disconnect = function () {
        DomModelRegistry_1.domModelMap.get(this).disconnect();
    };
    DomModel.prototype.setInput = function (name, value) {
        DomModelRegistry_1.domModelMap.get(this).setInput(name, value);
    };
    DomModel.prototype.onInput = function (name, callback) {
        var priv = DomModelRegistry_1.domModelMap.get(this);
        if (!priv.inputListener) {
            priv.inputListener = new Listener_1.Listener();
            this._domOn("attributechange", function (evt) {
                priv.inputListener.flush(name, evt.data);
            });
        }
        priv.inputListener.on(name, callback);
    };
    DomModel.prototype._domOn = function (type, callback) {
        var priv = DomModelRegistry_1.domModelMap.get(this);
        if (["ready", "destroy"].includes(type)) {
            priv.requireLifeObserver = true;
        }
        else if ((type = "attributechange")) {
            priv.onAttributeChange();
        }
        priv.domCycleListener.on(type, callback);
    };
    DomModel.prototype._domOnceBuilt = function (callback) {
        if (this.dom) {
            callback();
        }
        else {
            DomModelRegistry_1.domModelMap.get(this).domCycleListener.once("afterinit", callback);
        }
    };
    // ----------------- Overrides --*
    DomModel.prototype._domOnInit = function (params, children) {
        if (children === void 0) { children = []; }
    };
    DomModel.prototype._domOnAfterInit = function (params, children) {
        if (children === void 0) { children = []; }
    };
    DomModel.prototype._domOnAttributeChange = function (name, value, oldValue) { };
    DomModel.prototype._domOnReady = function () { };
    DomModel.prototype._domOnDestroy = function () { };
    DomModel.prototype._domOnBuild = function (params, children) {
        if (children === void 0) { children = []; }
        return undefined;
    };
    DomModel.shadowRules = false;
    DomModel.rulesData = {};
    return DomModel;
}());
exports.DomModel = DomModel;


/***/ }),

/***/ 340:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomModelPrivate = void 0;
// import { DomModelContructorType, DomModule, Listener, ListenerEvent } from "..";
var Listener_1 = __webpack_require__(834);
var DomCore_1 = __webpack_require__(573);
var DomCss_1 = __webpack_require__(971);
var DomModelAttrObserver_1 = __webpack_require__(892);
var DomModelLifeObserver_1 = __webpack_require__(429);
var DomModel_1 = __webpack_require__(815);
var DomModelRegistry_1 = __webpack_require__(468);
var DomModelPrivate = /** @class */ (function () {
    function DomModelPrivate(model, instance, _inputs, children) {
        if (_inputs === void 0) { _inputs = {}; }
        if (children === void 0) { children = []; }
        this.model = model;
        this._inputs = _inputs;
        this.children = children;
        this.domCycleListener = new Listener_1.Listener();
        this.requireLifeObserver = false;
        this.modelLifeObserver = null;
        this.modelAttrObserver = null;
        // @ts-ignore WeakRef unidentified by typescript
        this.instanceRef = new WeakRef(instance);
    }
    DomModelPrivate.prototype.initDom = function () {
        return __awaiter(this, void 0, void 0, function () {
            var afterProm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._dom = document.createElement(this.model.tagName);
                        return [4 /*yield*/, this.initDomElement()];
                    case 1:
                        _a.sent();
                        if (this.model.shadowRules) {
                            this.initDomShadowRules();
                        }
                        this.domCycleListener.flush("build", this);
                        afterProm = this.instance._domOnAfterInit(this._inputs, this.children);
                        if (!(afterProm instanceof Promise)) return [3 /*break*/, 3];
                        return [4 /*yield*/, afterProm];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.domCycleListener.flush("afterinit", this);
                        this.initDomTriggers();
                        return [2 /*return*/];
                }
            });
        });
    };
    DomModelPrivate.prototype.initDomElement = function () {
        return __awaiter(this, void 0, void 0, function () {
            var initProm, domProm, dom, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        initProm = this.instance._domOnInit(this._inputs, this.children);
                        if (!(initProm instanceof Promise)) return [3 /*break*/, 2];
                        return [4 /*yield*/, initProm];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        this.domCycleListener.flush("init", this);
                        if (this.model.className) {
                            this._dom.className = this.model.className;
                        }
                        domProm = this.instance._domOnBuild(this._inputs, this.children);
                        if (!(domProm instanceof Promise)) return [3 /*break*/, 4];
                        return [4 /*yield*/, domProm];
                    case 3:
                        _a = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = domProm;
                        _c.label = 5;
                    case 5:
                        dom = _a;
                        if (!(dom instanceof Array))
                            dom = [dom];
                        if (!dom.every(function (d) { return d instanceof HTMLElement || d instanceof DomModel_1.DomModel || typeof d === "string"; })) {
                            throw [
                                "",
                                "_dom model " + this.model.name + " Error :",
                                " - method _domOnBuild must return an HTMLElement or a non empty list of string | HTMLElement | DomModel.",
                            ].join("\n");
                        }
                        (_b = this._dom).append.apply(_b, dom.map(function (d) { return (d instanceof DomModel_1.DomModel ? d.dom : d); }));
                        return [2 /*return*/];
                }
            });
        });
    };
    DomModelPrivate.prototype.initDomShadowRules = function () {
        var _this = this;
        var rattr = "_dom_" + Math.random().toString(36).slice(2);
        this._dom.setAttribute(rattr, "");
        var rdata = DomModelRegistry_1.DomModelRegistry.getRulesData(this.model);
        for (var k in rdata) {
            rdata[k + "[" + rattr + "]"] = rdata[k];
            delete rdata[k];
        }
        var style = DomCore_1.DomCore.html("style", { type: "text/css" });
        this._dom.appendChild(style);
        setTimeout(function () {
            _this._rules = DomCss_1.DomCss.rules(rdata, style.sheet);
            if (_this.model.cssVars) {
                _this._cssVars = DomCss_1.DomCss.handleVars(_this.model.tagName + "[" + rattr + "]", _this.model.cssVars, style.sheet);
            }
        }, 1);
    };
    DomModelPrivate.prototype.initDomTriggers = function () {
        var _this = this;
        if (this.requireLifeObserver)
            this.initLifeObserver();
        if (this.overrided("_domOnReady")) {
            this.instance._domOn("ready", function (evt) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.instance._domOnReady()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        if (this.overrided("_domOnDestroy")) {
            this.instance._domOn("destroy", function (evt) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.instance._domOnDestroy()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        if (this.overrided("_domOnAttributeChange")) {
            this.instance._domOn("attributechange", function (evt) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.instance._domOnAttributeChange(evt.data.name, evt.data.value, evt.data.oldValue)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        if (this._inputs && this.inputListener) {
            for (var k in this._inputs) {
                this.inputListener.flush(k, { name: k, value: this._inputs[k], oldValue: undefined });
            }
        }
    };
    DomModelPrivate.prototype.overrided = function (methodName) {
        return this.instance[methodName] !== DomModel_1.DomModel.prototype[methodName];
    };
    DomModelPrivate.prototype.initLifeObserver = function () {
        var _this = this;
        if (!this.modelLifeObserver) {
            this.modelLifeObserver = new DomModelLifeObserver_1.DomModelLifeObserver(this.instance);
            this.modelLifeObserver.onReady(function () {
                _this.domCycleListener.flush("ready", _this);
            });
            this.modelLifeObserver.onDestroy(function () {
                _this.domCycleListener.flush("destroy", _this);
            });
        }
    };
    Object.defineProperty(DomModelPrivate.prototype, "instance", {
        // ------------------
        get: function () {
            return this.instanceRef.deref();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomModelPrivate.prototype, "dom", {
        get: function () {
            if (!this._dom) {
                this.initDom();
            }
            return this._dom;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomModelPrivate.prototype, "rules", {
        get: function () {
            return this.shadowRules ? this._rules : DomModelRegistry_1.domModelStaticMap.get(this.model).rules;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomModelPrivate.prototype, "cssVars", {
        get: function () {
            return this.shadowRules ? this._cssVars : DomModelRegistry_1.domModelStaticMap.get(this.model).cssVars;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomModelPrivate.prototype, "shadowRules", {
        get: function () {
            return this.model.shadowRules;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomModelPrivate.prototype, "inputs", {
        get: function () {
            var _this = this;
            if (!this._inputProxy) {
                this._inputProxy = new Proxy({}, {
                    get: function (tgt, prop) { return _this._inputs[prop]; },
                    set: function (tgt, prop, value) {
                        _this.setInput(prop, value);
                        return true;
                    },
                });
            }
            return this._inputProxy;
        },
        enumerable: false,
        configurable: true
    });
    // ------------------
    DomModelPrivate.prototype.clone = function () {
        return new this.model(this._inputs, this.children);
    };
    DomModelPrivate.prototype.connect = function () {
        this.modelLifeObserver.connect();
    };
    DomModelPrivate.prototype.disconnect = function () {
        if (this.modelLifeObserver) {
            this.modelLifeObserver.disconnect();
        }
    };
    DomModelPrivate.prototype.setInput = function (name, value) {
        if (typeof this._inputs === "object") {
            var oldValue = this._inputs[name];
            this._inputs[name] = value;
            if (this.inputListener) {
                this.inputListener.flush(name, { name: name, value: value, oldValue: oldValue });
            }
        }
    };
    DomModelPrivate.prototype.onAttributeChange = function () {
        var _this = this;
        if (!this.modelAttrObserver) {
            this.modelAttrObserver = new DomModelAttrObserver_1.DomModelAttrObserver(this.instance);
            this.modelAttrObserver.onChange(function (name, value, oldValue) {
                _this.domCycleListener.flush("attributechange", { name: name, value: value, oldValue: oldValue });
            });
        }
    };
    return DomModelPrivate;
}());
exports.DomModelPrivate = DomModelPrivate;


/***/ }),

/***/ 468:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.domModelMap = exports.domModelStaticMap = exports.DomModelRegistry = void 0;
var DomCore_1 = __webpack_require__(573);
var DomCss_1 = __webpack_require__(971);
var DomModelPrivate_1 = __webpack_require__(340);
var DomModelRegistry = /** @class */ (function () {
    function DomModelRegistry(model) {
        this.model = model;
    }
    DomModelRegistry.register = function (instance, _inputs, _children) {
        if (_inputs === void 0) { _inputs = {}; }
        if (_children === void 0) { _children = []; }
        var model = instance.constructor;
        this.registerModel(model);
        exports.domModelMap.set(instance, new DomModelPrivate_1.DomModelPrivate(model, instance, _inputs, _children));
    };
    DomModelRegistry.get = function (instance) {
        return exports.domModelStaticMap.get(instance.constructor);
    };
    DomModelRegistry.registerModel = function (model) {
        if (!exports.domModelStaticMap.has(model)) {
            var dms = new DomModelRegistry(model);
            dms.init();
            exports.domModelStaticMap.set(model, dms);
        }
    };
    DomModelRegistry.getRulesData = function (model) {
        var _a;
        var data = typeof model.rulesData === "function" ? model.rulesData(model) : model.rulesData;
        return _a = {}, _a[model.tagName] = data, _a;
    };
    DomModelRegistry.getRules = function (model, sheet) {
        return DomCss_1.DomCss.rules(this.getRulesData(model), sheet);
    };
    DomModelRegistry.prototype.init = function () {
        this.initTagName();
        this.initRules();
    };
    DomModelRegistry.prototype.initTagName = function () {
        if (!this.model.tagName) {
            this.model.tagName = DomCore_1.DomCore.objName2tagName(this.model.name).slice(1);
            if (this.model.tagName.lastIndexOf("-model") === this.model.tagName.length - 6) {
                this.model.tagName = this.model.tagName.slice(0, -6);
            }
        }
    };
    DomModelRegistry.prototype.initRules = function () {
        if (!this.rules) {
            this.rules = DomModelRegistry.getRules(this.model, null);
            if (this.model.cssVars) {
                this.cssVars = DomCss_1.DomCss.handleVars(this.model.tagName, this.model.cssVars, null);
            }
        }
    };
    return DomModelRegistry;
}());
exports.DomModelRegistry = DomModelRegistry;
exports.domModelStaticMap = new WeakMap();
exports.domModelMap = new WeakMap();


/***/ }),

/***/ 689:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomAttributesObserver = void 0;
var DomAttributesObserver = /** @class */ (function () {
    function DomAttributesObserver(target) {
        var _this = this;
        this.target = target;
        this._attrBuffer = new Map();
        this._onchange = function () { };
        this._mutationCallback = function (mutationList) {
            for (var _i = 0, mutationList_1 = mutationList; _i < mutationList_1.length; _i++) {
                var mutation = mutationList_1[_i];
                if (mutation.type === "attributes") {
                    var name_1 = mutation.attributeName;
                    var oldValue = _this._attrBuffer.get(name_1);
                    var value = mutation.target.getAttribute(name_1);
                    _this._attrBuffer.set(name_1, value);
                    // console.log(' -changed '+name,' from ',oldValue,' to ',value);
                    _this._onchange(name_1, value, oldValue);
                }
            }
        };
        this._observer = new MutationObserver(this._mutationCallback);
        this.connect();
    }
    DomAttributesObserver.prototype.connect = function () {
        this.disconnect();
        this._observer.observe(this.target, { attributes: true });
    };
    DomAttributesObserver.prototype.disconnect = function () {
        this._observer.disconnect();
    };
    DomAttributesObserver.prototype.onChange = function (callback) {
        this._onchange = callback;
    };
    return DomAttributesObserver;
}());
exports.DomAttributesObserver = DomAttributesObserver;


/***/ }),

/***/ 194:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomLifeObserver = void 0;
var DomLifeObserver = /** @class */ (function () {
    function DomLifeObserver(target) {
        var _this = this;
        this.target = target;
        this._ondestroy = function () { };
        this._onready = function () { };
        this._ready = false;
        this._intree = false;
        this._mutationCallback = function (mutationList) {
            // console.log('MCB');
            for (var _i = 0, mutationList_1 = mutationList; _i < mutationList_1.length; _i++) {
                var mutation = mutationList_1[_i];
                if (mutation.type === "childList") {
                    var nl = _this._intree ? mutation.removedNodes : mutation.addedNodes;
                    if (nl.length) {
                        var rnl = Array.from(nl);
                        if (rnl.includes(_this.target) || rnl.some(function (parent) { return parent.contains(_this.target); })) {
                            if (!_this._intree) {
                                _this._intree = true;
                            }
                            else {
                                _this._intree = false;
                            }
                            if (_this._intree !== _this._ready) {
                                if (!_this._ready) {
                                    _this._ready = true;
                                    _this._onready();
                                }
                                else {
                                    requestAnimationFrame(function () {
                                        if (!_this._intree) {
                                            _this.disconnect();
                                        }
                                    });
                                }
                            }
                        }
                    }
                    // break;
                }
            }
        };
        this._observer = new MutationObserver(this._mutationCallback);
        this.connect();
    }
    Object.defineProperty(DomLifeObserver.prototype, "ready", {
        get: function () {
            return this._ready;
        },
        enumerable: false,
        configurable: true
    });
    DomLifeObserver.prototype.connect = function () {
        this.disconnect();
        // if(document.documentElement.contains(this.target)){
        // 	this._intree=this._ready=true;
        // 	requestAnimationFrame(()=>{
        // 		if(document.documentElement.contains(this.target)){
        // 			this._onready();
        // 		}
        // 	});
        // }
        // console.log('observe');
        this._observer.observe(document.documentElement, { childList: true, subtree: true });
    };
    DomLifeObserver.prototype.disconnect = function () {
        if (!this._intree && this._ready) {
            this._ready = false;
            this._ondestroy();
        }
        this._observer.disconnect();
    };
    DomLifeObserver.prototype.onReady = function (callback) {
        this._onready = callback;
    };
    DomLifeObserver.prototype.onDestroy = function (callback) {
        this._ondestroy = callback;
    };
    return DomLifeObserver;
}());
exports.DomLifeObserver = DomLifeObserver;


/***/ }),

/***/ 892:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomModelAttrObserver = void 0;
var DomAttributesObserver_1 = __webpack_require__(689);
var DomModelAttrObserver = /** @class */ (function () {
    function DomModelAttrObserver(modelInstance) {
        this.modelInstance = modelInstance;
        this._attrObserver = null;
    }
    DomModelAttrObserver.prototype.onChange = function (callback) {
        var _this = this;
        var _init = function () {
            _this._attrObserver = _this._attrObserver || new DomAttributesObserver_1.DomAttributesObserver(_this.modelInstance.dom);
            _this._attrObserver.onChange(callback);
        };
        if (this.modelInstance.dom) {
            _init();
        }
        else
            requestAnimationFrame(_init);
    };
    return DomModelAttrObserver;
}());
exports.DomModelAttrObserver = DomModelAttrObserver;


/***/ }),

/***/ 429:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomModelLifeObserver = void 0;
var DomLifeObserver_1 = __webpack_require__(194);
var DomModelLifeObserver = /** @class */ (function () {
    function DomModelLifeObserver(modelInstance) {
        this.modelInstance = modelInstance;
        this._regz = {
            ready: false,
            destroy: false,
        };
    }
    DomModelLifeObserver.prototype.connect = function () {
        this._life.connect();
    };
    DomModelLifeObserver.prototype.disconnect = function () {
        this._life.disconnect();
    };
    DomModelLifeObserver.prototype.onReady = function (callback) {
        var _this = this;
        if (this._regz.destroy) {
            throw [
                "",
                "_dom.model " + this.modelInstance.tagName + " build Error:",
                " - onReady must be called before onDestroy.",
            ].join("\n");
        }
        this._regz.ready = true;
        var _init = function () {
            _this._life = _this._life || new DomLifeObserver_1.DomLifeObserver(_this.modelInstance.dom);
            _this._life.onReady(callback);
        };
        if (this.modelInstance.dom) {
            _init();
        }
        else
            requestAnimationFrame(_init);
    };
    DomModelLifeObserver.prototype.onDestroy = function (callback, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 1; }
        this._regz.destroy = true;
        var _init = function () {
            _this._life = _this._life || new DomLifeObserver_1.DomLifeObserver(_this.modelInstance.dom);
            _this._life.onDestroy(callback);
        };
        if (this.modelInstance.dom) {
            _init();
        }
        else
            requestAnimationFrame(_init);
    };
    return DomModelLifeObserver;
}());
exports.DomModelLifeObserver = DomModelLifeObserver;


/***/ }),

/***/ 879:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 156:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/** VIZ */
var _dom_1 = __webpack_require__(957);
__exportStar(__webpack_require__(957), exports);
var _dom = new _dom_1.DomModule()._dom;
exports["default"] = _dom;


/***/ }),

/***/ 784:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Classes = void 0;
var Classes = /** @class */ (function () {
    function Classes() {
    }
    Classes.getPile = function (v) {
        var _a, _b;
        var tmp = v.prototype ? v : v.constructor;
        var list = [tmp];
        for (var ch = void 0; (ch = (_b = (_a = tmp === null || tmp === void 0 ? void 0 : tmp.prototype) === null || _a === void 0 ? void 0 : _a.__proto__) === null || _b === void 0 ? void 0 : _b.constructor) && ch !== tmp;) {
            list.push((tmp = ch));
        }
        return list;
    };
    Classes.getNamePile = function (v) {
        return this.getPile(v).map(function (v) { return v.name; });
    };
    Classes.inherit = function (constructor, parentConstructor) {
        var _a, _b;
        var tmp = constructor.prototype ? constructor : constructor.constructor;
        // console.log(' *> ',constructor,tmp);
        if (tmp === parentConstructor)
            return true;
        for (var ch = void 0; (ch = (_b = (_a = tmp === null || tmp === void 0 ? void 0 : tmp.prototype) === null || _a === void 0 ? void 0 : _a.__proto__) === null || _b === void 0 ? void 0 : _b.constructor) && ch !== tmp;) {
            tmp = ch;
            if (tmp === parentConstructor)
                return true;
        }
        return false;
    };
    return Classes;
}());
exports.Classes = Classes;


/***/ }),

/***/ 36:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Cookie = void 0;
var Cookie = /** @class */ (function () {
    function Cookie() {
    }
    /**
    *
    * @param name
    * @returns
    */
    Cookie.get = function (name) {
        return (document.cookie.match(RegExp('(?:^|;\\s*)' + encodeURI(name) + '=([^;]*)')) || [, null])[1];
    };
    /**
    *
    * @param name
    * @returns
    */
    Cookie.has = function (name) {
        return this.get(name) !== null;
    };
    /**
    *
    * @param name
    * @param path
    */
    Cookie.delete = function (name, path) {
        if (path === void 0) { path = '/'; }
        document.cookie = encodeURI(name) + '=;Path=' + path + ';Domain=' + location.hostname + ';expires=Thu, 01 Jan 1970;';
    };
    /**
    *
    * @param name
    * @param value
    * @param options
    */
    Cookie.set = function (name, value, options) {
        var date = new Date();
        var opt = options || {};
        var params = [];
        params.push(encodeURI(name) + '=' + value + ';');
        if (!opt.session) {
            var expires = opt.expires || (new Date(Date.now() + (((opt.expireDays || 0) * 86400000) || ((opt.expireHours || 0) * 3600000) || ((opt.expireMinutes || 0) * 60000) || 86400000))).toUTCString();
            // -new Date().getTimezoneOffset()*60000
            params.push('expires=' + expires + ';');
        }
        params.push('Path=' + (opt.path || '/') + ';');
        if (opt.domain) {
            params.push('Domain=' + opt.domain + ';');
        }
        if (opt.secure && location.protocol === 'https') {
            params.push('secure');
        }
        //console.log(params.join(''));		
        document.cookie = params.join('');
    };
    /**
    *
    * @returns
    */
    Cookie.getAll = function () {
        var data = {};
        document.cookie.split(';').map(function (v) { return v.trim(); }).filter(function (v) { return v; }).forEach(function (v) {
            var id = v.indexOf('=');
            data[decodeURI(v.slice(0, id).trim())] = v.slice(id + 1);
        });
        return data;
    };
    return Cookie;
}());
exports.Cookie = Cookie;
;


/***/ }),

/***/ 138:
/***/ (function(__unused_webpack_module, exports) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataList = exports.DataListLink = void 0;
var DataListLink = /** @class */ (function () {
    // private _children:HTMLElement[]=[];
    function DataListLink(_datalist, _container, _renderer) {
        this._datalist = _datalist;
        this._container = _container;
        this._renderer = _renderer;
        this._rid = 0;
        this._data = [];
        this.dumb = false;
        this._changed();
    }
    DataListLink.prototype._changed = function () {
        var _this = this;
        if (!this._rid) {
            this._rid = requestAnimationFrame(function () {
                _this._rid = 0;
                _this.refresh();
            });
        }
    };
    DataListLink.prototype.refresh = function () {
        var _this = this;
        if (!this._datalist || !this._container)
            return;
        var _old = this._data;
        var _new = this._datalist.data;
        if (this.dumb) {
            this._container.innerHTML = '';
            _new.map(function (ch, ni) { return _this._container.appendChild(_this._renderer(ch, ni, _new)); });
        }
        else {
            var oldMap_1 = new Map();
            var ovMap_1 = new Map();
            _old.map(function (v, i) { return oldMap_1.set(i, v); });
            var nid = _new.map(function (v) {
                if (ovMap_1.has(v))
                    return -1;
                var id = _old.findIndex(function (vv) { return vv === v; });
                if (id > -1) {
                    oldMap_1.delete(id);
                    ovMap_1.set(v, true);
                }
                return id;
            });
            var children = nid.map(function (id, ni) { return id > -1 ? _this._container.childNodes[id] : _this._renderer(_new[ni], ni, _new); });
            Array.from(oldMap_1.keys())
                .map(function (id) { return _this._container.childNodes[id]; })
                .map(function (cn) { return _this._container.removeChild(cn); });
            children.map(function (c) { return _this._container.appendChild(c); });
        }
        this._data = _new;
    };
    Object.defineProperty(DataListLink.prototype, "list", {
        get: function () {
            return this._datalist;
        },
        set: function (v) {
            if (v !== this._datalist) {
                if (this._datalist) {
                    this._datalist.detach(this);
                }
                this._datalist = v;
                this._datalist.attach(this);
                this._changed();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataListLink.prototype, "container", {
        get: function () {
            return this._container;
        },
        set: function (c) {
            var _this = this;
            if (this._container !== c) {
                if (this._container && c) {
                    Array.from(this._container.childNodes)
                        .map(function (cn) { return c.appendChild(cn); });
                    this._container = c;
                }
                else if (this._container) {
                    Array.from(this._container.childNodes)
                        .map(function (cn) { return _this._container.removeChild(cn); });
                }
                else if (c) {
                    this._data.map(function (d, i) { return c.appendChild(_this._renderer(d, i, _this._data)); });
                }
                this._container = c;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataListLink.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        set: function (r) {
            var _this = this;
            if (this._renderer !== r) {
                Array.from(this._container.childNodes)
                    .map(function (cn) { return _this._container.removeChild(cn); });
                this._data.map(function (d, i) { return _this._container.appendChild(_this._renderer(d, i, _this._data)); });
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataListLink.prototype, "data", {
        get: function () {
            return this._datalist.data;
        },
        set: function (d) {
            this._datalist.data = d;
        },
        enumerable: false,
        configurable: true
    });
    return DataListLink;
}());
exports.DataListLink = DataListLink;
var DataList = /** @class */ (function () {
    function DataList(_data) {
        if (_data === void 0) { _data = []; }
        this._data = _data;
        this._links = [];
    }
    DataList.prototype._refreshLinks = function () {
        // console.log('_refreshLinks',this._links.length);
        this._links.map(function (l) { return l._changed(); });
    };
    Object.defineProperty(DataList.prototype, "data", {
        get: function () {
            return this._data.slice(0);
        },
        set: function (d) {
            this._refreshLinks();
            this._data = d;
        },
        enumerable: false,
        configurable: true
    });
    DataList.prototype.link = function (container, renderer) {
        var ddl = this._links.find(function (l) { return l.container === container; });
        if (ddl)
            return ddl;
        ddl = new DataListLink(this, container, renderer);
        this._links.push(ddl);
        return ddl;
    };
    DataList.prototype.attach = function (link) {
        if (!this._links.find(function (l) { return l === link; })) {
            this._links.push(link);
            link.list = this;
        }
    };
    DataList.prototype.detach = function (link) {
        var id = this._links.findIndex(function (l) { return l === link; });
        if (id > -1) {
            this._links.splice(id, 1);
        }
    };
    DataList.prototype.push = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._refreshLinks();
        (_a = this._data).push.apply(_a, args);
    };
    DataList.prototype.pop = function () {
        this._refreshLinks();
        return this._data.pop();
    };
    DataList.prototype.unshift = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._refreshLinks();
        (_a = this._data).unshift.apply(_a, args);
    };
    DataList.prototype.shift = function () {
        this._refreshLinks();
        return this._data.shift();
    };
    DataList.prototype.splice = function (id, length) {
        var _a;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this._refreshLinks();
        return (_a = this._data).splice.apply(_a, __spreadArray([id, length], args, false));
    };
    DataList.prototype.sort = function (method) {
        this._refreshLinks();
        return this._data.sort(method);
    };
    DataList.prototype.reverse = function () {
        this._refreshLinks();
        return this._data.reverse();
    };
    DataList.prototype.map = function (method) {
        return new DataList(this._data.map(method));
    };
    DataList.prototype.slice = function (start, end) {
        return new DataList(this._data.slice(start, end));
    };
    Object.defineProperty(DataList.prototype, "length", {
        get: function () {
            return this._data.length;
        },
        enumerable: false,
        configurable: true
    });
    return DataList;
}());
exports.DataList = DataList;


/***/ }),

/***/ 920:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomLangRegIO = exports.DomLangText = exports.DomLangReg = exports.DomLang = void 0;
var DomLang = /** @class */ (function () {
    function DomLang() {
        this._map = new Map();
        this._registered = [];
        this._buffer = new Map();
    }
    DomLang.prototype._changeLang = function () {
        this._registered.forEach(function (r) { return r.changeLang(); });
    };
    Object.defineProperty(DomLang.prototype, "lang", {
        get: function () {
            return this._lang;
        },
        set: function (v) {
            if (v !== this._lang && this._map.has(v)) {
                this._buffer = new Map();
                this._lang = v;
                this._changeLang();
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
    * Adds a dictionary
    * @param name
    * @param data
    */
    DomLang.prototype.add = function (name, data) {
        this._map.set(name, data);
        if (!this._lang)
            this.lang = name;
        else if (this.lang === name)
            this._changeLang();
    };
    /**
     * loads a dictionary
     * @param name
     * @param url
     * @returns
     */
    DomLang.prototype.load = function (name, url) {
        var _this = this;
        return new Promise(function (res, rej) {
            fetch(url).then(function (d) { return d.json(); }).then(function (json) {
                _this.add(name, json);
                res(json);
            });
        });
    };
    DomLang.prototype.getText = function (key, params) {
        var tmp = '';
        if (this._buffer.has(key))
            tmp = this._buffer.get(key);
        else if (this._map.has(this._lang)) {
            tmp = this._map.get(this._lang);
            key.split('.').some(function (k) {
                if (tmp.hasOwnProperty(k)) {
                    tmp = tmp[k];
                }
                else {
                    tmp = '';
                    return true;
                }
            });
            this._buffer.set(key, tmp);
        }
        else {
            return '';
        }
        if (params)
            Object.entries(params)
                .forEach(function (_a) {
                var k = _a[0], v = _a[1];
                return tmp = tmp.split('{{' + k + '}}').join(v);
            });
        return tmp;
    };
    /**
     * Gets model translator instance
     * @param targetModel If given, assign translator for the target dom model. Translator is destroyed when the model is destroyed.
     * @returns model translator instance
     */
    DomLang.prototype.register = function (targetModel) {
        var dlr = new DomLangReg(this);
        this._registered.push(dlr);
        if (targetModel && targetModel.on)
            targetModel.on('destroy', function () { return dlr.destroy(); });
        return dlr.io;
    };
    DomLang.prototype.destroy = function (reg) {
        var id = this._registered.findIndex(function (v) { return v === reg; });
        if (id > -1) {
            this._registered.splice(id, 1);
        }
    };
    return DomLang;
}());
exports.DomLang = DomLang;
;
var DomLangReg = /** @class */ (function () {
    function DomLangReg(_root) {
        this._root = _root;
        this.io = new DomLangRegIO(this);
        this.nodes = [];
    }
    DomLangReg.prototype.changeLang = function () {
        this.nodes.forEach(function (n) { return n.change(); });
    };
    DomLangReg.prototype.getText = function (key, params) {
        return this._root.getText(key, params);
    };
    DomLangReg.prototype.getLangText = function (key, params, changeCB, target) {
        var dlt = new DomLangText(this, key, params, changeCB, target);
        this.nodes.push(dlt);
        return dlt;
    };
    DomLangReg.prototype.getTextNode = function (key, params) {
        var textNode = document.createTextNode(this._root.getText(key, params));
        return this.getLangText(key, params || {}, function (text, tgt) { return tgt.nodeValue = text; }, textNode);
    };
    DomLangReg.prototype.getTextLink = function (key, params, target, targetKey) {
        return this.getLangText(key, params || {}, function (text, tgt) { return tgt[targetKey] = text; }, target)
            .change();
    };
    DomLangReg.prototype.getTextWatch = function (key, params, callback) {
        var lt = this.getLangText(key, params || {}, function (text, tgt) {
            if (text !== tgt) {
                var old = tgt;
                lt.target = text;
                callback(lt.target, old);
            }
        }, null).change();
        return lt;
    };
    DomLangReg.prototype.destroyText = function (t) {
        var id = this.nodes.findIndex(function (v) { return v === t; });
        if (id > -1) {
            this.nodes.splice(id, 1);
        }
    };
    DomLangReg.prototype.destroy = function () {
        this._root.destroy(this);
    };
    return DomLangReg;
}());
exports.DomLangReg = DomLangReg;
;
var DomLangText = /** @class */ (function () {
    function DomLangText(_reg, key, params, changeCB, target) {
        this._reg = _reg;
        this.key = key;
        this.params = params;
        this.changeCB = changeCB;
        this.target = target;
        this._rid = 0;
    }
    Object.defineProperty(DomLangText.prototype, "text", {
        get: function () {
            return this._reg.getText(this.key, this.params);
        },
        enumerable: false,
        configurable: true
    });
    DomLangText.prototype.setKey = function (key) {
        this.key = key;
        this.change();
    };
    DomLangText.prototype.setParams = function (params) {
        this.params = params;
        this.change();
    };
    DomLangText.prototype.change = function () {
        var _this = this;
        if (!this._rid) {
            this._rid = requestAnimationFrame(function () {
                _this._rid = 0;
                _this.changeCB(_this.text, _this.target);
            });
        }
        return this;
    };
    DomLangText.prototype.destroy = function () {
        this._reg.destroyText(this);
    };
    return DomLangText;
}());
exports.DomLangText = DomLangText;
;
var DomLangRegIO = /** @class */ (function () {
    function DomLangRegIO(_reg) {
        this._reg = _reg;
    }
    DomLangRegIO.prototype.getText = function (key, params) {
        return this._reg.getText(key, params);
    };
    DomLangRegIO.prototype.getTextNode = function (key, params) {
        return this._reg.getTextNode(key, params);
    };
    DomLangRegIO.prototype.getTextLink = function (key, params, target, targetKey) {
        return this._reg.getTextLink(key, params, target, targetKey);
    };
    DomLangRegIO.prototype.getTextWatch = function (key, params, callback) {
        return this._reg.getTextWatch(key, params, callback);
    };
    DomLangRegIO.prototype.destroy = function () {
        this._reg.destroy();
    };
    return DomLangRegIO;
}());
exports.DomLangRegIO = DomLangRegIO;
;


/***/ }),

/***/ 449:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomRouter = void 0;
var _dom_1 = __webpack_require__(957);
var Listener_1 = __webpack_require__(834);
var DomRouter = /** @class */ (function () {
    function DomRouter(_basePath) {
        if (_basePath === void 0) { _basePath = ''; }
        var _this = this;
        this._basePath = _basePath;
        this._rqid = 0;
        this._listener = new Listener_1.Listener();
        this._current = {
            path: '',
            search: '',
            hash: ''
        };
        this._currentData = {
            path: '',
            search: {},
            hash: {}
        };
        this._anim = function () {
            _this._rqid = requestAnimationFrame(_this._anim);
            var oldData = {
                path: _this._currentData.path,
                search: _this._currentData.search,
                hash: _this._currentData.hash
            };
            var changed = false;
            if (window.location.pathname !== _this._current.path) {
                changed = true;
                var oldValue = _this._currentData.path;
                _this._current.path = window.location.pathname;
                _this._currentData.path = DomRouter.getPath();
                _this._listener.flush('pathchange', { value: _this._currentData.path, oldValue: oldValue });
            }
            if (window.location.search !== _this._current.search) {
                changed = true;
                var oldValue = _this._currentData.search;
                _this._current.search = window.location.search;
                _this._currentData.search = DomRouter.getSearch();
                _this._listener.flush('searchchange', { value: _this._currentData.search, oldValue: oldValue });
            }
            if (window.location.hash !== _this._current.hash) {
                changed = true;
                var oldValue = _this._currentData.hash;
                _this._current.hash = window.location.hash;
                _this._currentData.hash = DomRouter.getHash();
                _this._listener.flush('hashchange', { value: _this._currentData.hash, oldValue: oldValue });
            }
            if (changed) {
                _this._listener.flush('change', { value: _this._currentData, oldValue: oldData });
            }
        };
    }
    Object.defineProperty(DomRouter.prototype, "active", {
        get: function () { return !!this._rqid; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomRouter.prototype, "data", {
        get: function () { return this._currentData; },
        set: function (v) {
            DomRouter.setData(v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomRouter.prototype, "path", {
        get: function () { return this._currentData.path; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomRouter.prototype, "search", {
        get: function () { return this._currentData.search; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomRouter.prototype, "hash", {
        get: function () { return this._currentData.hash; },
        enumerable: false,
        configurable: true
    });
    DomRouter.prototype.start = function () {
        if (!this._rqid) {
            this._rqid = requestAnimationFrame(this._anim);
        }
        return this;
    };
    DomRouter.prototype.stop = function () {
        if (DomRouter._instance === this) {
            console.warn('DomRouter.instance can\'t be stopped');
            return this;
        }
        if (this._rqid) {
            cancelAnimationFrame(this._rqid);
            this._rqid = 0;
        }
        return this;
    };
    DomRouter.prototype.on = function (type, callback) {
        this._listener.on(type, callback);
        return this;
    };
    DomRouter.prototype.getOutlet = function (routes, basePath) {
        if (basePath === void 0) { basePath = ''; }
        return new DomRouterOutlet(this, routes, this._basePath + basePath).dom;
    };
    DomRouter.prototype.link = function (element, path, hash) {
        if (hash === void 0) { hash = false; }
        return DomRouter.link(element, this._basePath + path, hash);
    };
    DomRouter.prototype.getLink = function (contents, path, hash) {
        if (hash === void 0) { hash = false; }
        return DomRouter.getLink(contents, this._basePath + path, hash);
    };
    Object.defineProperty(DomRouter, "instance", {
        get: function () {
            return this._instance || (this._instance = new DomRouter().start());
        },
        enumerable: false,
        configurable: true
    });
    DomRouter.link = function (element, path, hash) {
        if (hash === void 0) { hash = false; }
        var b = typeof (hash) === 'boolean';
        var h = b ? '' : this.obj2Hash(hash);
        var url = path + (h ? '#' + h : '');
        element.onclick = function (evt) {
            var uri = url + (b && hash ? window.location.hash : '');
            window.history.pushState({ uri: uri }, '', uri);
            return false;
        };
        if (element instanceof HTMLAnchorElement) {
            element.href = url;
        }
        return element;
    };
    DomRouter.getLink = function (contents, path, hash) {
        if (hash === void 0) { hash = false; }
        var element = document.createElement('a');
        if (typeof (contents) === 'string') {
            element.innerHTML = contents;
        }
        else {
            element.append(contents);
        }
        return this.link(element, path, hash);
    };
    DomRouter.toLink = function (anchorElement) {
        anchorElement.onclick = function (evt) {
            window.history.pushState({ url: anchorElement.href }, '', anchorElement.href);
            return false;
        };
        return anchorElement;
    };
    DomRouter.getOutlet = function (routes, basePath) {
        if (basePath === void 0) { basePath = ''; }
        return this.instance.getOutlet(routes, basePath);
    };
    DomRouter.getData = function () {
        return {
            path: this.getPath(),
            search: this.getSearch(),
            hash: this.getHash()
        };
    };
    DomRouter.setData = function (v) {
        var p = 'path' in v ? v.path : window.location.pathname;
        var s = 'search' in v ? DomRouter.obj2Hash(v.search) : window.location.search;
        var h = 'hash' in v ? DomRouter.obj2Hash(v.hash) : window.location.hash;
        var newurl = window.location.protocol + "//" + window.location.host + (p && p.charAt(0) !== '/' ? '/' + p : '') + s + h;
        window.history.pushState({ path: newurl }, '', newurl);
    };
    DomRouter.getPath = function () {
        return window.location.pathname;
    };
    DomRouter.setPath = function (p) {
        var newurl = window.location.protocol + "//" + window.location.host
            + (p && p.charAt(0) === '/' ? '' : '/') + p + window.location.search + window.location.hash;
        window.history.pushState({ path: newurl }, '', newurl);
    };
    DomRouter.getSearch = function () {
        return this.hash2Obj(window.location.search);
    };
    DomRouter.setSearch = function (obj) {
        window.location.search = this.obj2Hash(obj);
    };
    DomRouter.getHash = function () {
        return this.hash2Obj(window.location.hash);
    };
    DomRouter.setHash = function (obj) {
        window.location.hash = this.obj2Hash(obj);
    };
    DomRouter.obj2Hash = function (obj) {
        return Object.entries(obj)
            .map(function (_a) {
            var k = _a[0], v = _a[1];
            return k + '=' + encodeURIComponent(v);
        })
            .join('&');
    };
    DomRouter.hash2Obj = function (hash) {
        hash = (hash && (hash.charAt(0) === '#' || hash.charAt(0) === '?') ? hash.slice(1) : hash);
        if (!hash)
            return {};
        var obj = {};
        hash
            .split("&")
            .map(function (v) {
            var id = v.indexOf('=');
            var _a = id > -1 ? [v.slice(0, id), decodeURIComponent(v.slice(id + 1))] : [v, true], key = _a[0], value = _a[1];
            if (String(key) in obj) {
                if (!(obj[String(key)] instanceof Array))
                    obj[String(key)] = [obj[String(key)]];
                obj[String(key)].push(value);
            }
            else {
                obj[String(key)] = value;
            }
        });
        return obj;
    };
    return DomRouter;
}());
exports.DomRouter = DomRouter;
var DomRouterOutlet = /** @class */ (function () {
    function DomRouterOutlet(_router, _routes, _basePath) {
        if (_basePath === void 0) { _basePath = ''; }
        var _this = this;
        this._router = _router;
        this._routes = _routes;
        this._basePath = _basePath;
        this.dom = document.createElement('dom-router-outlet');
        if (!this._routes.find(function (r) { return r.path === '*'; })) {
            throw (['',
                'DomRouterOutlet Error :',
                'routes list is missing the default route {path:\'*\',...}.'
            ].join('\n'));
        }
        if (_router.path)
            this._pathChanged(_router.path);
        _router.on('pathchange', function (evt) { return _this._pathChanged(evt.data.value); });
    }
    DomRouterOutlet.prototype._pathChanged = function (path) {
        var _this = this;
        if (this._path === path)
            return;
        this._path = path;
        // console.log('_pathChanged',this._path);
        var route = this._routes.find(function (r) { return _this._basePath + r.path === path; });
        if (!route)
            route = this._routes.find(function (r) { return r.path === '*'; });
        if (route) {
            if (route.path === route.redirect) {
                //DomRouterOutlet error
                throw (['',
                    'DomRouterOutlet Error :',
                    'Properties path and redirect "' + route.path + '" must be different.'
                ].join('\n'));
            }
            else if (route.redirect) {
                // console.log(this._routes);
                if (!this._routes.find(function (r) { return r.path === route.redirect; })) {
                    // console.log(this._routes.slice(0),path,this._routes.find(r=>r.path===path));
                    throw (['',
                        'DomRouterOutlet Error :',
                        'Bad redirection "' + route.redirect + '" not found.'
                    ].join('\n'));
                }
                DomRouter.setPath(this._basePath + route.redirect);
            }
            else if (route.getDom) {
                this.dom.innerHTML = '';
                var dd = route.getDom(this._router);
                var dom = dd instanceof _dom_1.DomModel ? dd.dom : dd;
                this.dom.append(dom);
            }
            else if (route.model) {
                this.dom.innerHTML = '';
                var dom = new route.model().dom;
                this.dom.append(dom);
            }
        }
    };
    return DomRouterOutlet;
}());


/***/ }),

/***/ 499:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomStore = exports.DomStoreLocalStorageLink = exports.DomStoreElement = exports.DomStoreLink = void 0;
var DomStoreLink = /** @class */ (function () {
    function DomStoreLink(element, target, key, id, io) {
        // console.log(target,io.input);
        if (io === void 0) { io = {}; }
        var _this = this;
        this.element = element;
        this.target = target;
        this.key = key;
        this.id = id;
        this.io = io;
        this.listeners = [];
        if (!this.io.input)
            this.io.input = function (v) { return v; };
        if (!this.io.output)
            this.io.output = function (v) { return v; };
        if (DomStore.booleanable(this.target, this.key)) {
            // this.value=target.checked;
            this.listeners.push({ type: 'change', callback: function (evt) {
                    _this.checkTargetValue();
                } });
        }
        else if (DomStore.numberable(this.target, this.key)) {
            this.listeners.push({ type: 'input', callback: function (evt) {
                    _this.checkTargetValue();
                } });
        }
        else if (DomStore.textable(this.target, this.key)) {
            var type = target instanceof HTMLSelectElement ? 'change' : 'input';
            this.listeners.push({ type: type, callback: function (evt) {
                    _this.checkTargetValue();
                } });
        }
        this.listeners.map(function (l) { return target.addEventListener(l.type, l.callback); });
    }
    DomStoreLink.prototype.checkTargetValue = function () {
        var v = this.io.output(this.getTargetValue());
        if (v !== this.value) {
            this.value = v;
            this.element.valueChanged(this.value, this);
        }
    };
    DomStoreLink.prototype.getTargetValue = function () {
        if (DomStore.booleanable(this.target, this.key))
            return this.target.checked;
        if (DomStore.numberable(this.target, this.key))
            return parseFloat(this.target.value);
        if (DomStore.textable(this.target, this.key))
            return this.target.value;
        return false;
    };
    DomStoreLink.prototype.setValue = function (value) {
        if (DomStore.booleanable(this.target, this.key)) {
            this.value = !!value;
            this.target.checked = this.io.input(this.value);
        }
        else if (DomStore.numberable(this.target, this.key)) {
            this.value = typeof (value) === 'number' ? value : parseFloat(value + '');
            this.target.value = '' + this.io.input(this.value);
        }
        else if (DomStore.textable(this.target, this.key)) {
            this.value = value + '';
            this.target.value = this.io.input(this.value);
        }
        else {
            this.value = value;
            this.target[this.key] = this.io.input(this.value);
        }
        return this;
    };
    DomStoreLink.prototype.destroy = function () {
        var _this = this;
        this.listeners.map(function (l) { return _this.target.removeEventListener(l.type, l.callback); });
        this.listeners = [];
    };
    return DomStoreLink;
}());
exports.DomStoreLink = DomStoreLink;
var DomStoreElement = /** @class */ (function () {
    function DomStoreElement(store, name, value) {
        this.store = store;
        this.name = name;
        this.value = value;
        this.linkz = new Map();
    }
    DomStoreElement.prototype.setValue = function (value) {
        this.valueChanged(value);
    };
    DomStoreElement.prototype.setLink = function (target, key, id, io) {
        this.removeLink(id);
        this.linkz.set(id, new DomStoreLink(this, target, key, id, io).setValue(this.value));
    };
    DomStoreElement.prototype.removeLink = function (id) {
        if (this.linkz.has(id)) {
            this.linkz.get(id).destroy();
            this.linkz.delete(id);
        }
    };
    DomStoreElement.prototype.valueChanged = function (value, link) {
        var _this = this;
        if (this.value !== value) {
            var old_1 = this.value;
            this.value = value;
            Array.from(this.linkz.values())
                .filter(function (s) { return s !== link; })
                .map(function (s) { return s.setValue(_this.value); });
            if (this.store.watchers.has(this.name)) {
                this.store.watchers.get(this.name).map(function (cb) { return cb('change', _this.value, old_1); });
            }
            Array.from(this.store._localStorages.values())
                .forEach(function (ls) { return ls.set(_this.name, value); });
        }
    };
    DomStoreElement.prototype.destroy = function () {
        Array.from(this.linkz.values())
            .map(function (s) { return s.destroy(); });
        this.linkz = new Map();
    };
    DomStoreElement.fromLink = function (store, name, target, key, id, io) {
        var element = new DomStoreElement(store, name, false);
        var link = new DomStoreLink(element, target, key, id, io);
        element.linkz.set(id, link);
        link.checkTargetValue();
        return element;
    };
    return DomStoreElement;
}());
exports.DomStoreElement = DomStoreElement;
var DomStoreLocalStorageLink = /** @class */ (function () {
    // instance
    function DomStoreLocalStorageLink(_store, _prefix) {
        var _this = this;
        this._store = _store;
        this._prefix = _prefix;
        this.entries.forEach(function (_a) {
            var k = _a[0], v = _a[1];
            _this._store.set(k, v);
        });
        window.addEventListener('storage', function (evt) {
            if (evt.storageArea === localStorage && evt.key.indexOf(_this.prefix) === 0) {
                var key = evt.key.slice(_this.prefix.length);
                if (evt.newValue === null) {
                    _this._store.delete(key);
                }
                else {
                    _this._store.set(key, JSON.parse(evt.newValue));
                }
            }
        });
    }
    Object.defineProperty(DomStoreLocalStorageLink.prototype, "prefix", {
        get: function () {
            return DomStoreLocalStorageLink._postPrefix + this._prefix;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomStoreLocalStorageLink.prototype, "entries", {
        get: function () {
            var _this = this;
            return Object.entries(localStorage)
                .filter(function (v) { return v[0].indexOf(_this.prefix) === 0; })
                .map(function (_a) {
                var k = _a[0], v = _a[1];
                return [k.slice(_this.prefix.length), JSON.parse(v)];
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomStoreLocalStorageLink.prototype, "object", {
        get: function () {
            var obj = {};
            this.entries.forEach(function (_a) {
                var k = _a[0], v = _a[1];
                return obj[k] = v;
            });
            return obj;
        },
        enumerable: false,
        configurable: true
    });
    DomStoreLocalStorageLink.prototype.get = function (key) {
        var value = localStorage.getItem(this.prefix + key);
        return value === null ? value : JSON.parse(value);
    };
    DomStoreLocalStorageLink.prototype.set = function (key, value) {
        return localStorage.setItem(this.prefix + key, JSON.stringify(value));
    };
    DomStoreLocalStorageLink._postPrefix = '-DomStoreLocalStorageLink-';
    return DomStoreLocalStorageLink;
}());
exports.DomStoreLocalStorageLink = DomStoreLocalStorageLink;
;
var DomStore = /** @class */ (function () {
    function DomStore() {
        this.elements = new Map();
        this.watchers = new Map();
        this._localStorages = new Map();
    }
    Object.defineProperty(DomStore.prototype, "values", {
        get: function () {
            var _this = this;
            var obj = {};
            return this._proxy || (this._proxy = new Proxy({}, {
                get: function (tgt, prop) { return _this.get(prop); },
                set: function (tgt, prop, val) {
                    _this.set(prop, val);
                    return true;
                }
            }));
        },
        enumerable: false,
        configurable: true
    });
    DomStore.prototype.set = function (name, value) {
        //this._localStorages.set(prefix,new DomStoreLocalStorageLink(this,prefix));
        if (this.elements.has(name)) {
            this.elements.get(name).setValue(value);
        }
        else {
            this.elements.set(name, new DomStoreElement(this, name, value));
        }
    };
    DomStore.prototype.get = function (name) {
        return this.elements.has(name) ? this.elements.get(name).value : '';
    };
    DomStore.prototype.link = function (name, target, key, id, io) {
        if (id === void 0) { id = target; }
        if (io === void 0) { io = {}; }
        if (!id)
            id = target;
        if (this.elements.has(name)) {
            this.elements.get(name).setLink(target, key, id, io);
        }
        else {
            this.elements.set(name, DomStoreElement.fromLink(this, name, target, key, id, io));
        }
    };
    DomStore.prototype.unlink = function (name, id) {
        if (this.elements.has(name)) {
            this.elements.get(name).removeLink(id);
        }
    };
    DomStore.prototype.watch = function (name, callback) {
        if (!this.watchers.has(name)) {
            this.watchers.set(name, []);
        }
        this.watchers.get(name).push(callback);
    };
    DomStore.prototype.unwatch = function (name, callback) {
        if (this.watchers.has(name)) {
            if (callback) {
                var wl = this.watchers.get(name);
                var id = wl.findIndex(function (w) { return w === callback; });
                if (id > -1) {
                    wl.splice(id, 1);
                    if (!wl.length)
                        this.watchers.delete(name);
                }
            }
            else {
                this.watchers.delete(name);
            }
        }
    };
    DomStore.prototype.linkLocalStorage = function (prefix) {
        if (!this._localStorages.has(prefix)) {
            this._localStorages.set(prefix, new DomStoreLocalStorageLink(this, prefix));
        }
    };
    DomStore.prototype.delete = function (name, keepWatching) {
        if (keepWatching === void 0) { keepWatching = false; }
        if (this.elements.has(name)) {
            this.elements.get(name).destroy();
            this.elements.delete(name);
        }
        if (!keepWatching && this.watchers.has(name)) {
            this.watchers.delete(name);
        }
    };
    DomStore.prototype.destroy = function () {
        Array.from(this.elements.values())
            .map(function (s) { return s.destroy(); });
        this.elements = new Map();
        this.watchers = new Map();
    };
    DomStore.prototype.toData = function () {
        var _this = this;
        var obj = {};
        Array.from(this.elements.keys())
            .map(function (name) { return obj[name] = _this.elements.get(name).value; });
        return obj;
    };
    DomStore.prototype.fromData = function (obj) {
        var _this = this;
        Object.entries(obj).map(function (_a) {
            var n = _a[0], v = _a[1];
            return _this.set(n, v);
        });
        return this;
    };
    DomStore.textable = function (target, key) {
        return (key === 'value' || !key) && (target instanceof HTMLInputElement
            || target instanceof HTMLSelectElement
            || target instanceof HTMLTextAreaElement);
    };
    DomStore.numberable = function (target, key) {
        return (key === 'value' || !key) && (target instanceof HTMLInputElement && target.type === 'number');
    };
    DomStore.booleanable = function (target, key) {
        return (key === 'checked' || !key) && (target instanceof HTMLInputElement && target.type === 'checkbox');
    };
    return DomStore;
}());
exports.DomStore = DomStore;


/***/ }),

/***/ 222:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventBuffer = void 0;
var EventBuffer = /** @class */ (function () {
    function EventBuffer() {
        this._eventpile = [];
        this._listening = false;
    }
    Object.defineProperty(EventBuffer.prototype, "listening", {
        get: function () {
            return this._listening;
        },
        enumerable: false,
        configurable: true
    });
    EventBuffer.prototype.on = function (target, type, callback) {
        this._eventpile.push({ target: target, type: type, callback: callback });
        return this;
    };
    EventBuffer.prototype.start = function () {
        if (!this._listening) {
            this._eventpile.map(function (ev) { return ev.target.addEventListener(ev.type, ev.callback); });
            this._listening = true;
        }
        return this;
    };
    EventBuffer.prototype.stop = function () {
        if (this._listening) {
            this._eventpile.map(function (ev) { return ev.target.removeEventListener(ev.type, ev.callback); });
            this._listening = false;
        }
        return this;
    };
    EventBuffer.prototype.clear = function () {
        this.stop();
        this._eventpile = [];
        return this;
    };
    return EventBuffer;
}());
exports.EventBuffer = EventBuffer;
// 


/***/ }),

/***/ 834:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Listener = exports.ListenerCallback = exports.ListenerEvent = void 0;
var ListenerEvent = /** @class */ (function () {
    function ListenerEvent(type, data, target) {
        this.type = type;
        this.data = data;
        this.target = target;
        this._stopped = false;
    }
    Object.defineProperty(ListenerEvent.prototype, "stopped", {
        get: function () {
            return this._stopped;
        },
        enumerable: false,
        configurable: true
    });
    ListenerEvent.prototype.stop = function () {
        this._stopped = true;
    };
    return ListenerEvent;
}());
exports.ListenerEvent = ListenerEvent;
var ListenerCallback = /** @class */ (function () {
    function ListenerCallback(type, callback, once) {
        this.type = type;
        this.callback = callback;
        this.once = once;
    }
    return ListenerCallback;
}());
exports.ListenerCallback = ListenerCallback;
/**
*
*/
var Listener = /** @class */ (function () {
    function Listener(_target) {
        this._target = _target;
        this._callbacks = new Map();
    }
    Listener.prototype._on = function (type, callback, once, prepend, one) {
        var _this = this;
        if (once === void 0) { once = false; }
        if (prepend === void 0) { prepend = false; }
        if (one === void 0) { one = false; }
        if (type instanceof Array)
            type.map(function (t) { return _this._on(t, callback, once, prepend); });
        else if (one) {
            this._callbacks.set(type, [new ListenerCallback(type, callback, once)]);
        }
        else {
            if (!this._callbacks.has(type))
                this._callbacks.set(type, []);
            this._callbacks.get(type)[prepend ? 'unshift' : 'push'](new ListenerCallback(type, callback, once));
        }
        return this;
    };
    Listener.prototype.has = function (type) {
        return this._callbacks.has(type);
    };
    /**
    *
    * @param type the event type
    * @param callback
    * @param prepend
    * @returns
    */
    Listener.prototype.on = function (type, callback, prepend) {
        if (prepend === void 0) { prepend = false; }
        return this._on(type, callback, false, prepend);
    };
    Listener.prototype.once = function (type, callback, prepend) {
        if (prepend === void 0) { prepend = false; }
        return this._on(type, callback, true, prepend);
    };
    Listener.prototype.off = function (type, callback) {
        var _this = this;
        if (type instanceof Array)
            type.map(function (t) { return _this.off(t, callback); });
        else if (this._callbacks.has(type)) {
            var lst = this._callbacks.get(type);
            var id = lst.findIndex(function (l) { return l.callback === callback; });
            if (id > -1) {
                lst.splice(id, 1);
                if (!lst.length)
                    this._callbacks.delete(type);
            }
        }
        return this;
    };
    Listener.prototype.flush = function (type, data, target) {
        var result = [];
        if (this._callbacks.has(type)) {
            var evt = new ListenerEvent(type, data, target || this._target);
            var oldlist = this._callbacks.get(type);
            var nulist = [];
            this._callbacks.set(type, nulist);
            for (var ci = 0; ci < oldlist.length; ci++) {
                result.push(oldlist[ci].callback(evt));
                if (!oldlist[ci].once)
                    nulist.push(oldlist[ci]);
                if (evt.stopped) {
                    nulist.push.apply(nulist, oldlist.slice(ci + 1));
                    break;
                }
            }
        }
        return result;
    };
    Listener.prototype.clear = function (type) {
        var _this = this;
        if (type instanceof Array) {
            type.map(function (t) { return _this.clear(t); });
        }
        else if (type) {
            if (this._callbacks.has(type)) {
                this._callbacks.delete(type);
            }
        }
        else {
            Array.from(this._callbacks.keys())
                .map(function (k) { return _this._callbacks.delete(k); });
        }
    };
    return Listener;
}());
exports.Listener = Listener;


/***/ }),

/***/ 483:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player() {
        // ---------------------------
        this._started = 0;
        this._onUpdate = function () { };
        this._onStart = function () { };
        this._onStop = function () { };
    }
    Player.addPlayer = function (player) {
        var d = Date.now();
        if (!this._rqid) {
            this._rqid = requestAnimationFrame(this._update);
            this._lastTime = d;
        }
        var ft = d - this._lastTime;
        player._update(d, ft);
        this._players.push(player);
    };
    Player.removePlayer = function (player) {
        this._players.splice(this._players.findIndex(function (p) { return player; }), 1);
        if (!this._players.length)
            cancelAnimationFrame(this._rqid);
    };
    Player.tween = function (cb, timeout, tconf) {
        if (tconf === void 0) { tconf = {}; }
        var sd = Date.now();
        var formula = function (p) { return p; };
        if ('cos' in tconf) {
            // formula=(p:number)=>0.5-Math.cos(p*Math.PI)*0.5;
            formula = function (p) {
                if (p < 0.5) {
                    return 0.5 - Math.pow(Math.cos(p * Math.PI), tconf.cos) * 0.5;
                }
                else {
                    return 0.5 + Math.pow(Math.cos((1 - p) * Math.PI), tconf.cos) * 0.5;
                }
            };
        }
        else if ('quadratic' in tconf) {
            var arr2_1 = [0, tconf.quadratic, 1];
            formula = function (perc) { return (Math.pow(1 - perc, 2) * arr2_1[0]
                + 2 * (1 - perc) * perc * arr2_1[1]
                + Math.pow(perc, 2) * arr2_1[2]); };
        }
        else if ('cubic' in tconf) {
            var arr2_2 = [0, tconf.cubic[0], tconf.cubic[1], 1];
            formula = function (perc) { return (Math.pow(1 - perc, 3) * arr2_2[0]
                + 3 * Math.pow(1 - perc, 2) * perc * arr2_2[1]
                + 3 * (1 - perc) * Math.pow(perc, 2) * arr2_2[2] + Math.pow(perc, 3) * arr2_2[3]); };
        }
        return new Promise(function (resolve) {
            new _a()
                .onStop(function (p) { return resolve(p); })
                .onUpdate(function (p) {
                var perc = Math.min(p.elapsed / timeout, 1);
                cb(formula(perc));
                if (perc === 1) {
                    p.stop();
                }
            }).start();
        });
    };
    Player.prototype._update = function (date, ft) {
        this.date = date;
        this.ft = ft;
        this.elapsed = date - this._started;
        this._onUpdate(this);
    };
    Player.prototype.onUpdate = function (callback) {
        this._onUpdate = callback;
        return this;
    };
    Player.prototype.onStart = function (callback) {
        this._onStart = callback;
        return this;
    };
    Player.prototype.onStop = function (callback) {
        this._onStop = callback;
        return this;
    };
    Player.prototype.start = function () {
        if (!this._started) {
            this._started = Date.now();
            _a.addPlayer(this);
            this._onStart(this);
        }
        return this;
    };
    Player.prototype.stop = function () {
        if (this._started) {
            _a.removePlayer(this);
            this._onStop(this);
            this._started = 0;
        }
        return this;
    };
    var _a;
    _a = Player;
    Player._players = [];
    Player._rqid = 0;
    Player._lastTime = 0;
    Player._update = function () {
        _a._rqid = requestAnimationFrame(_a._update);
        var d = Date.now();
        var ft = d - _a._lastTime;
        _a._lastTime = d;
        _a._players.forEach(function (p) { return p._update(d, ft); });
    };
    return Player;
}());
exports.Player = Player;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(156);
/******/ 	_dom = __webpack_exports__;
/******/ 	
/******/ })()
;
(function(){
  var __dom = _dom.default;
  Object.keys(_dom).filter(k => k !== "default").forEach(k => {
    __dom[k] = _dom[k];
  });
  _dom = __dom;
})();