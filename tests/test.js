var pollinate = require('../lib/index.js')
var assert = require('chai').assert
var rimraf = require('rimraf')

describe('Test basic example', function () {
    it('GitHub with json string', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "howardroark/webapp",
                "{\"name\":\"newproject\",\"container\":\"alpine\"}"
            ],
            "options": {
                //..
            }},
            function(result) {
                assert.isObject(result);
                rimraf('newproject', done)
            })
    })
    it('GitHub with json file', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "howardroark/webapp",
                "tests/data.json"
            ],
            "options": {
                //..
            }},
            function(result) {
                assert.isObject(result);
                rimraf('newproject', done)
            })
    })
    it('GitHub with json url', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "howardroark/webapp",
                "https://raw.githubusercontent.com/howardroark/pollinate/develop/tests/data.json"
            ],
            "options": {
                //..
            }},
            function(result) {
                assert.isObject(result);
                rimraf('newproject', done)
            })
    })
    it('Git with json string', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "https://github.com/howardroark/webapp.git",
                "{\"name\":\"newproject\",\"container\":\"alpine\"}"
            ],
            "options": {
                //..
            }},
            function(result) {
                assert.isObject(result);
                rimraf('newproject', done)
            })
    })
    it('GitHub with options', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "howardroark/webapp"
            ],
            "options": {
               "name": "test",
               "container": "ubuntu"
            }},
            function(result) {
                assert.isObject(result);
                rimraf('test', done)
            })
    })
    it('Local path with json file', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "./tests/template",
                "tests/data.json"
            ],
            "options": {
                //..
            }},
            function(result) {
                assert.isObject(result);
                rimraf('newproject', done)
            })
    })
    it('Local path without template.json, json file with discard omitted', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "./tests/template-no-data/",
                "tests/data-no-discard.json"
            ],
            "options": {
                //
            }},
            function(result) {
                assert.isObject(result);
                rimraf('newproject', done)
            })
    })
    it('Local path without template.json, json file with parse set to all', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "./tests/template-no-data/",
                "tests/data-parse-all.json"
            ],
            "options": {
                //
            }},
            function(result) {
                assert.isObject(result);
                rimraf('newproject', done)
            })
    })
    it('Local path without template.json, json file with move omitted', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "./tests/template-no-data/",
                "tests/data-no-move.json"
            ],
            "options": {
                //
            }},
            function(result) {
                assert.isObject(result);
                rimraf('newproject', done)
            })
    })
    it('Local path without template.json, json file with complete', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "./tests/template-no-data/",
                "tests/data-complete.json"
            ],
            "options": {
                //
            }},
            function(result) {
                assert.isObject(result);
                rimraf('newproject', done)
            })
    })
})
