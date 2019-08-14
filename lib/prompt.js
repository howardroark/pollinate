/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

const prompt = require('prompt');

module.exports = function (state, callback) {
    if (!state.template.data || state.project || Object.keys(state.options).length) {
        callback(null, state);
        return;
    }

    const items = Object.keys(state.template.data).filter(function (item) {
        return ['parse', 'discard', 'move', 'complete', 'filters', 'merge', 'prompt'].indexOf(item) === -1;
    });

    prompt.start();

    prompt.get(
        items.map(function (item) {
            return { name: item };
        }),
        function (err, result) {
            if (err) {
                callback(err);
                return;
            }
            state.prompt = result;
            callback(null, state);
        }
    );
};
