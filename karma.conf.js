// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    preprocessors: {
      'app/scripts/**/*.html': ['ng-html2js'],
      'app/scripts/**/*.js': ['coverage']
    },

    ngHtml2JsPreprocessor: {
      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      stripPrefix: 'app/',
      moduleName: 'templates'

    },

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/purl/purl.js',
      'app/bower_components/lodash/dist/lodash.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
      'app/bower_components/moment/moment.js',
      'app/bower_components/moment-timezone/moment-timezone.js',
      'app/bower_components/jquery/jquery.js',
      'app/bower_components/jquery-cookie/jquery.cookie.js',
      'app/scripts/**/*.js',
      'test/spec/**/*.js',
      'app/scripts/**/*.html'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    //browsers: ['Chrome'],
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    // Extends the inactivity timeout.
    // http://stackoverflow.com/questions/24119506/karma-jasmine-times-out-without-running-tests
    browserNoActivityTimeout: 100000
  });
};
