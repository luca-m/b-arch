/*
 * archive.js
 * Copyright (C) 2017 luca.mella@studio.unibo.it
 *
 * Distributed under terms of the MIT license.
 */
"use strict";
var path=require('path');
var fs=require('fs-extra');
var sanitize = require("sanitize-filename");
var readChunk = require('read-chunk');
var fileType = require('file-type');

class BookmarkArchive{
  constructor(){
  }
	init(){}
  store(bookmark, localfile, path_tags){  }
} 

module.exports.BookmarkArchive=BookmarkArchive;

module.exports.BookmarkFileArchive=class BookmarkFileArchive extends BookmarkArchive{
  constructor(basefolder, options){
		super()
		this._basefolder=path.resolve(basefolder);
		this._today_basefolder=this.get_today_basefolder();
		this._copy=(options||{}).copy?true:false;
  }
	_mkdir(fulldir){
		var fdir=path.resolve(fulldir);
		var ppieces=fdir.split(path.sep).filter(x=>x=!'');
    return new Promise((success,reject)=>{
			var last_err;
			ppieces.reduce((x,y)=>{
				let pth=x+path.sep+y;
				last_err=null;
				try{fs.mkdirSync(pth)}catch(e){last_err=e;}
				return pth
			});
			if (!last_err||last_err.code==='EEXIST'){ success(fulldir)	} 
			else { reject(last_err) }
    })
	}
	_name_for_bookmark_sync(bookmark,localpath){
		/* 	
  				type: 'bookmark',
  				url: 'http://www.blackhillsinfosec.com/?p=5578',
  				title: 'Sample1',
  				add_date: '1472922024' 
		*/
		var name = sanitize(bookmark.title+'_AT_'+bookmark.url,{replace:'_'})
			.replace(/\s+/g,'_');
		if (localpath && fs.existsSync(localpath)){
			try {
				let buf=readChunk.sync(localpath,0,4100)
				name+='.'+fileType(buf).ext;
			} catch (e){  }
		}
		return name;
	}
	init(){
    return new Promise((success,reject)=>{
     	let basep=this._today_basefolder;
			if (fs.existsSync(basep)){ success(basep) }
			else { this._mkdir(basep).then(ok=>success(basep),err=>reject(err)) }
    })
	}	
	get_today_basefolder(){
		var ds=new Date().toISOString().split('T')[0];
   	return path.join(this._basefolder,ds);
	}
  store(bookmark, localfile, path_tags){
    return new Promise((success,reject)=>{
			if (bookmark.type!='bookmark'){ return reject(new Error('not a bookmark',bookmark)) }
			return this.init().then(basep=>{
      	let pt=path.resolve(basep+path.sep+
					path_tags
					.map(x=>x.replace(new RegExp(path.sep,'g'),''))
					.filter(x=>x=!'')
					.join(path.sep))
				return this._mkdir(pt)
				.then(ok=>{
					let fulllfile=path.resolve(localfile);
					let bname=this._name_for_bookmark_sync(bookmark,fulllfile);
					let fullbname=pt+path.sep+bname;
					let fun=this._copy?fs.copy:fs.move;
					return fun(fulllfile,fullbname,(err)=>{
						if (err){reject(err)} else {success()}
					})
				})
				.catch(e=>reject(e))
			})
    })
  }
}
