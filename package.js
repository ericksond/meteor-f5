Package.describe({
  name: 'ericksond:f5',
  version: '0.0.3',
  summary: 'Meteor package to interface with F5 REST API',
  git: 'https://github.com/ericksond/meteor-f5',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.addFiles('f5.js', 'server');
	api.export('F5');
});

/*
Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ericksond:f5');
  api.addFiles('ericksond:f5-tests.js');
});
*/
