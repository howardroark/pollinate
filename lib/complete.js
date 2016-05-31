/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var exec = require('child_process').exec
var mkdirp = require('mkdirp').sync
var mv = require('mv')

module.exports = function (state, callback, error) {
    var complete = state.data.complete
    var target = state.data.name

    if(typeof state.target != 'undefined') {
        target = state.target
        mkdirp(target)
    }

    // Move the tmp dir and run a command if set
    mv(state.template.tmp, target, function(err){
        if(err) {
            error(err)
        }

        if(typeof complete !== 'undefined') {
            exec(complete, function(error, stdout, stderr) {
                callback(state)
            })
        } else {
            callback(state)
        }

    })
}
