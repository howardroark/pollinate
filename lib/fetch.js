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
var uuid = require('uuid')
var gunzip = require('gunzip-maybe')
var tar = require('tar-fs')


module.exports = function (state, callback, error) {
    fetchTemplate(state, function(state) {
        if(typeof state.project != 'undefined') {
            fetchProject(state, function(state) {
                callback(state)
            }, error)
        } else {
            callback(state)
        }
    }, error)
}

var fetchTemplate = function(state, callback, error) {
    switch(state.template.source) {
        case 'github':
            fetchGitHub(state, callback, error)
            break
        case 'directory':
            fetchDirectory(state, callback, error)
            break
        case 'git':
            fetchGit(state, callback, error)
            break
    }
}

var fetchProject = function(state, callback, error) {
    switch(state.project.source) {
        case 'url':
            fetchURL(state, callback, error)
            break
        case 'json':
            fetchJSON(state, callback, error)
            break
        case 'file':
            fetchFile(state, callback, error)
            break
    }
}

var fetchGitHub = function (state, callback, error) {
    var tmpPath = pathExtra.tempdir()+'/'+uuid.v1()
    var input = state.template.input

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
                state.template.tmp = tmpPath + '/' + repoDetails.name + '-' + repoDetails.default_branch
                callback(state)
            })
        })
    })
}

var fetchDirectory = function (state, callback, error) {
    var directory = path.basename(input)
    var tmpPath = pathExtra.tempdir()+'/'+uuid.v1()
    var input = state.template.input

    state.template.tmp = tmpPath

    // setup the tmp path
    fsExtra.mkdirsSync(tmpPath)

    fsExtra.copySync(input, tmpPath)

    if(isThere(tmpPath + '/.git')) {
        fsExtra.removeSync(tmpPath + '/.git')
    }

    callback(state)
}

var fetchGit = function (state, callback, error) {
    var exec = require('child_process').exec

    var tmpPath = pathExtra.tempdir()+'/'+uuid.v1()
    var input = state.template.input

    var command = "git clone "+input+" "+tmpPath

    state.template.tmp = tmpPath

    exec(command, function(error, stdout, stderr) {

        if(isThere(tmpPath + '/.git')) {
            fsExtra.removeSync(tmpPath + '/.git')
        }

        callback(state)
    })
}

var fetchURL = function (state, callback, error) {
    var fileName = path.basename(input)
    var tmpPath = pathExtra.tempdir()+'/'+uuid.v1()
    var input = state.project.input

    var response = request(input)

    state.project.tmp = tmpPath

    // setup the tmp path
    fs.mkdir(tmpPath, function() {

        var stream = response.pipe(fs.createWriteStream(tmpPath + '/data.json'))

        state.project.tmp = tmpPath + '/data.json'

        stream.on('finish', function () {
            callback(state)
        })
    })
}

var fetchJSON = function (state, callback, error) {
    var input = state.project.input

    callback(state)
}

var fetchFile = function (state, callback, error) {
    var fileName = path.basename(input)
    var tmpPath = pathExtra.tempdir()+'/'+uuid.v1()
    var input = state.project.input

    // setup the tmp path
    fs.mkdir(tmpPath, function() {

        var stream = fs.createReadStream(input).pipe(fs.createWriteStream(tmpPath + '/data.json'))

        state.project.tmp = tmpPath + '/data.json'

        stream.on('finish', function () {
            callback(state)
        })
    })
}
