/**
 * In current directory run
 * protractor protractor.conf.js
 * Or
 * In Parent directory run
 * protractor test/e2e/protractor.conf.js
 */

'use strict';
exports.config = {

  //framework: 'jasmine2',

  // The address of a running selenium server.
  directConnect: true,

  seleniumServerJar: '../../node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar',

  seleniumPort: 4444,

  // URL of the app you want to test.
  baseUrl: 'http://localhost:9001/',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome'
    ,
    'chromeOptions': {
      args: ['--test-type']
    }
  },


  // Use browser.params in order to access to these parameters.
  params: {
    url: {
      baseURL: 'http://localhost:9001/',
      testURL: 'http://localhost:9001/index.html'
    }
  },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    defaultTimeoutInterval: 60000,
    includeStackTrace: true
  },

  onPrepare: function () {
    // Override the timeout for webdriver.
    browser.manage().timeouts().setScriptTimeout(60000);

    // Add a screenshot reporter and store screenshots to '/test/e2e/reports':
    var HtmlReporter = require('protractor-html-screenshot-reporter');
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'e2e-report'
      , takeScreenShotsOnlyForFailedSpecs: true
    }));
  },

  specs: ['test/e2e/basicflow/basic.js']

};
