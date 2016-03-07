/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var fs = require('fs')
var nunjucks = require('nunjucks')

module.exports = function (state, callback, error) {
    var parse = state.data.parse

    // First parse the data for any template tags
    state.data = JSON.parse(nunjucks.renderString(JSON.stringify(state.data), state.data))

    // Now parse the files
    for(i = 0; i < parse.length; i++) {
        var fileToParse = state.template.tmp + '/' + parse[i]
        var content = fs.readFileSync(fileToParse, 'utf-8')
        var renderedContent = nunjucks.renderString(content, state.data)
        fs.writeFileSync(fileToParse, renderedContent)
    }

    callback(state)
}
