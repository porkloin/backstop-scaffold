/* Quick guide to BackstopJS commands

  1. Creates a reference for the "dev" environment to be tested against, using the "test" environment as a basis.
    backstop reference --configPath=backstop.js --envsFile=envs.js --pathFile=paths.js --env=dev --refHost=test

 2. Tests the "dev" environment against the "dev" reference images, using the dev website as the host to take screenshots against.
    backstop test --configPath=backstop.js --envsFile=envs.js --pathFile=paths --env=dev --testHost=dev

*/

var args = require('minimist')(process.argv.slice(2)); // grabs the process arguments
var defaultPaths = ['/']; // default path just checks the homepage as a quick smoke test
var defaultEnvironments = {
  'prod': 'http://www.hook42.com',
  'test': 'http://test-hook42.pantheonsite.io',
  'dev': 'http://dev-hook42.pantheonsite.io'
}
var scenarios = []; // The array that'll have the URL paths to check - populated from file defined at argument --pathFile
var environments;

// env argument will capture the environment URL
// if you use one of the options below to pass in, e.g. --env=dev
if (args.envsFile) {
  var envsConfig = require('./'+args.envsFile);
  environments = envsConfig.environments;
}
else {
  environments = defaultEnvironments;
}
var default_environment = 'prod';
console.log(environments);

// Environments that are being compared
if (!args.env) {
  args.env = default_environment;
}
// if you pass in a bogus environment, it’ll still use the default environment
else if (!environments.hasOwnProperty(args.env)) {
  args.env = default_environment;
}

// Site for reference screenshots
if (args.refHost) {
  args.refHost = environments[args.refHost]
}
else {
  args.refHost = environments[args.env];
}

// Site for test screenshots
if (args.testHost) {
  args.testHost =  environments[args.testHost];
}
else {
  args.testHost = environments[args.env];
}

// Directories to save screenshots
var saveDirectories = {
  "bitmaps_reference": "./backstop_data/"+args.env+"_reference",
  "bitmaps_test": "./backstop_data/"+args.env+"_test",
  "html_report": "./backstop_data/"+args.env+"_html_report",
  "ci_report": "./backstop_data/"+args.env+"_ci_report"
};

// Work out which paths to use: an array from a file, a supplied array, or defaults
// We'll be using the array from paths.js
if (args.pathFile) {
  var pathConfig = require('./'+args.pathFile); // use paths.js file
  var paths = pathConfig.array;
} else if (args.paths) {
  pathString = args.paths; // pass in a comma-separated list of paths in terminal
  var paths = pathString.split(',');
} else {
  var paths = defaultPaths; // keep with the default of just the homepage
}

// Scenarios are a default part of config for BackstopJS
// Explanations for the sections below are at https://www.npmjs.com/package/backstopjs
for (var k = 0; k < paths.length; k++) {
  scenarios.push (
    {
      "label": paths[k],
      "referenceUrl": args.refHost+paths[k],
      "url": args.testHost+paths[k],
      "hideSelectors": [],
      "removeSelectors": [],
      "selectors": ["document"], // "document" will snapshot the entire page
      "delay": 1000,
      "misMatchThreshold" : 0.1
    }
  );
}

// BackstopJS configuration
module.exports =
{
  "id": "project_"+args.env+"_config",
  "viewports": [
    {
      "name": "desktop",
      "width": 1600,
      "height": 2000
    },
    {
      "name": "mobile",
      "width": 375,
      "height": 2000
    }
  ],
  "scenarios":
    scenarios,
  "paths":
    saveDirectories,
  "engine": "puppeteer", // alternate can be slimerjs
  "report": ["browser"],
  "debug": false
};
