/*jslint stupid:true */
/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var mv = require('mv');
var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
var mv = require('mv');

module.exports = function (state, callback) {
    var move = state.data.move;

    async.series([
        // Move around all the items specified in the schema
        function (next) {
            if (move === undefined || move.length === 0) {
                next(null);
                return;
            }

            async.parallel(move.map(function (item) {
                var orig = state.template.tmp + '/' + Object.keys(item)[0],
                    dest = state.template.tmp + '/' + item[Object.keys(item)[0]],
                    destPathOnly;

                if (fs.existsSync(orig)) {
                    destPathOnly = dest.substring(0, dest.lastIndexOf('/'));
                } else {
                    destPathOnly = dest;
                }

                return function (done) {
                    mkdirp(destPathOnly, function (err) {
                        if (err) {
                            done(err);
                            return;
                        }
                        mv(orig, dest, done);
                    });
                };
            }), function (err) {
                if (err) {
                    next(err);
                    return;
                }
                next(null);
            });
        },
        // Move all the files to the relative path "{{ name }}"
        function (next) {
            mv(state.template.tmp, state.data.name, function (err) {
                if (err) {
                    next(err);
                    return;
                }
                next(null);
            });
        }
    ], function (err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, state);
    });
};

