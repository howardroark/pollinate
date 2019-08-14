/*jslint node: true, stupid: true */
/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const cpr = require('cpr');
const rimraf = require('rimraf');
const ospath = require('ospath');
const request = require('request');
const uuid = require('uuid');
const isDirectory = require('is-directory').sync;
const async = require('async');
const exec = require('child_process').exec;
const Hjson = require('hjson');

const gitClone = function (url, ref, tmpPath, callback) {
    async.series([
        function (next) {
            exec('git clone ' + url + ' ' + tmpPath, function (err) {
                if (err) {
                    next(err);
                    return;
                }
                next(null);
            });
        },
        function (next) {
            if (ref) {
                exec('git checkout ' + ref, {
                    cwd: tmpPath
                }, function (err) {
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
        callback();
    });
};

const fetchGitHub = function (state, callback) {
    const tmpPath = ospath.tmp() + '/' + uuid.v1(),
        inputUrl = state.template.input.split('#')[0],
        inputRef = state.template.input.split('#')[1],
        url = 'https://github.com/' + inputUrl + '.git';

    state.template.tmp = tmpPath;

    gitClone(url, inputRef, tmpPath, function (err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, state);
    });
};

const fetchDirectory = function (state, callback) {
    const input = state.template.input,
        tmpPath = ospath.tmp() + '/' + uuid.v1();

    state.template.tmp = tmpPath;

    // setup the tmp path
    mkdirp(tmpPath, function (err) {
        if (err) {
            callback(err);
            return;
        }
        cpr(input, tmpPath, function (err) {
            if (err) {
                callback(err);
                return;
            }
            if (isDirectory(tmpPath + '/.git')) {
                rimraf(tmpPath + '/.git', function (err) {
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

const fetchGit = function (state, callback) {
    const tmpPath = ospath.tmp() + '/' + uuid.v1(),
        inputUrl = state.template.input.split('#')[0],
        inputRef = state.template.input.split('#')[1];

    state.template.tmp = tmpPath;

    gitClone(inputUrl, inputRef, tmpPath, function (err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, state);
    });
};

const fetchURL = function (state, callback) {
    const tmpPath = ospath.tmp() + '/' + uuid.v1(),
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

const fetchJSON = function (state, callback) {
    callback(null, state);
};

const fetchFile = function (state, callback) {
    const tmpPath = ospath.tmp() + '/' + uuid.v1(),
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

const fetchTemplate = function (state, callback) {
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

const fetchProject = function (state, callback) {
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

        if (fs.existsSync(state.template.tmp + '/template.json')) {
            state.template.data = Hjson.parse(fs.readFileSync(state.template.tmp + '/template.json', 'utf8'));
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

