# ![Pollinate](https://raw.githubusercontent.com/howardroark/pollinate/develop/media/readme.png)

Generate a new project directly from Git(Hub) using a simple schema.

[![stability][0]][1]
[![npm version](https://badge.fury.io/js/pollinate.svg)](https://badge.fury.io/js/pollinate)  [![Build Status](https://travis-ci.org/howardroark/pollinate.svg?branch=develop)](https://travis-ci.org/howardroark/pollinate) [![Coverage Status](https://coveralls.io/repos/github/howardroark/pollinate/badge.svg?branch=develop)](https://coveralls.io/github/howardroark/pollinate?branch=develop) [![Dependency Status](https://david-dm.org/howardroark/pollinate.svg)](https://david-dm.org/howardroark/pollinate)

## What?

It is a command that takes a templated tree of files and generates them for new
projects using data defined by a simple schema. The data can define an output
`name`, files to `discard`, files to `parse` with the data, and files to `move`
or rename. The template can supply the default data, and that data can be
extended for each project.  You can throw in any other data you'd like to be
passed to the template context as well.

All templates are parsed with [Nunjucks](http://mozilla.github.io/nunjucks/) aka
[Jinja](http://jinja.pocoo.org/) and [Twig](http://twig.sensiolabs.org/).

## Why?

When starting new projects the quickest way is often to just copy the last project and
fiddle with it until it works. This can introduce many unwanted issues, like having one
client's name appear in place of the other's. This project's goal is to offer an elegant
and efficient way of working with a base set of files that can be understood by looking
at a single example.

## Install

```
$ npm install -g pollinate
```

## An example

```
$ pollinate howardroark/webapp --name newproject --container alpine --description="A thing that does something."
```
[Skip to more examples...](#more-examples)

##### The GitHub sourced template

```
.
├── PROJECT-README
├── README.md
├── Dockerfile
├── project-name
└── template.json
```

###### `template.json` (optional)

```
{
  // Core schema
  "name": "webapp",
  "parse": [
    "PROJECT-README",
    "Dockerfile"
  ],
  "discard": [
    "README.md",
    "template.json"
  ],
  "move": [
    { "PROJECT-README": "README.md" },
    { "project-name": "{{ name }}.txt" }
  ],
  // Custom defaults
  "container": "debian",
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
}
```

You can omit any or all of `discard`, `parse` and `move`. 

###### `PROJECT-README`

```
# {{ name }}

{{ description }}
```

###### `Dockerfile`

```
FROM {{ container }}
```

##### The project data

```
{
  "name": "newproject",
  "container": "alpine",
  "description": "A thing that does something."
}
```

##### The data after extending and parsing

```
{
  "name": "newproject",
  "parse": [
    "Dockerfile",
    "PROJECT-README"
  ],
  "discard": [
    "README.md",
    "template.json"
  ],
  "move": [
    { "PROJECT-README": "README.md" },
    { "project-name": "newproject.txt" }
  ],
  "container": "alpine",
  "description": "A thing that does something."
}
```

##### The result

```
.
└── newproject
   ├── README.md
   ├── newproject.txt
   └── Dockerfile
```

###### `README.md`

```
# newproject

A thing that does something.
```

###### `Dockerfile`

```
FROM alpine
```

## Parse

All `parse` paths are first passed to [globby](https://github.com/sindresorhus/globby)

```
{
  "parse": ["*"]
}
```
```
{
  "parse": [
    "*",
    "!templates"
  ]
}
```

## Merge

You can specify `.json` files to merge

#### `package.json`
```json
{
  "name": "@howardroark/webapp",
  "version": "1.0.0",
  "description": "project for testing pollinate with merge",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/howardroark/webapp.git"
  },
  "author": "Andy Edwards",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/howardroark/webapp/issues"
  },
  "homepage": "https://github.com/howardroark/webapp#readme",
  "dependencies": {
    "lodash": "^4.17.4"
  }
}
```

#### `PROJECT-package.json`
```json
{
  "name": "@{{ organization }}/{{ name }}",
  "version": "1.0.0",
  "description": "{{ description }}",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/{{ organization }}/{{ name }}.git"
  },
  "author": "{{ author }}",
  "bugs": {
    "url": "https://github.com/{{ organization }}/{{ name }}/issues"
  },
  "homepage": "https://github.com/{{ organization }}/{{ name }}#readme",
}
```

#### `template.json`
```json
{
  "name": "webapp",
  "description": "project for testing pollinate with merge",
  "organization": "howardroark",
  "author": "Andy Edwards",
  "parse": [
    "PROJECT-package.json"
  ],
  "merge": [
    ["package.json", "PROJECT-package.json"]
  ],
  "discard": [
    "PROJECT-package.json"
  ]
}
```

#### command
```
pollinate howardroark/webapp#merge-test --name myapp --description 'my new app' --organization myorg --author Me
```

This will overwrite `package.json` with the contents of `package.json` and `PROJECT-package.json` merged with
`lodash.merge`.  This is useful when you want to keep template variables out of `package.json`, since they would cause
certain `npm` commands to fail.

#### Resulting `package.json`
```json
{
  "name": "@myorg/myapp",
  "version": "1.0.0",
  "description": "my new app",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/myorg/myapp.git"
  },
  "author": "Me",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/myorg/myapp/issues"
  },
  "homepage": "https://github.com/myorg/myapp#readme",
  "dependencies": {
    "lodash": "^4.17.4"
  }
}
```

## More options

You can specify template files as a local directory (.git will be removed)
```
$ pollinate ./template --name newproject --container ubuntu
```

You can use any Git url (.git will be removed)
```
$ pollinate https://github.com/howardroark/webapp.git --name newproject --container ubuntu
```

You can pass project data as a file
```
$ pollinate howardroark/webapp data.json
```

You can pass project data as a JSON string
```
$ pollinate howardroark/webapp '{"name":"newproject","container":"alpine","description":"A thing that does a thing."}'
```

You can pass project data as a JSON endpoint
```
$ pollinate howardroark/webapp https://example.com/json/data
```

You can supply a target directory (will create directories that do not exist).

```
$ pollinate howardroark/webapp target
```
or

```
$ pollinate howardroark/webapp /target/directory data.json
```

You can generate from the default data in the template
```
$ pollinate howardroark/webapp
```

You can override data as CLI options
```
$ pollinate howardroark/webapp data.json --name=alternate --container=ubuntu
```

You can specify a command to run on completion
```
{
  "complete": "git init {{ name }}"
}
```

You can supply user specific data each time with a `~/.pollen` defaults file

```
{
  "api_key":"secret"
}
```

You can supply custom [Nunjucks `filter`](https://mozilla.github.io/nunjucks/templating.html#filters) functions (files must be included within template)

```
{
  "filters": {
    "markdown": "filters/markdown.js"
  }
}
```

You can preserve the commit history from the skeleton project with the `--keep-history` CLI option or:

```
{
  keepHistory: true
}
```

##### `filters/markdown.js`

```
var markdownParser = function() { ... }

module.exports = function(markdownText) {
  var html = markdownParser(markdownText)
  return '<div class="markdown">'+html+'</div>'
}
```

You can supply a `questions` object to prompt for data with [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) (file must be included in template)

```
{
  "questions":"inquirer-questions.js"
}
```

##### `inquirer-questions.js`

```
module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Input a computer friendly name for your project.',
    default: 'newproject'
  },
  {
    type: 'input',
    name: 'description',
    message: 'Input a brief description of your project.',
    default: 'My new project!'
  }
]
```

### Shout-outs

Thanks to [Alim Maasoglu](https://dribbble.com/binhood) for the fantastic work on the logo!

[0]: https://img.shields.io/badge/stability-stable-green.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
