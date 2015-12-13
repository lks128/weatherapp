module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    //browsers: ['Safari', 'Chrome'],
    browsers: ['Chrome'],
    reporters: 'spec',
    files: [
      'src/test/javascript/*.js'
    ],
    preprocessors: {
      'src/test/javascript/*.js' : ['webpack']
    },
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-safari-launcher'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter')
    ]
  });
};
