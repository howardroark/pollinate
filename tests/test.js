var pollinate = require('../lib/index.js')
var assert = require('chai').assert
var rimraf = require('rimraf')

describe('Test basic example', function () {
    it('GitHub with json string', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "codingcoop/webapp",
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
                "codingcoop/webapp",
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
                "codingcoop/webapp",
                "https://raw.githubusercontent.com/codingcoop/pollinate/develop/tests/data.json"
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
                "https://github.com/codingcoop/webapp.git",
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
    it('GitHub with options only', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "codingcoop/webapp"
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
    it('Local path with json string', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "./tests/template",
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
    it('Local path with json url', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "./tests/template",
                "https://raw.githubusercontent.com/codingcoop/pollinate/develop/tests/data.json"
            ],
            "options": {
                //..
            }},
            function(result) {
                assert.isObject(result);
                rimraf('newproject', done)
            })
    })
    it('Local path without template.json, json file with discard, parse, move, complete, and option name override', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "./tests/template-no-data/",
                "tests/data-complete.json"
            ],
            "options": {
                "name": "override"
            }},
            function(result) {
                assert.isObject(result);
                rimraf('override', done)
            })
    })
    it('Local path without template.json with json with only discard and parse', function (done) {
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
    it('Local path without template.json and json without name', function (done) {
        this.timeout(10000)
        pollinate({
            "inputs": [
                "./tests/template-no-data/",
                "tests/data-no-name.json"
            ],
            "options": {
                //
            }},
            function(result) {
                assert.isObject(result);
                rimraf('undefined', done)
            })
    })
})
