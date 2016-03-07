# Pollinate

Combine a Git(Hub) template with project data to generate new files.

```
$ npm install -g pollinate
```

[![Join the chat at https://gitter.im/codingcoop/pollinate](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/codingcoop/pollinate?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  [![npm version](https://badge.fury.io/js/pollinate.svg)](https://badge.fury.io/js/pollinate)  [![Build Status](https://travis-ci.org/codingcoop/pollinate.svg?branch=master)](https://travis-ci.org/codingcoop/pollinate) [![Coverage Status](https://coveralls.io/repos/github/codingcoop/pollinate/badge.svg?branch=master)](https://coveralls.io/github/codingcoop/pollinate?branch=master) [![Dependency Status](https://david-dm.org/codingcoop/pollinate.svg)](https://david-dm.org/codingcoop/pollinate)

## What?

It is a command that takes a templated tree of files and generates them for new
projects using a simple schema. The data can define an output `name`, files to
`discard`, files to `parse` with the data, and files to `move` or rename. You can
also throw in any other data you'd like to be passed to the template context. The
template can supply the default data, and that data can be extended for each
project before generating.

All templates are parsed with [Nunjucks](http://mozilla.github.io/nunjucks/) aka
[Jinja](http://jinja.pocoo.org/) and [Twig](http://twig.sensiolabs.org/). All JSON
is parsed with [Hjson](http://hjson.org), so you can use comments!

## Why?

When starting new projects the quickest way is often to just copy the last project and
fiddle with it until it works. This can introduce many unwanted issues, like having one
client's name appear in place of the other's. There are tools like [Yeoman](http://yeoman.io)
which allow you to build your own scaffolding engines, but not every case requires that
amount of complexity.

This project's goal is to offer a elegant way of working with a base set of files that
can be understood by looking at a single example.

## An example

```
pollinate codingcoop/webapp --name newproject --container alpine --description="A thing that does something." 
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

###### `template.json` (default data)

```
{
  // Core schema
  "name": "webapp",
  "discard": [
    "README.md",
    "template.json"
  ],
  "parse": [
    "PROJECT-README",
    "Dockerfile"
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
  "discard": [
    "README.md",
    "template.json"
  ],
  "parse": [
    "Dockerfile",
    "PROJECT-README"
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

## More examples

You can specify template files as a local directory (.git will be removed)
```
$ pollinate ./template --name newproject --container ubuntu
```

You can use any Git url (.git will be removed)
```
$ pollinate https://github.com/codingcoop/webapp.git --name newproject --container ubuntu
```

You can pass project data as a file
```
$ pollinate codingcoop/webapp data.json
```

You can pass project data as a JSON string
```
$ pollinate codingcoop/webapp '{"name":"newproject","container":"alpine","description":"A thing that does a thing."}'
```

You can pass project data as a JSON endpoint
```
$ pollinate codingcoop/webapp https://example.com/json/data
```

You can generate from the default data in the template
```
$ pollinate codingcoop/webapp
```

You can override data as CLI options
```
$ pollinate codingcoop/webapp ~/defaults.json --name=alternate --container=ubuntu
```

You can specify a command to run on completion
```
{
  "complete": "git init {{ name }}"
}
```
