# Backstop Scaffold

This repo serves as a basis for building multi-environment BackstopJS testing dynamically.

## Prerequisites

The entire test infrastructure is built around [BackstopJS](https://github.com/garris/BackstopJS). It is included here as a local NPM package, but having it installed globally will help us a lot:

`npm install -g backstopjs`

Next, we need to install all the dependencies of our test framework:

`npm install`

## Configuration files

Two files need to be edited by the user before running tests - `envs.js`, and `paths.js`.

Follow the template for each:

### `envs.js`

This file should contain a keyed JS object with matching values for website environments (dev, test, prod, etc.), i.e.:

```
envsConfig.environments = {
  'prod': 'http://www.hook42.com',
  'test': 'http://test-hook42.pantheonsite.io',
  'dev': 'http://dev-hook42.pantheonsite.io'
}
```

### `paths.js`

This file should contain a JS array of relative paths, i.e.:

```
pathConfig.array = [
  '/',
  '/contact'
]
```


## Running tests

BackstopJS has three steps in a standard workflow:

- *Reference* takes a set of screenshots to use as the basis for comparison in the test step.
- *Test* takes a new set of screenshots and runs an image diff for each "scenario" (route/path) against the _reference_ set.
- *Report* renders a visual report in the browser. This will open automatically when the _test_ step is completed.

## Examples:

- *Reference*: `backstop reference --configPath=backstop.js --envsFile=envs.js --pathFile=paths.js --env=dev --refHost=test`

    *Note* the above command creates a new Backstop test group for the _DEV_ report, and creates a set of reference images to test against from the _TEST_ environment. This means that despite our report group being for _DEV_, we are testing _against_ the _TEST_ environment.

- *Test*: `backstop test --configPath=backstop.js --envsFile=envs.js --pathFile=paths.js --env=dev --testHost=dev`

    *Note* the above command runs a Backstop test on the _DEV_ report using the _DEV_ website as a basis for the new screenshots. These will be compared to whatever _reference_ images we have created previously (i.e. against _TEST_ from our last command)

## Sharing Test results with team members:

Tests tend to be rather large artifacts because there are so many images. Yet, a user might often want to share the report they're seeing with a fellow team member. We can do that by combining Backstop's `backstop remote` command with the lightweight local sharing tool called [Localtunnel](https://github.com/localtunnel/localtunnel).

Unfortunately this process is kind of hacked together at the moment, but it is far easier than pushing gigabytes worth of screenshots around!

First, install localtunnel:

`npm install -g localtunnel`

Then, start our local Backstop remote service. From the root of our test project (i.e. /home/porkloin/backstop-scaffold), run the following command:

`backstop remote --configPath=backstop.js`

In another terminal (sorry, there's no workaround for this at the moment), run the localtunnel command:

`lt --port 3000`

Localtunnel will return a unique URL for your current tunnel, such as `https://wise-hound-82.localtunnel.me`.

Reports are at a relative route from that localtunnel address depending on the environment we want to see reports for. In the case of an environment called _DEV_, our URL would be:

`https://wise-hound-82.localtunnel.me/backstop-scaffold/backstop_data/dev_html_report/index.html`

Note the section `/dev_html_report`. If our environment was called _FOO_ we would use that route path as `/foo_html_report`.
