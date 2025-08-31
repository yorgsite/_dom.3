## \_dom

v3.\*

#### A light but powerful javascript library for html apps.

**\_dom.js** is focused on html and css creation.

*   Ultra light : \< 60k or 121k unminified
*   Easy creation of [html](#tg_html) elements and [css](#tg_css) rules.
*   Use sass like syntax to optimise your css [rules](#_dom.rules).
*   Interacts exclusively with native browser methods.
    *   No time comsuming proxies.
    *   No code compilation for web.
    *   No intrusive attributes in base elements.
    *   Compatible nodejs
    *   Compatiblee typescript
*   Full html [templating](#tg_temlating).
    *   Low template architecture constraints.
    *   No dom intrusion.

The purposes of **\_dom.js** are:

*   Create easily dynamic apps.
*   Stay simple and minimal.
*   Work on the lower level possible.
*   Being integrable with any kind of web architecture.

## Menu

*   [Use in web page](#tg_webjs)
*   [Use with nodejs](#tg_nodejs)
*   [Html](#tg_html)
    *   [\_dom](#_dom)
*   [Css](#tg_css)
    *   [\_dom.rule](#_dom.rule)
    *   [\_dom.rules](#_dom.rules)
*   [Templating](#tg_temlating)
*   [V3 features](#tg_v3features)

API [documentation](https://html-preview.github.io/?url=https://raw.githubusercontent.com/yorgsite/_dom.3/master/docs/classes/DomStore.html).

## <a name="tg_webjs"></a>Use in web page

```plaintext
<script src="./path/to/_dom.js"></script>
```

## <a name="tg_nodejs"></a> Use with nodejs

For web translators like **webpack**.

Install :

```plaintext
npm install dom-for-node
```

Import (js) :

```javascript
const _dom=require('dom-for-node');
```

Import (ts) :

```javascript
import _dom from 'dom-for-node';
```

## <a name="tg_html"></a> html

#### Instanciate html elements or structure

`_dom(tagName,datas,childs,nameSpace)`

*   `string` **tagName** : element tagname
*   `object` **datas** \[optional\] : element attributes.
*   `Array` **childs** \[optional\] : element childs. can contain strings and html elements.
*   `string` **nameSpace** \[optional\] : element namesapace if any.
*   **returns** `HTMLElement`

Exemple:

```javascript
var inpt=_dom('input',{type:'text',value:'hello'});
document.body.appendChild(inpt);

var div=_dom('div',{style:{border:'solid 1px #0f0'}},[
    'aaa',
    _dom('u',['bbb']}),
    'ccc'
]);
document.body.appendChild(div);
```

## <a name="tg_css"></a>css

#### <a name="_dom.rule"></a>create dynamics css rules.

`_dom.rule(selector, datas)`

*   `string` **selector** : the new rule rule query selector.
*   `object` **datas** \[optional\] : style datas if any.
*   **returns** `CSSStyleRule`

Exemple :

```javascript
var tableRule=_dom.rule('table',{border:'solid 1px #0f0'});

setTimeout(function(){
    tableRule.style.borderColor='#00f';
},2000);
```

#### <a name="_dom.rules"></a>Create rules collection with sass like structures

`_dom.rules(datas)`

*   _object_ `datas` : sass like structured object.
*   **returns** collection of `CSSStyleRule` by selector and **alias**.

Exemple :

```javascript
var rules =_dom.rules({
    '$color1':'#0f0',
    '$color2':'#f00',
    'table':{
        border:'solid 1px $color1',
        '& td':{
            '&>div':{
                alias:'subdiv',
                border:'solid 1px $color2',
                display:'block'
            }
        }
    }
});

setTimeout(function(){
    rules.table.style.borderColor='#00f';
    rules.subdiv.style.color='#d06';
},2000);
```

## <a name="tg_temlating"></a>Templating

#### Add custom structures to _\_dom_

**Exemple**

TS :

```typescript
/**
 * creates an Table of 1 line.
 * @param {Array} childlist columns contents.
 */
export class TableLineModel extends DomModel {
	static rulesData = {
		">table": {
			border: 'solid 1px #f00',
			'>tr>td': {
				border: 'solid 1px #00f',
			}
		},
	};
	private _container = _dom('td', {});
	_domOnBuild(children?: (HTMLElement|string):[]): HTMLTableElement {
		if(children)children.forEach(c=>this._container.append(c));
		return _dom('table', { cellPadding: 0, cellSpacing: 0, border: 0 }, [
			_dom('tbody', {}, [this._container])
		]);
	}
	push(element:HTMLElement|string){
		this._container.append(element);
	}
}
```

#### JS :

```javascript
/**
 * creates an Table of 1 line.
 * @param {Array} childlist columns contents.
 */
export class TableLineModel extends _dom.DomModel {
	static rulesData = {
		">table": {
			border: 'solid 1px #f00',
			'>tr>td': {
				border: 'solid 1px #00f',
			}
		},
	};
	_container = _dom('td', {});
	_domOnBuild(children) {
		if(children)children.forEach(c=>this._container.append(c));
		return _dom('table', { cellPadding: 0, cellSpacing: 0, border: 0 }, [
			_dom('tbody', {}, [this._container])
		]);
	}
	push(element){
		this._container.append(element);
	}
}
```

#### Use :

```javascript
var tl=new TableLineModel(['000',_dom('div',{},['abc'])]);
// append element.
document.body.appendChild(tl.dom);

setTimeout(function(){
    // calls component 'push' method.
    tl.push('def');
},2000);
```

#### Legacy js method :

`_dom.model(tagName,constructor,cssRules)`

*   `string` **tagName** : the custom element name.  
    Must contain at least one "-" to avoid conflict with natives HTMLElements.
*   `function` **constructor** : Must return an HTMLElement.
    
    Receive the **arguments** from [\_dom](#) but the dont have to respect the classical nomenclature excepted **tagName** (the first).
    
*   `object|function` **cssRules** \[optional\] : is or returns an object describing rules like [\_dom.rules](#_dom.rules),  
    but the created collection will be insancied only once and shared among interfaces.  

NB : You can use the [Model creator](#tg_model_creator) to help generate model code.

```javascript
_dom.model('table-line',function(tagName,children){
	var doms={};
	var build=function(){
		doms.container = _dom('td', {});
		if(children)children.forEach(c=>this._container.append(c));
		doms.root = _dom('table', { cellPadding: 0, cellSpacing: 0, border: 0 }, [
			_dom('tbody', {}, [doms.container])
		]);
		doms.root.push=function(element){
			this._container.append(element);
		};
	};
	build();
	return doms.root;
},{
	">table": {
		border: 'solid 1px #f00',
		'>tr>td': {
			border: 'solid 1px #00f',
		}
	},
});

// ------ use
var tl=_dom('table-line',['000',_dom('div',{},['abc'])]);
// append element.
document.body.appendChild(tl.dom);

setTimeout(function(){
    // calls component 'push' method.
    tl.push('def');
},2000);
```

#### Model creator.

To create fast and easy the backbone of your component, you can use the [model creator](https://github.com/yorgsite/_dom-model-creator).(legacy js).

## V3 features

*   Typescript
*   class Models
*   built in tools