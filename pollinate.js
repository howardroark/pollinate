#!/usr/bin/env node

var program = require('commander');

program
    .version('0.0.1')
    .usage('<flower (git url or local path of files)> <pollen (remote endpoint or local path of data)>')
    .parse(process.argv);

if(!program.args.length) {
    program.help();
} else {
    console.log('Keywords: ' + program.args);
}
