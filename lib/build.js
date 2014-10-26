function build(program) {
    var state = {};

    state.flower = {};
    state.pollen = {};

    state.flower.input = program.args[0];
    state.pollen.input = program.args[1];

    state.flower.type = getType(state.flower.input);
    state.pollen.type = getType(state.pollen.input);

    return state;
}
module.exports.build = build;

function getType(input) {
    var type = null;
    var isGitHub = input.match(/\b\/\b/);
    var isURL = input.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

    if (isGitHub) {
        type = "github";
    } else if (isURL) {
        type = "url";
    } else {
        type = "file";
    }

    return type;
}
