/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var fs = require('fs')
var path = require('path')
var fileExists = require('file-exists')
var dir = require('node-dir')
var nunjucks = require('nunjucks')
var globby = require('globby')

module.exports = function (state, callback, error) {

    var env = nunjucks.configure(state.template.tmp, { autoescape: false })

    var filters = state.data.filters

    if(typeof filters != 'undefined') {
        for(var i = 0; i < Object.keys(filters).length; i++) {
            var filterName = Object.keys(filters)[i]
            var filter = path.join(state.template.tmp, filters[filterName])
            env.addFilter(filterName, require(filter))
        }
    }

    var parse = state.data.parse

    // First parse the data for any template tags
    state.data = JSON.parse(nunjucks.renderString(JSON.stringify(state.data), state.data))

    if(typeof parse != 'undefined') {
        var paths = [];

        // Extend each item in parse array to tmp location
        for(i = 0; i < parse.length; i++) {
            // Set path according to presence of wildcard
            if(parse[i].indexOf('!') != 0) {
                parse[i] = state.template.tmp + '/' + parse[i]
            } else {
                parse[i] = '!' + state.template.tmp + '/' + parse[i].substring(1)
            }
        }

        paths = globby.sync(parse)

        // Loop through all paths and parse each one which is a file
        for(i = 0; i < paths.length; i++) {
            if (fileExists(paths[i])) {
                fs.writeFileSync(paths[i], nunjucks.render(paths[i], state.data))
            }
        }
    }

    callback(state)
}
