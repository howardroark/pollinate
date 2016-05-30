/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var isGitUrl = require('is-git-url')
var validUrl = require('valid-url')

var isGitHub = function(input){return input.match(/^(?!\.)[A-Za-z0-9\-_]+\/[A-Za-z0-9\-_]+$/g)}
var isFolder = function(input){return input.match(/^(\.|\.\.)(\/.+)+\/?$/g)}
var isGit = function(input){return isGitUrl(input) || validUrl.isUri(input)}
var isURL = function(input){return validUrl.isUri(input)}
var isJSON = function(input){return input.match(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/g)}
var isFile = function(input){return input.match(/[^\\]*\.(\w+)$/g)}

module.exports = function (state, callback, error) {
    
    // Always expect to have a template object
    state.template = {}
    state.template.input = state.inputs[0]

    // Set the type of template source 
    if(isGitHub(state.template.input)) {

        state.template.source = 'github'

    } else if(isFolder(state.template.input)) {

        state.template.source = 'folder'

    } else if(isGit(state.template.input)) {

        state.template.source = 'git'

    } else {
        error({ 'message':'Unable to match "'+input+'" with an action.' })
    }

    // Set project object if second input source is present 
    if(typeof state.inputs[1] != 'undefined') {
        state.project = {}
        state.project.input = state.inputs[1]


        // Set the type of template source 
        if(isURL(state.project.input)) {

            state.project.source = 'url'

        } else if(isJSON(state.project.input)) {

            state.project.source = 'json'

        } else if(isFile(state.project.input)) {

            state.project.source = 'file'

        } else {
            error({ 'message':'Unable to match "'+input+'" with an action.' })
        }
    }

    callback(state)
}
