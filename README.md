# Pollinate

Think of a set of files as a flower and a source of data as pollen; combined
together they create a fertilized project seed. Pollinate aims to be a command
line tool that allows you to combine files and data using a template engine and
a set of file operations.

In order to better understand the value of this endeavor, we will answer the
three questions of [The Coder's Catechism](https://github.com/codingcoop/coders-catechism).

### What existing ideas or patterns does this project build upon?

### What problems will this project immediately solve?

### What are the potential future uses of this project?






## The idea stage

This project is inspired by earlier work on a project called
[StackStrap](https://github.com/freesurface/stackstrap). It has became clear
that this project is trying to be too many things and that the CLI can be it's
own evolving piece. As of right now this project is little more than an idea
and some scrappy code.

If there is truly a role for this tool in the greater community it will mature.
Early development will tap into the large and vibrant Node.js community, but
as it matures it may make sense to rewite in something more low-level like GO.

> **[Heilmeier's Catechism](http://en.wikipedia.org/wiki/George_H._Heilmeier#Heilmeier.27s_Catechism)**
> A set of questions credited to Heilmeier that anyone proposing a research
> project or product development effort should be able to answer.

### What are you trying to do?

Enable developers with a super simple way to template project setups and evolve
them over time. Ensure that Git is a central part of the process and enable data
to be supplied by a remote service. Seperation of files as a Git repository will
allow people to focus on how they organize and operate different setups. Pairing
the files with data as a remote service will enable people to create and evolve
intuitive ways of kicking off projects. Ultimately the goal is to enable new
developers to get off on the right foot with the aid of the greater community.

#### The Flower

Whether it's a `Vagrantfile`, `Gruntfile` or a `Salt` configurtion, everyone has
an opinion. Patterns emerge all the the time in the open-source world, be it how
projects are laid out or the combinations of tools to use. With the state of
open-source virtualization and automation tools a full operational setup becomes
little more than a set of files in a Git repository. The conversation becomes
the nature of those files and how they all cooperate. It makes perfect sense to
evolve these relationships in Git.

#### The Pollen

Be it a Git url, project name or domain, all of this data needs to find a way
into project files when things kick off. Modern projects end up using a plethora
of third party services which need configurtion within the files. As the list
of data points grows it becomes less and less easy to just copy the last project
worked on and clean it up for the next venture. Given that virtually all third
party services like GitHub have APIs it only makes sense that you would end up
building a UI to take care of setting up the details. This project wants to
encourage that process.

#### The Data

Consider the data as the DNA. It should have the option of being supplied as
both `YAML` for manual usage and `JSON` for more automated scenarios. It would
be divided into information about how to organize the files when parsing and
the content which would be handed to the template engine. The data would always
be the common ground between the `Flower` and the `Pollen`. The `Flower` itself
would have the option of supplying a `flower.json` or `flower.yml` file to
provide defaults. For instance you many always want to ditch the repo's
`README.md` to swap place with a `README-TEMPLATE.md` file which is parsed by
the template engine. It also makes sense that certain data points be required,
like a computer safe `name` value that can be used to name folders and users.

#### Usage examples

Maybe you have a favourite way to run Django for your clients and you have
isolated the common variances to a small YAML file that you edit each time.

```
pollinate ./django-files ~/quickly-edited-details.yml
```

Maybe all you really want to do is move around some of the files from their
original state and have a "name" to seed within. It would be wise to have a
few default CLI options that could be supplied rather than a data object.
Having an option like `--name` is a good idea since it is already a default
requirement.

```
pollinate ./flask-files --name="mynewthing"
```

Maybe your team has a favourite way that they like to build out Node.js apps
and you have built a clever little UI to kick-off new projects the way you
like them. The UI could just spit out a command to paste into their terminal.

```
pollinate git@github.com:team/MEAN-flower.git https://project-details/endpoint/json
```

Maybe you built a complete service that leverages GitHub's API and OAuth to
create custom Jekyll sites for bloggin. A user would simply connect with
their GitHub account and supply some options. From there Pollinate would build
the files and the servce would make the user a new repository.

```
pollinate git@github.com:howardroark/jekyll-flower.git /tmp/userX-details.json
```

### How is it done today, and what are the limits of current practice?

There are many tools today that allow people to scaffold new projects. The most
appropriate example would be [Yoeman](http://yeoman.io/), which is an excellent
tool. It enables developers to build out interactive scaffolding procedures
called `generators`. Quality generators layout common combinations of tools
and intelligently account for the variances that may be desired. Developers
running generators will make decisions about how to arrange their project as
they run the generator.

This can be problematic for newer developers or those new to open-source.
Generally you would need to be concious of not only the tools involved, but also
how they cooperate. Another issue is that generators themselves can end up
being complex programs that may become difficult to contribute to.

Pollinate ensures that `Flower` templates are little more than a spread of
files in a Git repository with a very clear purpose. Most developers are
familiar with the concept of templating engines and the process becomes
easy to grok for newcomers. Having a default `flower.json` file will ensure
that developers can follow along and understand the dynamics of the `Flower`.
It is also assumed that `Flower` templates will make use of `Vagrant` and
provisioning tools to ready development environments for users. The idea is
the people can be up and running with ease to discover new workflows. In fact
it is likely that many `Flower` templates would end up installing Yoeman
generators which could adjust the project after the fact.

### What's new in your approach and why do you think it will be successful?

There are so many developers who want to jump into the eco-system of
open-source, but can't find the time to get past the hurdles of setting things
up. A huge number of developers began learning as front-end developers and
are comfortable with the ease of PHP setups. As well there are many developers
who are deeply tied to .NET and Java frameworks which are deeply integrated
with complex IDEs. Both groups of people need to be eased into utilizing the
Linux eco-system. Pollinate aims to be easy to understand and therefore
attractive to a larger audience.

### Who cares?

Advertising agencies, marketing agencies, Java shops, .NET shops... anything
that kicked off during the dotcom boom and has not evolved much since.

### If you're successful, what difference will it make?

Catering to this massive group of developers will cause setups and workflows to
start evolving at a much faster pace. People are inherently creative and a lot
can be accomplished when the barriers are lowered. It also will encourage
the narrtive surrounding open-source to find it's way into more organizations.

### What are the risks and the payoffs?

No risks. The payoff would be an evolving eco-system of popular combinations of
tools. The popular Node.js `MEANstack` is evidence that there is an appetite for
these things.

### How much will it cost?

Zero!

### How long will it take?

Depends.

### What are the midterm and final "exams" to check for success?

If people actually use it, that is the success.
