/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

var Package = require('duo-package');
var fs = require('fs');
var path = require('path');
var request = require('request');
var urlRegex = require('url-regex');

module.exports = function (input, type) {
    var item = null;
    var isGitHub = input.match(/[A-Za-z\-_]+\/[A-Za-z\-_]+$/g); // https://www.debuggex.com/i/zM04_3xkUW-7yFSK.png
    var isURL = urlRegex({exact: true}).test(input);

    if (isGitHub) {
        item = getGitHub(input, type);
    } else if (isURL) {
        item = getURL(input, type);
    } else {
        item = getPath(input, type);
    }

    return item;
}

function getGitHub(input, type) {
    if(type == "pollen") {
        return {
            error: "GitHub locations for Pollen are currently not supported."
        }
    }
    var meta = {};
    var pkg = new Package(input, '*').directory('/tmp');
    var slug = null;

    pkg.fetch(function(err) {
      console.log('fetched: %s', pkg.slug());
    })

    return {
        input: input,
        source: 'github',
        tmp: pkg.directory() + '/' + pkg.slug(),
        meta: meta
    }
}

function getURL(input, type) {
    if(type == "flower") {
        return {
            error: "URLs for Flower files are currently not supported."
        }
    }

    var meta = {};
    var fileName = path.basename(input);
    var tmp = '/tmp/' + fileName;
    request(input).pipe(fs.createWriteStream(tmp));
    meta.format = path.extname(fileName).replace('.','');

    return {
        input: input,
        source: 'url',
        tmp: tmp,
        meta: meta
    }
}

function getPath(input, type) {
    if(type == "pollen" && !fs.lstatSync(input).isFile()) {
        return {
            error: "Pollen must be a file."
        }
    }

    var meta = {};
    var fileName = path.basename(input);
    var tmp = '/tmp/' + fileName;
    fs.createReadStream(input).pipe(fs.createWriteStream(tmp));

    return {
        input: input,
        source: 'path',
        tmp: tmp,
        meta: meta
    }
}
