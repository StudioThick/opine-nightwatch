var gulp = require('gulp');
var opine = require('gulp-opine');
var gutil = require('gulp-util');
var webdriver = require('gulp-webdriver');
var del = require('del');
var module = opine.module('browsertest');
var minimist = require('minimist');

var knownOptions = {
  string: 'cap',
  default: { cap: 'ie' }
};

var options = minimist(process.argv.slice(2), knownOptions);

module.task(function() {

  gutil.log('Loading browsers stack access details');

  var browserstackConfig = module.getConfig('browserstack', {
    'username': process.env.BROWSERSTACK_USERNAME,
    'accesskey': process.env.BROWSERSTACK_ACCESS_KEY
  });

  process.env.BROWSERSTACK_USERNAME = browserstackConfig.username;
  process.env.BROWSERSTACK_ACCESS_KEY = browserstackConfig.accesskey;

  gutil.log('Loading browsers capabilities');

  var wdioConfig = module.getConfig('wdio', {});
  var capabilities = wdioConfig.capabilities;
  if(options.cap) {
    // leave in capabilitied only selected
    capabilities = capabilities.filter(function(obj){
      return obj.browserName === options.cap;
    });
  }

  process.env.WDIO_CAPABILITIES = JSON.stringify(capabilities);

  gutil.log(
    'Usgin browsersstack user',
    gutil.colors.magenta(browserstackConfig.username)
  );

  gutil.log('Clean output folder');
  del.sync(module.getConfig('outputPath', './test/output'));

  return gulp.src('wdio.conf.js').pipe(webdriver(wdioConfig));

});

// // It integrates with screenshots api.
// gulp.task('browsertest-screenshots', [], function(done) {
// });
