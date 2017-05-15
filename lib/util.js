/*
 * util.js
 * Copyright (C) 2017 luca.mella@studio.unibo.it
 *
 * Distributed under terms of the MIT license.
 */
"use strict";
var childProcess = require('child_process');

module.exports.spawn_process = function(cmd, args, input, check_exit) {
  check_exit= typeof(checkExitCode)!=='function'? (c)=>c===0 : check_exit;
	return new Promise((resolve,reject)=>{
    var proc = childProcess.spawn(cmd, args);
    if (input) { proc.stdin.end(new Buffer(input));}
    var allstdo = new Buffer(0);
    var allstde = new Buffer(0);
    proc.stdout.on('data', (b)=>{ allstdo = Buffer.concat([allstdo, b]); });
    proc.stderr.on('data', (b)=>{ allstde = Buffer.concat([allstde, b]); });
    proc.on('close', (exit_code)=>{
      if (!check_exit(exit_code)) {
        let e = new Error('exit code not ok');
        e.data = {
          ecode: exit_code,
          stdout: allstdo.toString(),
          stderr: allstde.toString()
        };
        reject(e);
      } else {
        resolve({
          ecode: exit_code,
          stdout: allstdo.toString(),
          stderr: allstde.toString()
        });
      }
    });
    proc.on('error', (e)=>{
      e.data = {
        stdout: allstdo.toString(),
        stderr: allstde.toString()
      };
      reject(e);
    });
  });
}


