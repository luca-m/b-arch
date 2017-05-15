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
var bookmark=require('../lib/bookmark');


describe("Test Parse Bookmark", (o)=>{
  beforeEach(() => {   });
  after(()=>{  });
  it("test parse chrome bookmarks", done => {
		var bfp = new bookmark.BookmarkFileParser('./test/bm1.html');
		bfp.get_bookmarks()
		.then(res=>{
			inspect(res)	
    	assert.isNotNull(res,'bookmark parsing failed')
			done()
		})
		.then(null,err=>done(err));
	});
});

