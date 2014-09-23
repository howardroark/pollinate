# Pollinate

Think of a tree of files as a flower and a JSON endpoint as pollen; combined
together they create a fertilized project. Pollinate will allow you to template
a set of files and store them on GitHub.  When you decide to use them later
you can seed them with an object of data.

- [The Why](#the-why)
- [The Details](#the-details)
- [The Example](#the-example)
- [The Guts](#the-guts)
- [The Future](#the-future)

## The Why

In order to better understand the value of this endeavor, we will answer the
three questions of [The Coder's Catechism](https://github.com/codingcoop/coders-catechism).

#### What pre-existing ideas does this project build upon?

It is becoming increasingly popular to assemble templates that act as a
boilerplate of best practices for kicking off new projects. This process ensures
that the best patterns can emerge and win out over time. A common way of
achieving this goal is to distill a set of files that are then later copied and
adjusted. At times this can be a tedious task and introduce unforseen
complications.

Amazing tools like [Yoeman](http://yeoman.io/) have emerged to help reduce
these complications and allow for more customization. While Yoeman is powerful
it requires that its [generators](http://yeoman.io/authoring/)(templates) be
built a lot like an application. It also requires the need to submit content to
[NPM](https://www.npmjs.org/), rather than just living on GitHub. This is not
always ideal for a fast pace of iteration.

#### What immediate benefits will this project offer today?

Pollinate is designed to be a simple pattern that can be easily understood. It
will allow you to treat your project templates much like you would HTML
templates within an application. You can design a JSON schema that makes sense
for how you and your teams work. Perhaps you always want to seed a Vagrantfile
with the "box" you intend to work with, or you just want a title placed in a
default HTML template. It makes little difference because ultimately it is just
a set of files that are being adjusted.

Keeping your templates on GitHub allows you to open-source them and evolve them
with the aid of the greater community. The ability to source data from a JSON
endpoint allows you to tie together existing APIs so that kicking off projects
can be a more streamlined process. Or you can just keep your data as a local
file that you tweak each time, at least all the values are in one place.

#### What impacts could this project have down the road?

Pollinate allows for services to be built which tie together the APIs of other
services. It would easy to concieve of a service leveraged the GitHub API and
offered an interface to choose a template while filling out some important
details. From there the service could run the Pollinate code and create the
user a brand new repository with the output.

## The Breakdown

Ultimately Pollinate is broken down into three main components. The template
which holds all of the files, the endpoint which supplies user configuration
and the data which defines the outcome. Both the template and the endpoint can
supply the data, but the data supplied by the endpoint holds precedence when
merged.

#### The Flower

The Flower is a GitHub repository that holds all of the files.  Any file can
contain template tags that will later be filled in with values. Pollinate uses
[Nunjucks](http://mozilla.github.io/nunjucks/) as its template engine.
Nunjucks is a JavaScript clone of [Jinja](http://jinja.pocoo.org/), which
encourages templates to be sandboxed and easy to read. This ensures that the
JSON schema is well designed and easy to understand. It also allows
Pollinate to be attrative to people outside of the JavaScript community.
The Flower has the option of supplying its own default data at the root of the
template as JSON (flower.json) or [HJSON](http://laktak.github.io/hjson/)
(flower.hjson), which is a more human editable superset of JSON. The Flower can
also be supplied as a local file path for easier testing.

#### The Pollen

The Pollen is pretty much just a vessel to get the data to the Flower. Much like
how pollen works in nature. It can be supplied as an HTTP JSON endpoint or as a
local file.

#### The Data

Consider the data to be more like the DNA of the operation. Both sides can
supply it, but the data from the Pollen takes precedence when merging the
objects. The data supplies a list of files to act upon with the template engine
along with the data to inject. The data can also supply file operations to move
or delete files during the process.

## A Practical Example

Suppose you have a Git repo with all your files laid out in the way you
like to start off a new Node.js site.  In that template you have a few
files where you want to fill in some details and a few files that you want
to move around.  You build yourself a simple service that converts a form
into a JSON object and offer it up via a unique hash.

```
pollinate codingcoop/meanstack https://details.io/1bdDlXc
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
  details: {
    # A computer safe name (always used to name the parent folder)
    name: newproject
    box_name: precise64
    box_url: http://files.vagrantup.com/precise64.box
  }
  files: {
    cleanup: [
      README.md
    ]
    parse: [
      PROJECT-README
    ]
    move: [
     { PROJECT-README: README.md }
     { app: {{details.name}} }
    ]
  }
}
```

##### The JSON supplied by the `Pollen`

```
{
  "data": {
    "name": "codingcoop",
    "box_name": "trusty64",
    "box_url": "http://files.vagrantup.com/trusty64.box"
  },
  "files": {
    "parse": [
      "Vagrantfile",
      "PROJECT-README"
    ]
  }
}
```

##### The resulting JSON

```
{
  "data": {
    "name": "codingcoop",
    "box_name": "trusty64",
    "box_url": "http://files.vagrantup.com/trusty64.box"
  },
  "files": {
    "cleanup": [
      "README.md"
    ],
    "parse": [
      "Vagrantfile",
      "PROJECT-README"
    ],
    move: [
     { "PROJECT-README": "README.md" }
     { "app": "codingcoop" }
    ]
  }
}
```

##### The resulting file tree

```
.
└── codingcoop
   ├── README.md
   ├── Vagrantfile
   ├── codingcoop
   ...
   ├── bower.json
   ├── gruntfile.js
   ├── package.json
   ├── public
   ...
   └── salt
   ...
```

#### Run `vagrant up` and you are done!

## The Guts

Pollinate is built on top of the following projects. Each project has been
carefully chosen to ensure maintainability.

#### Duo Pacakge

#### Nunjucks

#### Commander

#### HJSON

## The Future
