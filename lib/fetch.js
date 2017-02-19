/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var fs = require('fs');
var fsExtra = require('fs-extra');
var path = require('path');
var ospath = require('ospath');
var request = require('request');
var uuid = require('uuid');
var gunzip = require('gunzip-maybe');
var tar = require('tar-fs');
var isDirectory = require('is-directory').sync;

var fetchGitHub = function (state, callback) {
    var tmpPath = ospath.tmp() + '/' + uuid.v1(),
        inputUrl = state.template.input.split('#')[0],
        inputRef = state.template.input.split('#')[1];

    // setup the tmp path
    fs.mkdir(tmpPath, function () {
        // get the default branch
        var query = (process.env.token) ? { access_token: process.env.token } : {};

        request({
            url: 'https://api.github.com/repos/' + inputUrl,
            qs: query,
            headers: {
                'User-Agent': 'request'
            }
        }, function (err, response) {
            var repoDetails, gitRef;

            if (err) {
                callback(err);
                return;
            }

            repoDetails = JSON.parse(response.body);
            gitRef = inputRef || repoDetails.default_branch;

            request
                .get('https://github.com/' + inputUrl + '/archive/' + gitRef + '.tar.gz')
                .pipe(gunzip())
                .pipe(tar.extract(tmpPath))
                .on('finish', function () {
                    state.template.tmp = tmpPath + '/' + repoDetails.name + '-' + gitRef;
                    callback(null, state);
                });
        });
    });
};

var fetchDirectory = function (state, callback) {
    var input = state.template.input,
        tmpPath = ospath.tmp() + '/' + uuid.v1();

    state.template.tmp = tmpPath;

    // setup the tmp path
    fsExtra.mkdirs(tmpPath, function (err) {
        if (err) {
            callback(err);
            return;
        }
        fsExtra.copy(input, tmpPath, function (err) {
            if (err) {
                callback(err);
                return;
            }
            if (isDirectory(tmpPath + '/.git')) {
                fsExtra.remove(tmpPath + '/.git', function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(null, state);
                });
            } else {
                callback(null, state);
            }
        });
    });
};

var fetchGit = function (state, callback) {
    var exec = require('child_process').exec,
        tmpPath = ospath.tmp() + '/' + uuid.v1(),
        input = state.template.input,
        command = 'git clone ' + input + ' ' + tmpPath;

    state.template.tmp = tmpPath;

    exec(command, function (err) {
        if (err) {
            callback(err);
            return;
        }
        if (isDirectory(tmpPath + '/.git')) {
            fsExtra.remove(tmpPath + '/.git', function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, state);
            });
        } else {
            callback(null, state);
        }
    });
};

var fetchURL = function (state, callback) {
    var tmpPath = ospath.tmp() + '/' + uuid.v1(),
        input = state.project.input,
        response = request(input);

    state.project.tmp = tmpPath;

    // setup the tmp path
    fs.mkdir(tmpPath, function (err) {
        if (err) {
            callback(err);
            return;
        }

        state.project.tmp = tmpPath + '/data.json';

        response
            .pipe(fs.createWriteStream(tmpPath + '/data.json'))
            .on('finish', function () {
                callback(null, state);
            });
    });
};

var fetchJSON = function (state, callback) {
    callback(null, state);
};

var fetchFile = function (state, callback) {
    var tmpPath = ospath.tmp() + '/' + uuid.v1(),
        input = state.project.input;

    // setup the tmp path
    fs.mkdir(tmpPath, function (err) {
        if (err) {
            callback(err);
            return;
        }

        state.project.tmp = tmpPath + '/data.json';

        fs.createReadStream(input)
            .pipe(fs.createWriteStream(tmpPath + '/data.json'))
            .on('finish', function () {
                callback(null, state);
            });
    });
};

var fetchTemplate = function (state, callback) {
    switch (state.template.source) {
    case 'github':
        fetchGitHub(state, callback);
        break;
    case 'directory':
        fetchDirectory(state, callback);
        break;
    case 'git':
        fetchGit(state, callback);
        break;
    }
};

var fetchProject = function (state, callback) {
    switch (state.project.source) {
    case 'url':
        fetchURL(state, callback);
        break;
    case 'json':
        fetchJSON(state, callback);
        break;
    case 'file':
        fetchFile(state, callback);
        break;
    }
};

module.exports = function (state, callback) {
    fetchTemplate(state, function (err, state) {
        if (err) {
            callback(err);
            return;
        }
        if (state.project !== undefined) {
            fetchProject(state, function (err, state) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, state);
            });
        } else {
            callback(null, state);
        }
    });
};

