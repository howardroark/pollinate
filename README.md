# Pollinate

Think of a tree of files as a flower and a JSON endpoint as pollen; combined
together they create a fertilized project. Pollinate will allow you to template 
a set of files and store them on GitHub.  When you decide to use them later
you can seed them with an object of data.

In order to better understand the value of this endeavor, we will answer the
three questions of [The Coder's Catechism](https://github.com/codingcoop/coders-catechism).

### What existing ideas or patterns does this project build upon?

It is becoming increasingly popular to assemble templates that act as boilerplate
of best practices for kicking off new projects.  This process ensures that patterns
can emerge and win out over time.

### What problems will this project immediately solve?

### What are the potential future uses of this project?



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



### What are the risks and the payoffs?

No risks. The payoff would be an evolving eco-system of popular combinations of
tools. The popular Node.js `MEANstack` is evidence that there is an appetite for
these things.
