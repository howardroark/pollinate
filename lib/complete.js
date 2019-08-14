/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

const spawn = require('child_process').spawn;
const async = require('async');
const mv = require('mv');
const splitArgs = require('splitargs');

module.exports = function (state, callback) {
    var complete = state.data.complete;

    async.series([
        // Move all the files to the relative path "{{ name }}"
        function (next) {
            mv(state.template.tmp, state.data.name, function (err) {
                if (err) {
                    next(err);
                    return;
                }
                next(null);
            });
        },
        // Call the shell command specified as `complete`
        function (next) {
            if (complete !== undefined) {
                var commands = (typeof complete === 'string')
                    ? [complete]
                    : complete;
                async.series(commands.map(onCommand)).then(next, next);
            } else {
                next(null);
            }
        }
    ], function (err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, state);
    });
};

function onCommand(raw) {
    return (next) => {
        const [cmd, ...rest] = splitArgs(raw);
        if (cmd === 'cd') {
            process.chdir(rest[0]);
            next(null);
            return;
        }
        spawn(cmd, rest, { stdio: 'inherit' }).on('close', (code) => {
            if (code) {
                next(new Error(`Process exited with code: ${code}`));
            } else {
                next(null);
            }
        });
    };
}
