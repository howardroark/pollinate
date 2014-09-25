# Pollinate

> **NOTE:** This project has yet to undergo development. If you like the idea
> and want to help, awesome!

Think of a tree of files as a `Flower` and a JSON endpoint as `Pollen`; combined
together they create a fertilized project. Pollinate will allow you to template
a set of files and store them on GitHub.  When you decide to use them later
you can **pollinate** them with an object of data.

- [The What?](#the-what)
- [The Overview](#the-overview)
- [The Inspiration](#the-inspiration)
- [The Example](#the-example)
- [The Parts](#the-parts)
- [The Future](#the-future)

## The What?

In order to better understand the value of this endeavor, we will answer the
questions of [The Coder's Catechism](https://github.com/codingcoop/coders-catechism).
(This catechism is also a work in progress concept.)

#### What exaclty is this project attempting to accompish?

Ultimately an application is little more than a tree of files that describe
how it works and what it does. As open-source evolves new patterns are
constantly distilled which can help us build more effectively. These patterns
can then be assembled in a plethora of ways to enable different outcomes. Over
time the best practices for how we structure a project for a specific purpose
should also be distilled.

Pollinate aims to be a simple to understand process for templating files to
meet a specific and repeatable purpose. The idea is to design your templates to
have subtle points of variation that can be defined within an object of data.
The process of storing these variations in an object of data ensures that
anyone can grok the process and easily manipulate it.

Pollinate will allow you to store your templates on GitHub and chip away at them
over time. This process will also enable you to benefit from open-source
communities which share similar goals. When you need to use a template
Pollinate aims to ensure that the process is as quick and efficient as possible.

#### What pre-existing ideas does this project build upon?

It is becoming increasingly popular to assemble templates that act as a
boilerplate of best practices for kicking off new projects. This process ensures
that the best patterns can emerge and win out over time. A common way of
achieving this goal is to distill a set of files that are then later copied and
adjusted. At times this can be a tedious task and introduce unforseen
complications.

Amazing tools like [Yeoman](http://yeoman.io/) have emerged to help reduce
these complications and allow for more customization. While Yeoman is powerful
it requires that its [generators](http://yeoman.io/authoring/)(templates) be
built a lot like an application. It also requires the need to submit content to
[NPM](https://www.npmjs.org/), rather than just living on GitHub. This is not
always ideal for a fast pace of iteration.

#### What immediate benefits can this project offer today?

With the advent of virtualization tools like [Vagrant](http://vagrantup.com) and
configuration tools like [Salt](http://www.saltstack.com/) or
[Chef](https://www.getchef.com/) it is increasingly easy to automate the
construction of development environments. Pollinate can offer a means of
simplifying the process of starting a new project by allowing people to build
templates which require little more than a few decisions and simple `vagrant up`
to get started. This can also ensure that everyone is operating on top of an
identical platform.

In effect Pollinate can offer teams the opportunity to slowly reduce the
redundancies that occur when on-boarding new people and working in teams.

#### What impacts could this project have down the road?

Pollinate allows for services to be built which tie together the APIs of other
services. It would easy to concieve of a service leveraged the GitHub API and
offered an interface to choose a `Flower` while filling out some important
details. From there the service could run the Pollinate code and create the
user a brand new repository with the output.

## The Overview

Ultimately Pollinate is broken down into three main components. The template
which holds all of the files, the endpoint which supplies user configuration
and the data which defines the outcome. Both the template and the endpoint can
supply the data, but the data supplied by the endpoint holds precedence when
merged.

#### The `Flower`

The `Flower` is a GitHub repository that holds all of the files.  Any file can
contain template tags that will later be filled in with values. Pollinate uses
[Nunjucks](http://mozilla.github.io/nunjucks/) as its template engine.
Nunjucks is a JavaScript clone of [Jinja](http://jinja.pocoo.org/), which
encourages templates to be sandboxed and easy to read. It also allows
Pollinate to be attrative to people outside of the JavaScript community.
The `Flower` has the option of supplying its own default data at the root of the
template as JSON (flower.json) or [HJSON](http://laktak.github.io/hjson/)
(flower.hjson), which is a more human editable superset of JSON. Pollinate opts
not to use YAML because the core audience is likely not to use languages that
rely on whitespace. The `Flower` can also be supplied as a local file path for
easier testing.

#### The `Pollen`

The `Pollen` is pretty much just a vessel to get the data to the `Flower`. Much
like how pollen works in nature. It can be supplied as an HTTP JSON endpoint or
as a local file.

#### The Data

Consider the data to be more like the DNA of the operation. Both sides can
supply it, but the data from the `Pollen` takes precedence when merging the
objects. The data supplies a list of files to act upon with the template engine
along with the data to inject. The data can also supply file operations to move
or delete files during the process.

## The Inspiration

This project is inspired by the the configuration management tool
[Salt](https://github.com/saltstack/salt). The core idea behind Salt is the
process of creating a "State" object which defines how the machine will be
configured. The "master" service and the "minion" being configured both have
the ability to help define the state, but the minion takes precedence.

While this project does not mirror in any way the mechanics of Salt, it does
lean on the idea that an object of data is what should define your process.
It is increasingly popular to build apps around the idea of well designed JSON
schemas that enable easy to understand templates. Leveraging this way of
looking at things is the core concept of Pollinate.

This project is an evolution of the CLI tool for the project
[StackStrap](https://github.com/stackstrap) which combines Salt with Vagrant
to make DevOps easier for a larger audience. Eventually Pollinate will phase the
Python based CLI tool out so that StackStrap can focus on automation and the
[StackStrap Salt States](https://github.com/stackstrap/stackstrap-salt)
themselves.

## The Example

Suppose someone built a `Flower` designed to start a building a project using
[MEANstack](http://mean.io). They set it up so that development can occur within
a [Vagrant](https://www.vagrantup.com/) box and configure the files so that all
the dependencies like [MongoDB](http://www.mongodb.org/) are automatically
installed using [Salt](http://www.saltstack.com/). In that `Flower` there are a
few files where details need to be filled in and a couple files that need to
move around. It is likely that the original README.md file would provide context
that is no longer needed after parsing, so that would need to go.

Some other wonderful person builds a simple service that enables the ability to
submit that `Flower`. The service offers a lovely UI to choose the `Flower` and
convert custom options into a JSON object that is offered up via a unique hash.
You come along and pick the very same `Flower` to use. You are offered up a
string to copy and paste it into a terminal with Node.js running, and voila!

```
$ pollinate codingcoop/meanstack https://example.com/1bdDlXc
```

##### The `Flower` repository

```
.
├── PROJECT-README
├── README.md
├── Vagrantfile
├── app
    ...
├── bower.json
├── gruntfile.js
├── package.json
├── public
    ...
├── salt
    ...
└── flower.hjson
```

##### The HJSON file within the `Flower`

```
{
  # A computer safe name (always used to name the parent folder)
  name: newproject
  details: {
    box_name: precise64
    box_url: http://files.vagrantup.com/precise64.box
  }
  operations: {
    cleanup: [
      README.md
    ]
    parse: [
      PROJECT-README
    ]
    move: [
     { PROJECT-README: README.md }
     { app: {{name}}-app }
    ]
  }
}
```

##### The JSON supplied by the `Pollen`

```
{
  "name": "codingcoop",
  "details": {
    "box_name": "trusty64",
    "box_url": "http://files.vagrantup.com/trusty64.box"
  },
  "operations": {
    "parse": [
      "Vagrantfile",
      "PROJECT-README"
    ]
  }
}
```

##### The resulting JSON after merging

```
{
  "name": "codingcoop",
  "details": {
    "box_name": "trusty64",
    "box_url": "http://files.vagrantup.com/trusty64.box"
  },
  "operations": {
    "cleanup": [
      "README.md"
    ],
    "parse": [
      "Vagrantfile",
      "PROJECT-README"
    ],
    move: [
     { "PROJECT-README": "README.md" },
     { "app": "codingcoop-app" }
    ]
  }
}
```

##### The resulting file tree output

```
.
└── codingcoop
   ├── README.md
   ├── Vagrantfile
   ├── codingcoop-app
       ...
   ├── bower.json
   ├── gruntfile.js
   ├── package.json
   ├── public
       ...
   └── salt
       ...
```

(Don't forget to jump into the directory)

```
$ cd codingcoop
```

#### With one `vagrant up` it's ready!

## The Parts

Pollinate is built on top of the following projects. Each project has been
carefully chosen to ensure maintainability.

#### Duo Pacakge ([github](https://github.com/duojs/package))

[Duo](http://duojs.org) is a next generation package manager for the front-end.
It is wonderful idea that focuses on using GitHub as the source of packages.
The community around this project is growing at an extremely fast rate and is
offering a lot of promising advancements in browser based development.

The creator has done an amazing job abstracting the package handler portion of
the code. Pollinate plans to ride this wave and ideally help aid in its
direction over time.

#### Nunjucks ([github](https://github.com/mozilla/nunjucks))

Nunjucks is a very promising project that offers a bridge between the
JavaScript and Python communities.  It is heavily influenced by the extremely
popular template engine [Jinja2](http://jinja.pocoo.org/). Jinja and Nunjucks
both strive to offer a sandboxed template environment which encourages easy
to digest templates and smart data schemas. The project is backed by Mozilla
and has an active community who understands the value of this project.

#### Commander ([github](https://github.com/visionmedia/commander.js))

Commander is super simple and smart API for rapidly prototyping command-line
tools. The creator @visionmedia is clearly a savant when it comes to
open-source and undertands exaclty what people are looking for.

#### HJSON ([github](https://github.com/laktak/hjson-js))

HJSON is a very new idea that makes a lot of sense.  JSON is a powerful tool
for exchanging data between systems via HTTP.  It has become increasingly
popular as a means of providing configuration objects in projects. The problem
is that because JSON has been designed for compression, it can be tedious to
edit by hand. An alternative like YAML tends not to play well with larger
communities because it relies on whitespace to define data. HJSON offers an
elegant middle ground and is a direct superset of JSON. It removes the need
for commas and quotes and also allows for comments. The idea is surely to
catch on.

#### Mixin-Deep ([github](https://github.com/jonschlinkert/mixin-deep))

Because pollinate allows for data to be provided by both sides of the equation
it needs an elegant solution to combine objects. `mixin-deep` is a sane and
simple approach to this process with does not fuddle things up by trying to do
things like flattening arrays.  The creator @jonschlinkert has introduced
countless quality open-source projects and cares deeply about them.

## The Future

Node.js is by far the best medium to use if your goal is to cater to an
audience that includes "front-end" and "back-end" developers. It ensures that
you get feedback from a wide range of people to help shape the project into
what it needs to be.  Eventually the pattern will be better distilled and it
may make sense to rebuild in something like GO or Rust.  The ultimate goal of
Pollinate is to be a pattern that systems can be built around.  If it can be
made to run as efficiently as possible down the road... why not! It would
likely involve porting all the "Parts" as well, but those patterns could
surely benefit any other community.
