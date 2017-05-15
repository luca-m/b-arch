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
var fetcher=require('../lib/fetcher');


describe("Test Fetch can handle", (o)=>{
  beforeEach(() => {   });
  after(()=>{  });
  it("test HTML page can handle", done => {
		var f = new fetcher.HTMLPageFetcher();
    var res=f.can_handle({
  		type: 'bookmark',
  		url: 'https://exploitbox.io/paper/Pwning-PHP-Mail-Function-For-Fun-And-RCE.html',
  		title: 'Sample1',
  		add_date: '1472922024' 
    })
    assert.isTrue(res,'should handle html page')
    done()
	});
  it("test PDF can handle", done => {
		var f = new fetcher.PDFFetcher();
    var res=f.can_handle({
  		type: 'bookmark',
  		url: 'http://2015.zeronights.org/assets/files/02-Geshev.pdf',
  		title: 'Sample1',
  		add_date: '1472922024' 
    })
    assert.isTrue(res,'should handle html page')
    done()
	});
  it("test Repo can handle README.md", done => {
		var f = new fetcher.RepoFetcher();
    var res=f.can_handle({
  		type: 'bookmark',
  		url: 'https://github.com/iagox86/dnscat2/blob/master/README.md',
  		title: 'Sample1',
  		add_date: '1472922024' 
    })
    assert.isTrue(res,'repo should be handled')
    done()
	});
  it("test Repo can handle git 1", done => {
		var f = new fetcher.RepoFetcher();
    var res=f.can_handle({
  		type: 'bookmark',
  		url: 'https://github.com/iagox86/dnscat2',
  		title: 'Sample1',
  		add_date: '1472922024' 
    })
    assert.isTrue(res,'repo should be handled')
    done()
	});
  it("test Repo can handle git 2", done => {
		var f = new fetcher.RepoFetcher();
    var res=f.can_handle({
  		type: 'bookmark',
  		url: 'https://github.com/iagox86/dnscat2.git',
  		title: 'Sample1',
  		add_date: '1472922024' 
    })
    assert.isTrue(res,'repo should be handled')
    done()
	});
  it("test Repo can handle git 3", done => {
		var f = new fetcher.RepoFetcher();
    var res=f.can_handle({
  		type: 'bookmark',
  		url: 'https://github.com/countercept/doublepulsar-detection-script',
  		title: 'Sample1',
  		add_date: '1472922024' 
    })
    assert.isTrue(res,'repo should be handled')
    done()
	});
  it("test Repo can handle bitbucket 1", done => {
		var f = new fetcher.RepoFetcher();
    var res=f.can_handle({
  		type: 'bookmark',
  		url: 'https://bitbucket.org/cesena/cesena_presentations',
  		title: 'Sample1',
  		add_date: '1472922024' 
    })
    assert.isTrue(res,'repo should be handled')
    done()
	});
  it("test Repo can handle bitbucket 2", done => {
		var f = new fetcher.RepoFetcher();
    var res=f.can_handle({
  		type: 'bookmark',
  		url: 'https://bitbucket.org/cesena/cesena_presentations/src/a39dbc3f26000677ae9d4ced71a2417b0c1df891?at=master',
  		title: 'Sample1',
  		add_date: '1472922024' 
    })
    assert.isTrue(res,'repo should be handled')
    done()
	});
  it("test Repo cannot handle 1", done => {
		var f = new fetcher.RepoFetcher();
    var res=f.can_handle({
  		type: 'bookmark',
  		url: 'https://github.com/iagox86/dnscat2/blob/master/doc/protocol.md',
  		title: 'Sample1',
  		add_date: '1472922024' 
    })
    assert.isNotTrue(res,'should not be handled')
    done()
	});
  it("test Repo cannot handle 2", done => {
		var f = new fetcher.RepoFetcher();
    var res=f.can_handle({
  		type: 'bookmark',
  		url: 'https://exploitbox.io/paper/Pwning-PHP-Mail-Function-For-Fun-And-RCE.html',
  		title: 'Sample1',
  		add_date: '1472922024' 
    })
    assert.isNotTrue(res,'should not be handled')
    done()
	});
});

describe("Test Fetch download", (o)=>{
  beforeEach(() => {   });
  after(()=>{  });

  it("test fetch PDF", done => {
    var opath='/tmp/test_fetcher_'+parseInt(Math.random()*10000); 
		var f = new fetcher.PDFFetcher();
    var res=f.fetch({
  		type: 'bookmark',
  		url: 'https://www.contextis.com/documents/120/Glibc_Adventures-The_Forgotten_Chunks.pdf',
  		title: 'Sample1',
  		add_date: '1472922024' 
    }, opath).then(ok=>{
      assert.isTrue(fs.existsSync(opath),'should download pdf document')
      try{fs.unlinkSync(opath)}catch(e){console.log('please ignore me:',e)}
      done()
    }, err=>done(err))
	}).timeout(6000);
  
it("test fetch html to PDF", done => {
    var opath='/tmp/test_fetcher_'+parseInt(Math.random()*10000); 
		var f = new fetcher.HTMLPageFetcher();
    var res=f.fetch({
  		type: 'bookmark',
  		url: 'https://exploitbox.io/paper/Pwning-PHP-Mail-Function-For-Fun-And-RCE.html',
  		title: 'Sample1',
  		add_date: '1472922024' 
    }, opath).then(ok=>{
      assert.isTrue(fs.existsSync(opath),'should download html page')
      try{fs.unlinkSync(opath)}catch(e){console.log('please ignore me:',e)}
      done()
    }, err=>done(err))
	}).timeout(6000);

  it("test fetch Repo Git", done => {
    var opath='/tmp/test_fetcher_'+parseInt(Math.random()*10000); 
		var f = new fetcher.RepoFetcher();
    var res=f.fetch({
  		type: 'bookmark',
  		url: 'https://github.com/iagox86/dnscat2.git',
  		title: 'Sample1',
  		add_date: '1472922024' 
    }, opath).then(ok=>{
      assert.isTrue(fs.existsSync(opath),'should download github repo')
      try{fs.unlinkSync(opath)}catch(e){console.log('please ignore me:',e)}
      done()
    }, err=>done(err))
	}).timeout(6000);
});
