/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)
   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var async = require('async');

module.exports = function (state, callback) {
    var link = state.data.link;

    if (link === undefined) {
        callback(null, state);
        return;
    }

    async.parallel(
        link.map(
            function (item) {
                return function (done) {
                    done(null);
                };
            }
        ),
        function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, state);
        }
    );
};
