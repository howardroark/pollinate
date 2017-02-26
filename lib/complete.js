/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var exec = require('child_process').exec;
var async = require('async');
var mv = require('mv');

module.exports = function (state, callback) {
    var complete = state.data.complete;

    async.series([
        // Move all the files to the relative path "{{ name }}"
        function (next) {
            mv(state.template.tmp, state.data.name, function (err) {
                if (err) {
                    next(err);
                    return;
                }
                next(null);
            });
        },
        // Call the shell command specified as `complete`
        function (next) {
            if (complete !== undefined) {
                exec(complete, function (err) {
                    if (err) {
                        next(err);
                        return;
                    }
                    next(null);
                });
            } else {
                next(null);
            }
        }
    ], function (err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, state);
    });

};

