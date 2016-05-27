/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var rimraf = require('rimraf')

module.exports = function (state, callback, error) {
    var discard = state.data.discard

    if(typeof discard == 'undefined' || discard.length === 0) {
        callback(state)
        return
    }

    for(i = 0; i < discard.length; i++) {
        rimraf.sync(state.template.tmp + '/' + discard[i])
    }

    callback(state)
}
