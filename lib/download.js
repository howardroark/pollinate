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

module.exports = function (input, type) {
    var item = null;
    var isGitHub = input.match(/\b\/\b/);
    var isURL = input.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

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
    var pkg = new Package(input, '*').directory('/tmp');
    var slug = null;

    pkg.fetch(function(err) {
      console.log('fetched: %s', pkg.slug());
    })

    return {
        input: input,
        source: 'github',
        tmp: pkg.directory() + '/' + pkg.slug()
    }
}

function getURL(input, type) {
    if(type == "flower") {
        return {
            error: "URLs for Flower files are currently not supported."
        }
    }

    return {
        input: input,
        source: 'url',
        tmp: ''
    }
}

function getPath(input, type) {
    if(type == "pollen" && !fs.lstatSync(input).isFile()) {
        return {
            error: "Pollen must be a file."
        }
    }

    var fileName = path.basename(input);
    var tmp = '/tmp/' + fileName;
    fs.createReadStream(input).pipe(fs.createWriteStream(tmp));
    return {
        input: input,
        source: 'path',
        tmp: tmp
    }
}
