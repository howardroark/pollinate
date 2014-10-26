function evaluate(program) {
    var state = {};

    state.flower = {};
    state.pollen = {};

    state.flower.input = program.args[0];
    state.pollen.input = program.args[1];

    state.flower.type = getType(state.flower.input);
    state.pollen.type = getType(state.pollen.input);

    return state;
}
module.exports.evaluate = evaluate

function getType(input) {
    var type = null;
    var isGitHub = input.match(/\b\/\b/);

    if (isGitHub) {
        type = "github";
    } else {
        type = "file";
    }

    return type;
}
