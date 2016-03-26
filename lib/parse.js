/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var fs = require('fs')
var dir = require('node-dir')
var nunjucks = require('nunjucks')

module.exports = function (state, callback, error) {
    var parse = state.data.parse

    // First parse the data for any template tags
    state.data = JSON.parse(nunjucks.renderString(JSON.stringify(state.data), state.data))

    // If parse is not supplied then loop through all the files
    if(typeof parse == 'undefined') {
        dir.readFiles(state.template.tmp,
            function(err, content, fileToParse, next) {
                if(err) {
                    error(err)
                    process.exit(1)
                }
                var renderedContent = nunjucks.renderString(content, state.data)
                fs.writeFileSync(fileToParse, renderedContent)
                next()
            },
            function(err, files){
                if(err) {
                    error(err)
                    process.exit(1)
                }
                callback(state)
            }
        )

        // Go no further
        return
    }

    // Loop through files specified for parsing
    for(i = 0; i < parse.length; i++) {
        var fileToParse = state.template.tmp + '/' + parse[i]
        var content = fs.readFileSync(fileToParse, 'utf-8')
        var renderedContent = nunjucks.renderString(content, state.data)
        fs.writeFileSync(fileToParse, renderedContent)
    }

    callback(state)
}
