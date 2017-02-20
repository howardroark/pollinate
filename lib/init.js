/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var isDirectory = require('is-directory').sync;
var isGitHub = function (input) { return input.match(/^(?!\.)[A-Za-z0-9\-_]+\/[A-Za-z0-9\-_]+$/g); };
var isFile = require('file-exists');
var isURL = require('valid-url').isUri;
var isJSON = function (input) { try { JSON.parse(input); return true; } catch (e) { return false; } };

var getTemplateSource = function (input) {
    var inputNoRef = input.split('#')[0];
    if (isDirectory(input)) {
        return 'directory';
    }
    if (isGitHub(inputNoRef)) {
        return 'github';
    }
    return 'git';
};

var getProjectSource = function (input) {
    if (isFile(input)) {
        return 'file';
    }
    if (isURL(input)) {
        return 'url';
    }
    if (isJSON(input)) {
        return 'json';
    }
    return false;
};

module.exports = function (state, callback) {

    // Always expect to have a template object
    state.template = {};
    state.template.input = state.inputs[0];

    state.template.source = getTemplateSource(state.template.input);

    if (!state.template.source) {
        callback({ 'message': 'Unable to match "' + state.template.input + '" with an action.' });
    }


    if (state.inputs.length > 1) {

        // If second option can't be matched with a project source then set it as `target` and check the next index
        var projectIndex = 1;
        if (!getProjectSource(state.inputs[projectIndex])) {
            state.target = state.inputs[projectIndex];
            projectIndex = 2;
        }

        // Setup the project object if the input is present
        if (state.inputs[projectIndex] !== undefined) {
            state.project = {};
            state.project.input = state.inputs[projectIndex];

            state.project.source = getProjectSource(state.project.input);

            if (!state.project.source) {
                callback({ 'message': 'Unable to match "' + state.project.input + '" with an action.' });
            }
        }
    }

    callback(null, state);
};
