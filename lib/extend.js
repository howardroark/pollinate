/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var fs = require('fs');
var path = require('path');
var fileExists = require('file-exists');
var extend = require('extend');
var Hjson = require('hjson');
var ospath = require('ospath');
var inquirer = require('inquirer-compatibility-fork');
var async = require('async');

module.exports = function (state, callback) {
    var templateData = {},
        userData = {},
        projectData = {},
        answersData = {},
        optionData = {};

    async.series([
        function (next) {
            if (fileExists(state.template.tmp + '/template.json')) {
                fs.readFile(state.template.tmp + '/template.json', 'utf8', function (err, data) {
                    if (err) {
                        next(err);
                        return;
                    }
                    templateData = Hjson.parse(data);
                    state.template.data = templateData;
                    next(null);
                });
            } else {
                next(null);
            }
        },
        function (next) {
            // If `~/.pollen` exists then extend with it first
            if (fileExists(ospath.home() + '/.pollen')) {
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
        },
        function (next) {
            // Add in inquirer questions if required
            if (templateData.questions) {
                inquirer.prompt(require(path.join(state.template.tmp, templateData.questions))).then(function (answers) {
                    answersData = answers;
                    next(null);
                });
            } else {
                next(null);
            }
        },
    ], function (err) {
        if (err) {
            callback(err);
            return;
        }

        // Allow 'options' to override
        if (state.options !== undefined) {
            optionData = state.options;
        }

        state.data = extend(true, state.data, templateData, userData, projectData, optionData, answersData);

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

