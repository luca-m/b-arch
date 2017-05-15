/*
 * bdownloader.js
 * Copyright (C) 2017 stk <stk@1337-TP>
 *
 * Distributed under terms of the MIT license.
 */
"use strict";
var async = require('async-q');
var temp = require('temp').track();
 

module.exports.BookmarkDownloader=class BookmarkDownloader{
  constructor(archive, fetchers) {
    this._fetchers=fetchers.sort((x,y)=>y._prio-x._prio);
    this._archive=archive;
    this._stats={success_list:[],failed_list:[]};
  }
  handle_bookmark(bookmark){
    let p=null;
    this._fetchers.some(f=>{
      if (f.can_handle(bookmark)){
        let opath=temp.path({prefix:'barch_'});
        p=f.fetch(bookmark, opath)
        .then(ok=>{
          console.log('[-] bookmark '+bookmark.url+' to '+opath)
          return this._archive.store(bookmark,opath,bookmark.tags) 
        });
        return true;
      } 
    })
    if (!p){ p = new Promise((suc,rej)=>{rej(new Error('Cannot handle bookmark, no fetcher support it.',bookmark))}) }
    return p;
  }
  _to_bookmark_list(bookmarks, blist, curtags){
    curtags=curtags||[];
    for (let i=0;i<bookmarks.length;i++){
      if (bookmarks[i].children){
        let tags=[]; curtags.forEach(x=>tags.push(x))
        tags.push(bookmarks[i].title)
        this._to_bookmark_list(bookmarks[i].children,blist,tags)
      } else if (bookmarks[i].url){
        let b={};
        for (let k in bookmarks[i]){b[k]=bookmarks[i][k]}
        b.tags=curtags;
        blist.push(b);
      }
    }
  }
  download_bookmarks(bookmarks_tree,parallel_limit){
    var p=null;
    return this._archive.init()
    .then(arch_ready=>{
      var blist=[];
      this._to_bookmark_list(bookmarks_tree.bookmarks,blist);
      this._stats={failed_list:[],success_list:[]};
      return async.eachLimit(blist,parallel_limit||20, bmark=>{
        return this.handle_bookmark(bmark)
        .then(ok=>{
          this._stats.success_list.push(bmark); 
        })
        .catch(er=>{ 
          this._stats.failed_list.push(bmark); 
          console.error('[!] bookmark handling error ',bmark,er) 
        });
      })
      .then(over=>{
        return {
          success:this._stats.success_list.length, 
          failed:this._stats.failed_list.length
        };
      });
    });
  }
}
