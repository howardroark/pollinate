/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var fs = require('fs')
var fsExtra = require('fs-extra')
var path = require('path')
var pathExtra = require('path-extra');
var request = require('request')
var validUrl = require('valid-url');
var uuid = require('uuid')
var gunzip = require('gunzip-maybe')
var tar = require('tar-fs')
var isGitUrl = require('is-git-url')
var isThere = require('is-there')


module.exports = function (state, callback, error) {
    fetchTemplate(state, state.inputs[0], function(state) {
        if(typeof state.inputs[1] !== 'undefined') {
            fetchProject(state, state.inputs[1], function(state) {
                callback(state)
            }, error)
        } else {
            callback(state)
        }
    }, error)
}

var fetchTemplate = function(state, input, callback, error) {
    var isGitHub = input.match(/^(?!\.)[A-Za-z0-9\-_]+\/[A-Za-z0-9\-_]+$/g)
    var isFolder = input.match(/^(\.|\.\.)(\/.+)+\/?$/g)
    var isGit = isGitUrl(input) || validUrl.isUri(input)

    if(isGitHub) {
        fetchGitHub(state, input, callback, error);
    } else if(isFolder) {
        fetchFolder(state, input, callback, error);
    } else if(isGit) {
        fetchGit(state, input, callback, error);
    } else {
        error({ 'message':'Unable to match "'+input+'" with an action.' })
    }
}

var fetchGitHub = function (state, input, callback, error) {
    var tmpPath = pathExtra.tempdir()+'/'+uuid.v1()

    // setup the tmp path
    fs.mkdir(tmpPath, function() {
        // get the default branch
        var query = {}
        if(typeof process.env.token !== 'undefined') {
            query = {
                access_token: process.env.token
            }
        }

        var stream = request({
            url: 'https://api.github.com/repos/'+input,
            qs: query,
            headers: {
                'User-Agent': 'request'
            }
        }, function (error, response, body) {
            // get the archive
            var repoDetails = JSON.parse(body)

            var stream = request({
                url: 'https://github.com/'+input+'/archive/'+repoDetails.default_branch+'.tar.gz'
            }).pipe(gunzip()).pipe(tar.extract(tmpPath))

            stream.on('finish', function () {
                state.template = {
                    input: input,
                    source: 'github',
                    tmp: tmpPath + '/' + repoDetails.name + '-' + repoDetails.default_branch
                }
                callback(state)
            })
        })
    })
}

var fetchFolder = function (state, input, callback, error) {
    var folder = path.basename(input)
    var tmpPath = pathExtra.tempdir()+'/'+uuid.v1()

    // setup the tmp path
    fsExtra.mkdirsSync(tmpPath)

    fsExtra.copySync(input, tmpPath)

    if(isThere(tmpPath + '/.git')) {
        fsExtra.removeSync(tmpPath + '/.git')
    }

    state.template = {
        input: input,
        source: 'folder',
        tmp: tmpPath
    }
    callback(state)
}

var fetchGit = function (state, input, callback, error) {
    var exec = require('child_process').exec
    var tmpPath = pathExtra.tempdir()+'/'+uuid.v1()
    var command = "git clone "+input+" "+tmpPath

    exec(command, function(error, stdout, stderr) {
        state.template = {
            input: input,
            source: 'git',
            tmp: tmpPath
        }

        if(isThere(tmpPath + '/.git')) {
            fsExtra.removeSync(tmpPath + '/.git')
        }

        callback(state)
    })
}

var fetchProject = function(state, input, callback, error) {
    var isURL = validUrl.isUri(input)
    var isJSON = input.match(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/g)
    var isFile = input.match(/[^\\]*\.(\w+)$/g)

    if(isURL) {
        fetchURL(state, input, callback, error)
    } else if(isJSON) {
        fetchJSON(state, input, callback, error)
    } else if(isFile) {
        fetchFile(state, input, callback, error)
    } else {
        error({ 'message':'Unable to match "'+input+'" with an action.' })
    }
}

var fetchURL = function (state, input, callback, error) {
    var fileName = path.basename(input)
    var tmpPath = pathExtra.tempdir()+'/'+uuid.v1()

    var response = request(input)

    // setup the tmp path
    fs.mkdir(tmpPath, function() {

        var stream = response.pipe(fs.createWriteStream(tmpPath + '/data.json'))

        stream.on('finish', function () {
            state.project = {
                input: input,
                source: 'url',
                tmp: tmpPath + '/data.json'
            }
            callback(state)
        })
    })
}

var fetchJSON = function (state, input, callback, error) {
    state.project = {
        input: input,
        source: 'json'
    }
    callback(state)
}

var fetchFile = function (state, input, callback, error) {
    var fileName = path.basename(input)
    var tmpPath = pathExtra.tempdir()+'/'+uuid.v1()

    // setup the tmp path
    fs.mkdir(tmpPath, function() {

        var stream = fs.createReadStream(input).pipe(fs.createWriteStream(tmpPath + '/data.json'))

        stream.on('finish', function () {
            state.project = {
                input: input,
                source: 'file',
                tmp: tmpPath + '/data.json'
            }
            callback(state)
        })
    })
}
