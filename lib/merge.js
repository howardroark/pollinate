/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var async = require('async');
var lodashMerge = require('lodash.merge');
var fs = require('fs');

module.exports = function merge(state, callback) {
    var mergeFiles = state.data.merge;

    if (mergeFiles === undefined || mergeFiles.length === 0) {
        callback(null, state);
        return;
    }

    async.each(mergeFiles, function (files, callback) {
        async.waterfall([
            function (next) {
                async.map(files, function (file, callback) {
                    fs.readFile(state.template.tmp + '/' + file, 'utf8', callback);
                }, next);
            },
            function (data, next) {
                var merged;
                try {
                    merged = lodashMerge.apply(null, data.map(JSON.parse));
                } catch (error) {
                    next(error);
                    return;
                }
                fs.writeFile(state.template.tmp + '/' + files[0], JSON.stringify(merged, null, 2), 'utf8', next);
            },
        ], callback);
    }, function (err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, state);
    });
};

