# Pollinate

Think of a tree of files as a flower and a JSON endpoint as pollen; combined
together they create a fertilized project. Pollinate will allow you to template
a set of files and store them on GitHub.  When you decide to use them later
you can seed them with an object of data.

In order to better understand the value of this endeavor, we will answer the
three questions of [The Coder's Catechism](https://github.com/codingcoop/coders-catechism).

### What pre-existing ideas does this project build upon?

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

### What immediate benefits will this project offer today?

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

### What impacts could this project have down the road?

Pollinate allows for services to be built which tie together the APIs of other
services. It would easy to concieve of a service leveraged the GitHub API and
offered an interface to choose a template while filling out some important
details. From there the service could run the Pollinate code and create the
user a brand new repository with the output.

#### An example

Suppose you have a Git repo with all your files laid out in the way you
like to start off a new Node.js site.  In that template you have a few
files where you want to fill in some details and a few files that you want
to move around.

```
pollinate codingcoop/meanstack https://details.io/1bdDlXc
```
