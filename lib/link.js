/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)
   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var async = require('async');
var symlink = require('symlink-or-copy');

module.exports = function (state, callback) {
    var link = state.data.link;

    if (!link) {
        callback(null, state);
        return;
    }

    async.parallel(
        link.map(function (item) {
            var orig = Object.keys(item)[0],
                dest = item[Object.keys(item)[0]];

            return function (done) {
                symlink(orig, dest, function (err) {
                    if (err) {
                        done(err);
                        return;
                    }
                    done();
                });
            };
        }),
        function (error) {
            if (error) {
                callback(error);
                return;
            }
            callback(null, state);
        }
    );
};
