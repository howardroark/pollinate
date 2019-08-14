#!/usr/bin/env node

/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

const program = require('commander');
const parse = require('cli-argparse');
const pollinate = require('./lib/index.js');

const parsed = parse(process.argv, { camelcase: false });

program
    .version(require('./package.json').version)
    .usage('template [data]');

program.on('--help', function () {
    console.log('  Examples:');
    console.log();
    console.log('    $ pollinate username/template data.json');
    process.exit();
});

program.parse(process.argv);

if (program.args.length < 1) {
    console.log('Invalid args. type `pollinate --help` for options.');
    process.exit(1);
}

pollinate({
    flags: parsed.flags,
    inputs: program.args,
    options: parsed.options,
}, function (err, result) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(JSON.stringify(result, null, 4));
});
