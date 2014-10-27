var Package = require('duo-package');

module.exports = function (input, type) {
    var item = null;
    var isGitHub = input.match(/\b\/\b/);
    var isURL = input.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

    if (isGitHub) {
        item = getGitHub(input, type);
    } else if (isURL) {
        item = getURL(input, type);
    } else {
        item = getFile(input, type);
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
        local: '/tmp/' + pkg.directory()
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
        meta: {}
    }
}

function getFile(input, type) {
    return {
        input: input,
        source: 'file',
        meta: {}
    }
}
