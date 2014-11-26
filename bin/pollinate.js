#!/usr/bin/env node

/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var program = require('commander')
var chalk = require('chalk')

program
  .version(require('../package.json').version)
  .usage('flower [pollen]')

program.on('--help', function() {
  console.log('  Examples:')
  console.log()
  console.log(chalk.magenta('    Grab from GitHub & HTTP:'))
  console.log('    $ pollinate stackstrap/meanstack https://example.com/1bdDlXc')
  console.log()
  console.log(chalk.magenta('    Grab local files:'))
  console.log('    $ pollinate ./meanstack ./example.json')
  console.log()
  console.log(chalk.magenta('    Self-pollinate:'))
  console.log('    $ pollinate ./meanstack')
  process.exit()
})

program.parse(process.argv)

var log = require('normalize-log')

if(program.args.length != 2) {
  log.error('Invalid args. type `pollinate --help` for options.')
  process.exit(1)
}

var state = {}

state.flower = require('../lib/download.js')( program.args[0], 'flower' )
state.pollen = require('../lib/download.js')( program.args[1], 'pollen' )

console.log(state)
