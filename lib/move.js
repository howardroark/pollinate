/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var mv = require('mv')
var series = require('async-series')
var fileExists = require('file-exists')
var mkdirp = require('mkdirp')

module.exports = function (state, callback, error) {
    var move = state.data.move

    if(typeof move !== 'undefined' && move.length) {
        var moveSeries = []
        for(i = 0; i < move.length; i++) {
            var orig = state.template.tmp + '/' + Object.keys(move[i])[0]
            var dest = state.template.tmp + '/' + move[i][Object.keys(move[i])[0]]

            //check if orig is a file, and not a directory
            var destPathOnly;
            if(fileExists(orig)) {
                destPathOnly = dest.match(/(.*\/)/)[0]
            } else {
                destPathOnly = dest
            }

            moveSeries.push((function(orig, dest, destPathOnly) { return function(done) {

                mkdirp.sync(destPathOnly)

                mv(orig, dest, function(err){
                    if(err) {
                        error(err)
                        process.exit(1)
                    }
                    done()
                })

            }})(orig, dest, destPathOnly))
        }
        moveSeries.push(function(done) {
            mv(state.template.tmp, state.data.name, function(err){
                if(err) {
                    error(err)
                    process.exit(1)
                }
                callback(state)
            })
        })
        series(moveSeries)
    } else {
        mv(state.template.tmp, state.data.name, function(err){
            if(err) {
                error(err)
                process.exit(1)
            }
            callback(state)
        })
    }
}
