/*global describe, it*/
'use strict';

var pollinate = require('../lib/index.js');
var assert = require('chai').assert;
var rimraf = require('rimraf');
var fs = require('fs');
var path = require('path');

describe('Test basic example', function () {
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
                rimraf('newproject', done);
            });
        });
    });
    it('GitHub with json file', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "howardroark/webapp",
                "tests/data.json"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            rimraf('newproject', done);
        });
    });
    it('GitHub with json url', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "howardroark/webapp",
                "https://raw.githubusercontent.com/howardroark/pollinate/develop/tests/data.json"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            rimraf('newproject', done);
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
            rimraf('newproject', done);
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
            rimraf('test', done);
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
                rimraf('newproject', done);
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
                rimraf('newproject', done);
            });
        });
    });
    it('Local path with json file', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "./tests/template",
                "tests/data.json"
            ],
            "options": {
                //..
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            rimraf('newproject', done);
        });
    });
    it('Local path without template.json, json file with discard omitted', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "./tests/template-no-data/",
                "tests/data-no-discard.json"
            ],
            "options": {
                //
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            rimraf('newproject', done);
        });
    });
    it('Local path without template.json, json file with parse set to all', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "./tests/template-no-data/",
                "tests/data-parse-all.json"
            ],
            "options": {
                //
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            rimraf('newproject', done);
        });
    });
    it('Local path without template.json, json file with move omitted', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "./tests/template-no-data/",
                "tests/data-no-move.json"
            ],
            "options": {
                //
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            rimraf('newproject', done);
        });
    });
    it('Local path without template.json, json file with complete', function (done) {
        this.timeout(10000);
        pollinate({
            "inputs": [
                "./tests/template-no-data/",
                "tests/data-complete.json"
            ],
            "options": {
                //
            }
        }, function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            rimraf('newproject', done);
        });
    });
});
