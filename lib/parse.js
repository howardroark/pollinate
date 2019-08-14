/*  __  __    _    _  _______    ____ _   _    _    _   _  ____ _____ ____  _
   |  \/  |  / \  | |/ / ____|  / ___| | | |  / \  | \ | |/ ___| ____/ ___|| |
   | |\/| | / _ \ | ' /|  _|   | |   | |_| | / _ \ |  \| | |  _|  _| \___ \| |
   | |  | |/ ___ \| . \| |___  | |___|  _  |/ ___ \| |\  | |_| | |___ ___) |_|
   |_|  |_/_/   \_\_|\_\_____|  \____|_| |_/_/   \_\_| \_|\____|_____|____/(_)

   There is a 100% chance that this project can use improvements.
   Pull requests are ALWAYS welcome, even if just amounts to a conversation.  */

'use strict';

const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const globby = require('globby');
const async = require('async');

module.exports = function (state, callback) {

    const parse = state.data.parse,
        filters = state.data.filters,
        env = nunjucks.configure(state.template.tmp, { autoescape: false });

    if (filters !== undefined) {
        Object.keys(filters).map(function (filterName) {
            env.addFilter(filterName, require(path.join(state.template.tmp, filters[filterName])));
        });
    }

    // First parse the data for any template tags
    state.data = JSON.parse(nunjucks.renderString(JSON.stringify(state.data), state.data));

    if (parse !== undefined) {
        globby(parse, { cwd: state.template.tmp, nodir: true }).then(function (paths) {
            async.parallel(paths.map(function (path) {
                return function (next) {
                    const fullPath = state.template.tmp + '/' + path;
                    fs.writeFile(fullPath, nunjucks.render(fullPath, state.data), next);
                };
            }), function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, state);
            });
        });
    } else {
        callback(null, state);
    }
};
