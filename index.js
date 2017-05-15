/*
 * index.js
 * Copyright (C) 2017 luca.mella@studio.unibo.it
 *
 * Distributed under terms of the ISC license.
 */
"use strict";
const commandLineArgs = require('command-line-args');

const archive=require('./lib/archive');
const fetcher=require('./lib/fetcher');
const bookmark=require('./lib/bookmark');
const bdownloader=require('./lib/bdownloader');


const optionDefinitions = [
//  { name: 'verbose',  alias: 'v', type: Boolean },
  { name: 'basefolder',   alias:'f', type: String },
  { name: 'bookmarkfile',   alias:'b', type: String },
]
try{

  const options = commandLineArgs(optionDefinitions)
  var fetchers=[
    new fetcher.RepoFetcher(), 
    new fetcher.PDFFetcher(), 
    new fetcher.HTMLPageFetcher()
  ];
  var arch = new archive.BookmarkFileArchive(options.basefolder,{copy:true})
  var bmark_parser = new bookmark.BookmarkFileParser(options.bookmarkfile) 
  var downloader= new bdownloader.BookmarkDownloader(arch,fetchers);
  bmark_parser.get_bookmarks()
  .then(bmarks=>{
      return downloader.download_bookmarks(bmarks)
      .then(ok=>{
        console.log('[+] bookmark downloaded, success='+ok.success+' failed='+ok.failed)
  		})
      .catch(e=>{console.error('[!] cannot download bookmarks',e)})
  })
  .catch(e=>{console.error('[!] cannot parse bookmark file',e)})


} catch (e){
  console.error('[!] wrong parameters',e);
  process.exit(-1);
}
