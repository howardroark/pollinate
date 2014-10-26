function build(program) {
    var state = {};

    state.flower = get( program.args[0], 'flower' );
    state.pollen = get( program.args[1], 'pollen' );

    return state;
}
module.exports.build = build;

function get(input, type) {
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
    return {
        input: input,
        source: 'github',
        meta: {}
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
