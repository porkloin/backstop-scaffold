var envsConfig = {};

// Fill this array with a comma-separated list of paths.
envsConfig.environments = {
  'prod': 'http://www.hook42.com',
  'test': 'http://test-hook42.pantheonsite.io',
  'dev': 'http://dev-hook42.pantheonsite.io'
}

module.exports = envsConfig;
