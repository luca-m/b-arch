/*
 * test_bookmarks.js
 * Copyright (C) 2017 luca.mella@studio.unibo.it
 *
 * Distributed under terms of the MIT license.
 */
"user strict";
var chai = require('chai');
var util = require('util');
var fs = require('fs');
var expect = chai.expect;
var assert = chai.assert;


var inspect=(x)=>{console.log(util.inspect(x,true,null,true))}

var bdownloader=require('../lib/bdownloader');
var Fetcher=require('../lib/fetcher').Fetcher;
var BookmarkArchive=require('../lib/archive').BookmarkArchive;


class MokFetcher extends Fetcher{
  constructor(){
		super()
    this._fetched=[];
  }
  can_handle(bmark){
    //console.log('[TEST] Fetcher can handle  ',bmark);
    return true;
  }
  fetch(bmark,opath){
    //console.log('[TEST] Fetcher fetch to '+opath+' :',bmark);
    this._fetched.push({bookmark:bmark,path:opath})
    return new Promise((suc,rej)=>{suc(opath)}) 
  }

}
class MokArchive extends BookmarkArchive{
  constructor(){
		super()
    this._stored=[];
  }
  init(){
    //console.log('[TEST] Archive init');
    return new Promise((suc,rej)=>{suc()}) 
  }
  store(bookmark, localfile, path_tags){
    //console.log('[TEST] Archive storing '+localfile+' with path-tags',path_tags,bookmark);
    this._stored.push({bookmark:bookmark,localfile:localfile,tags:path_tags})
    return new Promise((suc,rej)=>{suc()}) 
  }
}

var sample_bmarks={ parser: 'netscape',
  bookmarks: 
   [ { title: 'Menu',
       children: 
        [ { type: 'folder',
            title: 'Bookmarks bar',
            add_date: '1494367772',
            last_modified: '1494367881',
            children: 
             [ { type: 'folder',
                 title: 'pdf',
                 add_date: '1494367816',
                 last_modified: '1494367823',
                 children: 
                  [ { type: 'folder',
                      title: 'test1',
                      add_date: '1494367823',
                      last_modified: '1494367949',
                      children: 
                       [ { type: 'bookmark',
                           url: 'https://www.contextis.com/documents/120/Glibc_Adventures-The_Forgotten_Chunks.pdf',
                           title: 'Glibc_Adventures-The_Forgotten_Chunks.pdf',
                           add_date: '1494367944' },
                       ] },
                  ] },
               { type: 'folder',
                 title: 'html',
                 add_date: '1494367834',
                 last_modified: '1494367848',
                 children: 
                  [ { type: 'folder',
                      title: 'test1',
                      add_date: '1494367848',
                      last_modified: '1494367944',
                      children: 
                       [ { type: 'bookmark',
                           url: 'https://pastebin.com/0SNSvyjJ',
                           title: 'Hack Back! A DIY Guide - Pastebin.com',
                           add_date: '1494367918' },
                       ] },
                   ] },
               { type: 'folder',
                 title: 'repo',
                 add_date: '1494367855',
                 last_modified: '1494367918',
                 children: 
                  [ { type: 'bookmark',
                      url: 'https://github.com/countercept/doublepulsar-detection-script',
                      title: 'GitHub - countercept/doublepulsar-detection-script: A python2 script for sweeping a network to find windows systems compromised with the DOUBLEPULSAR implant.',
                      add_date: '1494367881' },
                  ] },
               ] },
          ] },
     ] };

describe("Test Bookmark Downloader", (o)=>{
  beforeEach(() => {   });
  after(()=>{  });
  it("test tree to bookmark list", done => {
    var arch= new MokArchive();
    var fetch= new MokFetcher();
		var bd = new bdownloader.BookmarkDownloader(arch,[fetch])
    var blist=[];
    bd._to_bookmark_list(sample_bmarks.bookmarks,blist);
    //console.log(blist);
    assert.lengthOf(blist,3,'some bookmarks not extracted from tree');
    let res=[ { type: 'bookmark',
    url: 'https://www.contextis.com/documents/120/Glibc_Adventures-The_Forgotten_Chunks.pdf',
    title: 'Glibc_Adventures-The_Forgotten_Chunks.pdf',
    add_date: '1494367944',
    tags: [ 'Menu', 'Bookmarks bar', 'pdf', 'test1' ] },
  { type: 'bookmark',
    url: 'https://pastebin.com/0SNSvyjJ',
    title: 'Hack Back! A DIY Guide - Pastebin.com',
    add_date: '1494367918',
    tags: [ 'Menu', 'Bookmarks bar', 'html', 'test1' ] },
  { type: 'bookmark',
    url: 'https://github.com/countercept/doublepulsar-detection-script',
    title: 'GitHub - countercept/doublepulsar-detection-script: A python2 script for sweeping a network to find windows systems compromised with the DOUBLEPULSAR implant.',
    add_date: '1494367881',
    tags: [ 'Menu', 'Bookmarks bar', 'repo' ] } ];
    assert.equal(res[0].url,blist[0].url,'wrong bookmark retrieved during list creation')
    assert.equal(res[1].url,blist[1].url,'wrong bookmark retrieved during list creation')
    assert.equal(res[2].url,blist[2].url,'wrong bookmark retrieved during list creation')
    done();
	});
  it("test parse chrome bookmars", done => {
    var arch= new MokArchive();
    var fetch= new MokFetcher();
		var bd = new bdownloader.BookmarkDownloader(arch,[fetch])
    bd.download_bookmarks(sample_bmarks)
    .then(()=>{
      assert.lengthOf(arch._stored,3,'some bookmarks not stored');
      done();
		})
		.then(null,err=>done(err));
	});
});

