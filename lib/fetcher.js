/*
 * bookmark.js
 * Copyright (C) 2017 luca.mella@studio.unibo.it
 *
 * Distributed under terms of the MIT license.
 */
"use strict";
var fs=require('fs');
var spawn = require ('../lib/util').spawn_process;


class Fetcher{
  constructor(prio) {
    this._prio=Number(prio)||0;
  }
  can_handle(bookmark){
    return true;
  }
  fetch(bookmark, path){
  }
}

module.exports.Fetcher=Fetcher;
module.exports.PDFFetcher=class PDFFetcher extends Fetcher {
  constructor(prio, wkhtmlpath) {
    super(prio||9)
		this._wgetpath=wkhtmlpath||'/usr/bin/wget';
  }
  can_handle(bookmark){
    return /^https?:.+\.pdf$/i.test(bookmark.url);
  }
  fetch(bookmark, path){
    return new Promise((success,reject)=>{
     	return spawn(this._wgetpath,['--no-check-certificate',bookmark.url,'-O',path])
			.then(ok=>success(path),err=>reject(err))
    })
  }
}
module.exports.HTMLPageFetcher=class HTMLPageFetcher extends Fetcher {
  constructor(prio, wkhtmlpath) {
    super(prio||0)
		this._wkhtmlpath=wkhtmlpath||'/usr/bin/wkhtmltopdf';
  }
  can_handle(bookmark){
    return /^https?:.+$/i.test(bookmark.url);
  }
  fetch(bookmark, path){
    return new Promise((success,reject)=>{
     	return spawn(this._wkhtmlpath,[bookmark.url,path])
			.then(ok=>success(path),err=>reject(err))
    })
  }
}
module.exports.RepoFetcher=class RepoFetcher extends Fetcher {
  constructor(prio,wgetpath) {
    super(prio||10)
		this._wgetpath=wgetpath||'/usr/bin/wget';
		this._re=[
			/^(https:\/\/github\.com\/\w+\/[\w-]+)(\.git|\/blob\/\w+\/README\.md)?$/i,
			/^(https:\/\/bitbucket\.org\/\w+\/\w+)(\/src\/(\w+\?at=\S+))?$/i
		]
  }
  can_handle(bookmark){
    return this._re.some(r=>r.test(bookmark.url));
  }
	_build_download_url(u){
		if ( u.indexOf('github.com')!=-1){ return u+'/archive/master.zip'}
		if ( u.indexOf('bitbucker.org')!=-1){ return u+'/get/master.zip' }
		return null
	}
  fetch(bookmark, path){
    return new Promise((success,reject)=>{
			if (!this.can_handle(bookmark)){
				reject(new Error('cannot handle bookmark '+bookmark.url))
			}
			return this._re.some(r=>{
				let m=r.exec(bookmark.url);
				if (!m) {return false}
     		return spawn(this._wgetpath,[this._build_download_url(m[1]),'-O',path])
				.then(ok=>success(path),err=>reject(err))
			})||reject(new Error('very bad thing happened'));
    })
  }
}

