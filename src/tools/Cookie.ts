
export class Cookie{
	/**
	* 
	* @param name 
	* @returns 
	*/
	public static get(name:string):string|null{
		return (document.cookie.match(RegExp('(?:^|;\\s*)'+encodeURI(name)+'=([^;]*)'))||[,null])[1];
	}

	/**
	* 
	* @param name 
	* @returns 
	*/
	public static has(name:string){
		return this.get(name)!==null;
	}

	/**
	* 
	* @param name 
	* @param path 
	*/
	public static delete(name:string,path:string='/'){
		document.cookie =  encodeURI(name)+'=;Path='+path+';Domain='+location.hostname+';expires=Thu, 01 Jan 1970;'
	}

	/**
	* 
	* @param name 
	* @param value 
	* @param options 
	*/
	public static set(name:string,value:string,options?:CookiesOptionsType){
		const date:Date = new Date();
		const opt=options||{};
		const params:string[]=[];
		params.push(encodeURI(name)+'='+value+';');
		if(!opt.session){
			const expires = opt.expires || (new Date(Date.now()+(((opt.expireDays||0)*86400000)||((opt.expireHours||0)*3600000)||((opt.expireMinutes||0)*60000)||86400000))
			).toUTCString();
			// -new Date().getTimezoneOffset()*60000
			params.push('expires='+expires+';');
		}
		params.push('Path='+(opt.path||'/')+';');
		if(opt.domain){
			params.push('Domain='+opt.domain+';');
		}
		if(opt.secure && location.protocol === 'https'){
			params.push('secure');
		}
		//console.log(params.join(''));		
		document.cookie = params.join('');
	}

	/**
	* 
	* @returns 
	*/
	public static getAll():{[k:string]:string}{
		const data : {[k:string]:string} = {};
		document.cookie.split(';').map(v=>v.trim()).filter(v=>v).forEach(v=>{
			const id=v.indexOf('=');
			data[decodeURI(v.slice(0,id).trim())]=v.slice(id+1);
		});
		return data;
	}
};

export type CookiesOptionsType={
	secure?:boolean;
	session?:boolean;
	path?:string;
	domain?:string;
	expires?:string;
	expireDays?:number;
	expireHours?:number;
	expireMinutes?:number;
};