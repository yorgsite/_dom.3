

export class DataListLink<T>{
	private _rid:number=0;
	private _data:T[]=[];
	public dumb:boolean=false;
	// private _children:HTMLElement[]=[];
	constructor(
		private _datalist:DataList<T>,
		private _container:HTMLElement,
		private _renderer:(data:T,id:number,list:T[])=>HTMLElement
	){
		this._changed();
	}
	_changed(){
		
		if(!this._rid){
			this._rid=requestAnimationFrame(()=>{
				this._rid=0;
				this.refresh();
			});	
		}
	}
	private refresh(){
		if(!this._datalist||!this._container)return;
		const _old=this._data;
		const _new=this._datalist.data;
		if(this.dumb){
			this._container.innerHTML='';
			_new.map((ch,ni)=>this._container.appendChild(this._renderer(ch,ni,_new)));
		}else{
			const oldMap=new Map<number,T>();
			const ovMap=new Map<T,boolean>();
			_old.map((v,i)=>oldMap.set(i,v));
			const nid=_new.map(v=>{
				if(ovMap.has(v))return -1;
				const id=_old.findIndex(vv=>vv===v);
				if(id>-1){
					oldMap.delete(id);
					ovMap.set(v,true);
				}
				return id;
			});
			
			const children=nid.map((id,ni)=>id>-1?this._container.childNodes[id]:this._renderer(_new[ni],ni,_new));
			
			Array.from(oldMap.keys())
			.map(id=>this._container.childNodes[id])
			.map(cn=>this._container.removeChild(cn));
			children.map(c=>this._container.appendChild(c));
		}
		this._data=_new;
	}


	get list():DataList<T>{
		return this._datalist;
	}

	set list(v:DataList<T>){
		if(v!==this._datalist){
			if(this._datalist){
				this._datalist.detach(this);
			}
			this._datalist=v;
			this._datalist.attach(this);
			this._changed();
		}
	}

	get container():HTMLElement{
		return this._container;
	}

	set container(c:HTMLElement){
		if(this._container!==c){
			if(this._container&&c){
				Array.from(this._container.childNodes)
				.map(cn=>c.appendChild(cn));
				this._container=c;	
			}else if(this._container){
				Array.from(this._container.childNodes)
				.map(cn=>this._container.removeChild(cn));
			}else if(c){
				this._data.map((d,i)=>c.appendChild(this._renderer(d,i,this._data)));	
			}
			this._container=c;
		}
	}

	get renderer():(data:T,id:number,list:T[])=>HTMLElement{
		return this._renderer;
	}
	set renderer(r:(data:T,id:number,list:T[])=>HTMLElement){
		if(this._renderer!==r){
			Array.from(this._container.childNodes)
			.map(cn=>this._container.removeChild(cn));
			this._data.map((d,i)=>this._container.appendChild(this._renderer(d,i,this._data)));	
		}
	}

	get data():T[]{
		return this._datalist.data;
	}
	set data(d:T[]){
		this._datalist.data=d;
	}

}

export class DataList<T>{
	private _links:DataListLink<T>[]=[];
	constructor(
		private _data:T[]=[]
	){}

	private _refreshLinks(){
		// console.log('_refreshLinks',this._links.length);
		this._links.map(l=>l._changed());
	}
	get data():T[]{
		return this._data.slice(0);
	}
	set data(d:T[]){
		this._refreshLinks();
		this._data=d;
	}

	link(
		container:HTMLElement,
		renderer:(data:T,id:number,
		list:T[],

	)=>HTMLElement):DataListLink<T>{
		let ddl=this._links.find(l=>l.container===container);
		if(ddl)return ddl;
		ddl=new DataListLink<T>(this,container,renderer);
		this._links.push(ddl);
		return ddl;
	}
	attach(link:DataListLink<T>){
		if(!this._links.find(l=>l===link)){
			this._links.push(link);
			link.list=this;
		}
	}
	detach(link:DataListLink<T>){
		const id = this._links.findIndex(l=>l===link);
		if(id>-1){
			this._links.splice(id,1);
		}
	}

	push(...args:T[]){
		this._refreshLinks();
		this._data.push(...args);
	}
	pop():T{
		this._refreshLinks();
		return this._data.pop();
	}
	unshift(...args:T[]){
		this._refreshLinks();
		this._data.unshift(...args);
	}
	shift():T{
		this._refreshLinks();
		return this._data.shift();
	}
	splice(id:number,length:number,...args:T[]):T[]{
		this._refreshLinks();
		return this._data.splice(id,length,...args);
	}
	sort(method?:(a:T,b:T)=>number):T[]{
		this._refreshLinks();
		return this._data.sort(method);
	}
	reverse():T[]{
		this._refreshLinks();
		return this._data.reverse();
	}
	map<R extends any = T>(method:(value:T,id:number,array:T[])=>R){
		return new DataList<R>(this._data.map(method));
	}
	slice(start:number,end:number){
		return new DataList<T>(this._data.slice(start,end));
	}

	get length():number{
		return this._data.length;
	}
}
