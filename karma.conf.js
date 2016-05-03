// Karma configuration
// Generated on Tue Apr 21 2015 07:54:10 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'html/includes/bower/angular/angular.js',
      'html/includes/bower/colorbrewer/colorbrewer.js',
      'html/includes/bower/angular-mocks/angular-mocks.js',
      'html/includes/bower/angular-route/angular-route.js',
      'html/includes/bower/angular-ui-bootstrap-bower/ui-bootstrap.js',
      'html/includes/bower/firebase/firebase.js',
      'html/includes/bower/angularfire/dist/angularfire.js',
      'html/includes/bower/angular-leaflet-directive/dist/angular-leaflet-directive.min.js',
      'html/includes/bower/angular-local-storage/dist/angular-local-storage.min.js',
      'html/includes/scripts/ui-utils.js',
      'html/includes/bower/d3/d3.js',
      'html/includes/bower/lodash/lodash.js',
      'html/includes/angular/app.js',
      'html/includes/angular/*.js',
      'karma/**/*[sS]pec.js'
    ],


    // list of files to exclude
    exclude: [
      '**/*.swp'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
