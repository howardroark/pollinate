/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)
   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

var symlinkSync = require('symlink-or-copy').sync;

module.exports = function (state, callback) {
    var link = state.data.link;

    if (!link) {
        callback(null, state);
        return;
    }
   
    try {
        link.forEach(function (item) {
            var orig = Object.keys(item)[0],
                dest = item[Object.keys(item)[0]];
            
            symlinkSync(orig, dest);
        });
    } catch (error) {
        callback(error);
        return;
    }
    
    callback(null, state);
};
