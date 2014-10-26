function build(program) {
    var state = {};

    state.flower = get( program.args, 0 );
    state.pollen = get( program.args, 1 );

    return state;
}
module.exports.build = build;

function get(args, index) {
    var item = {};
    item.input = args[index];
    item.type = null;
    var isGitHub = item.input.match(/\b\/\b/);
    var isURL = item.input.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

    if (isGitHub) {
        item.type = "github";
    } else if (isURL) {
        item.type = "url";
    } else {
        item.type = "file";
    }

    return item;
}
