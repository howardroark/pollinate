var program = require('commander')
program.parse(process.argv)

var state = {};

state.flower = require('./download.js')( program.args[0], 'flower' );
state.pollen = require('./download.js')( program.args[1], 'pollen' );

console.log(state);
