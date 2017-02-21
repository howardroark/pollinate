/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var rimraf = require('rimraf');
var async = require('async');
var isDirectory = require('is-directory');

module.exports = function (state, callback) {
    var discard = state.data.discard;
    var tmpPath = state.template.tmp;

    // Remove the .git directory unless told otherwise
    if (isDirectory.sync(tmpPath + '/.git') && !state.keepHistory && !(state.flags && state.flags['keep-history'])) {
       rimraf.sync(tmpPath + '/.git');
    }

    if (discard === undefined || discard.length === 0) {
        callback(null, state);
        return;
    }

    async.parallel(discard.map(function (path) {
        return function (next) {
            rimraf(tmpPath + '/' + path, next);
        };
    }), function (err) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, state);
    });

};
