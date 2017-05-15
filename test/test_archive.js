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
var tmp = require('tmp');
var expect = chai.expect;
var assert = chai.assert;


var inspect=(x)=>{console.log(util.inspect(x,true,null,true))}
var archive=require('../lib/archive');

var sample_b_1={ 
  type: 'bookmark',
  url: 'http://www.blackhillsinfosec.com/?p=5578',
  title: 'Sample1',
  add_date: '1472922024' 
};
var sample_f_1='./test/test.pdf';

var basepath_obj = {};
var basepath='/tmp/test_archiver_'+parseInt(Math.random()*10000); 

describe("Test Save Archive", (o)=>{
  before(() => {   
    //basepath_obj=tmp.dirSync();
    //basepath=basepath_obj.name;
   });
  after(()=>{  
    //basepath_obj.removeCallback();
  });
  it("test initialize file archive", done => {
		var a = new archive.BookmarkFileArchive(basepath);
    a.init(basepath)
    .then(ok=>{
      assert.isTrue(fs.existsSync(basepath),'initialization error')
      try{fs.rmdirSync(basepath)}catch(e){console.log('please ignore me:',e)}
      done()
    })
    .then(null,err=>done(err))
  })
  it("test save bookmark to file archive", done => {
		var a = new archive.BookmarkFileArchive(basepath,{copy:true});
		a.store(sample_b_1,sample_f_1,['myfolder1'])
		.then(res=>{
			inspect(res)	
    	assert.isTrue(fs.existsSync(a._today_basefolder+'/myfolder1'),'specified folder not created, check '+basepath);
    	assert.isTrue(fs.existsSync(a._today_basefolder+'/myfolder1/'+'Sample1_AT_httpwww.blackhillsinfosec.comp=5578.pdf'),'bookmark not stored, check '+basepath);
			done()
		})
		.then(null,err=>done(err));
	});
});

