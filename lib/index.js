/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var async = require('async');

function runPollinate(input, callback) {
    async.waterfall([
        function (next) {
            require('./init.js')(input, next);
        },
        function (state, next) {
            require('./fetch.js')(state, next);
        },
        function (state, next) {
            require('./prompt.js')(state, next);
        },
        function (state, next) {
            require('./extend.js')(state, next);
        },
        function (state, next) {
            require('./parse.js')(state, next);
        },
        function (state, next) {
            require('./merge.js')(state, next);
        },
        function (state, next) {
            require('./discard.js')(state, next);
        },
        function (state, next) {
            require('./move.js')(state, next);
        },
        function (state, next) {
            require('./complete.js')(state, next);
        }
    ], function (err, state) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, state);
    });
}

module.exports = runPollinate;
