function build(program) {
    var state = {};

    state.flower = get( program.args[0], 'flower' );
    state.pollen = get( program.args[1], 'pollen' );

    return state;
}
module.exports.build = build;

function get(input, name) {
    var item = null;
    var isGitHub = input.match(/\b\/\b/);
    var isURL = input.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

    if (isGitHub) {
        item = getGitHub(input, name);
    } else if (isURL) {
        item = getURL(input, name);
    } else {
        item = getFile(input, name);
    }

    return item;
}

function getGitHub(input, name) {
    return {
        input: input,
        type: 'github',
        meta: {}
    }
}

function getURL(input, name) {
    return {
        input: input,
        type: 'url',
        meta: {}
    }
}

function getFile(input, name) {
    return {
        input: input,
        type: 'file',
        meta: {}
    }
}
