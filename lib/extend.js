/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var fs = require('fs')
var pathExists = require('path-exists')
var extend = require('extend')
var Hjson = require('hjson');

module.exports = function (state, callback, error) {

    var templateData
    if(pathExists.sync(state.template.tmp + '/template.json')) {
        templateData = Hjson.parse(fs.readFileSync(state.template.tmp + '/template.json', 'utf8'))
    } else {
        templateData = {}
    }

    if(typeof state.project !== 'undefined') {
        if(state.project.source == 'json') {
            projectData = Hjson.parse(state.project.input)
        } else {
            projectData = Hjson.parse(fs.readFileSync(state.project.tmp, 'utf8'))
        }
        state.data = extend(true, templateData, projectData)
    } else {
        state.data = templateData
    }

    if(typeof state.data.name == 'undefined') {
        state.data.name = 'undefined'
    }

    // Allow 'options' to override
    if(typeof state.options !== 'undefined') {
        state.data = extend(true, state.data, state.options)
    }

    callback(state)
}
