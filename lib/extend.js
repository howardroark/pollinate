/*jslint node: true, stupid: true */
/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var fs = require('fs');
var extend = require('extend');
var ospath = require('ospath');
var async = require('async');
var Hjson = require('hjson');

module.exports = function (state, callback) {
    var userData = {},
        projectData = {},
        optionData = {};

    async.series([
        function (next) {
            // If `~/.pollen` exists then extend with it first
            if (fs.existsSync(ospath.home() + '/.pollen')) {
                fs.readFile(ospath.home() + '/.pollen', 'utf8', function (err, data) {
                    if (err) {
                        next(err);
                        return;
                    }
                    userData = Hjson.parse(data);
                    next(null);
                });
            } else {
                next(null);
            }
        },
        function (next) {
            if (state.project !== undefined) {
                if (state.project.source === 'json') {
                    projectData = Hjson.parse(state.project.input);
                    state.project.data = projectData;
                    next(null);
                } else {
                    fs.readFile(state.project.tmp, 'utf8', function (err, data) {
                        if (err) {
                            next(err);
                            return;
                        }
                        projectData = Hjson.parse(data);
                        state.project.data = projectData;
                        next(null);
                    });
                }
            } else {
                next(null);
            }
        }
    ], function (err) {
        if (err) {
            callback(err);
            return;
        }

        // Allow 'options' to override
        if (state.options !== undefined) {
            optionData = state.options;
        }

        state.data = extend(true, state.data, state.template.data, userData, projectData, state.prompt, optionData);

        if (state.data.name === undefined) {
            if (state.template.source === 'github') {
                state.data.name = state.template.input.split('/')[1];
            } else {
                callback({ msg: "Please ensure a `name` property is supplied as part of the data." });
                return;
            }
        }

        callback(null, state);
    });
};

