/*global describe, it, afterEach*/
'use strict';

var pollinate = require('../lib/index.js');
var assert = require('chai').assert;
var rimraf = require('rimraf');
var fs = require('fs');
var path = require('path');

describe('Test basic example', function () {
    afterEach(function (done) {
        rimraf('newproject', function () {
            rimraf('test', done);
        });
    });

    it('GitHub with json string', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "howardroark/webapp",
                "{\"name\":\"newproject\",\"container\":\"alpine\"}"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            fs.readFile(path.join('newproject', 'README.md'), 'utf8', function (err, data) {
                assert.isNull(err);
                assert.notInclude(data, 'This branch is for testing `pollinate howardroark/webapp#test-branch`.');
                done();
            });
        });
    });
    it('GitHub with json file', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "howardroark/webapp",
                "tests/mocks/data.json"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            done();
        });
    });
    it('GitHub with json url', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "howardroark/webapp",
                "https://raw.githubusercontent.com/howardroark/pollinate/develop/tests/mocks/data.json"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            done();
        });
    });
    it('Git with json string', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "https://github.com/howardroark/webapp.git",
                "{\"name\":\"newproject\",\"container\":\"alpine\"}"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            done();
        });
    });
    it('Git with json string and keepHistory', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "https://github.com/howardroark/webapp.git",
                "{\"name\":\"newproject\",\"container\":\"alpine\", \"keepHistory\":true}"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            fs.stat(path.join('newproject', '.git'), function (err, stats) {
                assert.isNull(err);
                assert.isOk(stats.isDirectory());
                done();
            });
        });
    });
    it('Git with json string and --keep-history', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "https://github.com/howardroark/webapp.git",
                "{\"name\":\"newproject\",\"container\":\"alpine\"}"
            ],
            "options": {
                //..
            },
            "flags": {
                "keep-history": true
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            fs.stat(path.join('newproject', '.git'), function (err, stats) {
                assert.isNull(err);
                assert.isOk(stats.isDirectory());
                done();
            });
        });
    });
    it('GitHub with options', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "howardroark/webapp"
            ],
            "options": {
                "name": "test",
                "container": "ubuntu"
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            done();
        });
    });
    it('GitHub with ref', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "howardroark/webapp#test-branch",
                "{\"name\":\"newproject\",\"container\":\"alpine\"}"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            fs.readFile(path.join('newproject', 'README.md'), 'utf8', function (err, data) {
                assert.isNull(err);
                assert.include(data, 'This branch is for testing `pollinate howardroark/webapp#test-branch`.');
                done();
            });
        });
    });
    it('Git with ref', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "https://github.com/howardroark/webapp.git#test-branch",
                "{\"name\":\"newproject\",\"container\":\"alpine\"}"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            fs.readFile(path.join('newproject', 'README.md'), 'utf8', function (err, data) {
                assert.isNull(err);
                assert.include(data, 'This branch is for testing `pollinate howardroark/webapp#test-branch`.');
                done();
            });
        });
    });
    it('Git with ref and merge', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "https://github.com/howardroark/webapp.git#merge-test",
                "{\"name\":\"newproject\"}"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            fs.readFile(path.join('newproject', 'package.json'), 'utf8', function (err, data) {
                assert.isNull(err);
                var parsed = JSON.parse(data);
                assert.equal(parsed.name, 'newproject');
                assert.equal(parsed.version, '1.0.0');
                assert.isOk(parsed.dependencies);
                assert.isOk(parsed.dependencies.lodash);
                assert.equal(parsed.bugs.url, 'https://github.com/howardroark/newproject/issues');
                fs.readFile(path.join('newproject', 'settings.json'), 'utf8', function (err, data) {
                    assert.isNull(err);
                    parsed = JSON.parse(data);
                    assert.equal(parsed.hello, 'world newproject');
                    assert.equal(parsed.foo, 'newproject');
                    done();
                });
            });
        });
    });
    it('Git with ref and merge error', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "https://github.com/howardroark/webapp.git#merge-error-test",
                "{\"name\":\"newproject\"}"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNotNull(err);
            assert.isNotOk(result);
            done();
        });
    });
    it('Local path with json file', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "./tests/mocks/template",
                "tests/mocks/data.json"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            done();
        });
    });
    it('Local path without template.json, json file with discard omitted', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "./tests/mocks/template-no-data/",
                "tests/mocks/data-no-discard.json"
            ],
            "options": {
                //
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            done();
        });
    });
    it('Local path without template.json, json file with parse set to all', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "./tests/mocks/template-no-data/",
                "tests/mocks/data-parse-all.json"
            ],
            "options": {
                //
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            done();
        });
    });
    it('Local path without template.json, json file with move omitted', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "./tests/mocks/template-no-data/",
                "tests/mocks/data-no-move.json"
            ],
            "options": {
                //
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            done();
        });
    });
    it('Local path without template.json, json file with complete', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "./tests/mocks/template-no-data/",
                "tests/mocks/data-complete.json"
            ],
            "options": {
                //
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            done();
        });
    });
});
