/*
 * bookmark.js
 * Copyright (C) 2017 luca.mella@studio.unibo.it
 *
 * Distributed under terms of the MIT license.
 */
"use strict";
var fs=require('fs');

class BookmarkParser {
  constructor(bookmark_location) {
    this._b_location=bookmark_location;
  }
  get_bookmarks(){
  }
}

module.exports.BookmarkFileParser=class BookmarkFileParser extends BookmarkParser {
  constructor(bookmark_location) {
    super(bookmark_location);
    // Supports
    // Pocket(http://getpocket.com)
    // Netscape Bookmarks(Firefox, Google Chrome, ...)
    this._parser = require("bookmarks-parser");
  }
  get_bookmarks(){
    return new Promise((resolve,reject)=>{
      fs.readFile(this._b_location, "utf-8", (err, html) => {
        if (err){ return reject(err); }
        this._parser(html, function(err, res) {
          if (err){ return reject(err); }
          //TODO: define some custom bookmark structure ?
					return resolve(res);
        });
      });
    });
  }

}
