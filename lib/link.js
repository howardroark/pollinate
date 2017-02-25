/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)
   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var async = require('async');
var symlink = require('fs-extra').ensureSymlink;

module.exports = function (state, callback) {
    var links = state.data.link;

    if (!links) {
        callback(null, state);
        return;
    }

    async.parallel(
        links.map(function (link) {
            return function (done) {
                symlink('', '', function (err) {
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
