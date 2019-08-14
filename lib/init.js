/*jslint node: true, stupid: true */
/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

const isDirectory = require('is-directory').sync;
const isGitHub = function (input) { return input.match(/^(?!\.)[A-Za-z0-9\-_]+\/[A-Za-z0-9\-_]+$/g); };
const isFile = require('fs').existsSync;
const isURL = require('valid-url').isUri;
const isJSON = function (input) { try { JSON.parse(input); return true; } catch (e) { return false; } };

const getTemplateSource = function (input) {
    const inputNoRef = input.split('#')[0];
    if (isDirectory(input)) {
        return 'directory';
    }
    if (isGitHub(inputNoRef)) {
        return 'github';
    }
    return 'git';
};

const getProjectSource = function (input) {
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

    // Setup the project object if the input is present
    if (state.inputs[1] !== undefined) {
        state.project = {};
        state.project.input = state.inputs[1];

        state.project.source = getProjectSource(state.project.input);

        if (!state.project.source) {
            callback({ 'message': 'Unable to match "' + state.project.input + '" with an action.' });
        }
    }

    callback(null, state);
};
