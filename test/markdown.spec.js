'use strict';

/* eslint-env mocha */
/* eslint func-names: 0, curly: 0*/
var assert = require('chai').assert;
var CLIEngine = require('eslint').CLIEngine;
var fs = require('fs');
var path = require('path');

var dir = {
  fixtures: path.join(__dirname, '/fixtures'),
  formatter: path.join(__dirname, '../markdown.js'),
  green: 'green_file.js',
  yellow: 'yellow_file.js',
  red: 'red_file.js',
  orange: 'orange_file.js'
};

var engine = null;
var formatter = null;
var report = null;
var output = null;

/**
 * Test an given input against given string
 *
 * @param {string}  haystack        input string
 * @param {string}  needle          search string
 * @param {boolean} expectedResult  should it match
 * @param {int}     [expectedCount] how often should it match
 */
function testRegex(haystack, needle, expectedResult, expectedCount) {
  var ret = false;
  var regStr = new RegExp(needle, 'g');
  if (regStr.test(haystack)) {
    ret = true;
  }
  assert.equal(ret, expectedResult, needle);
  if (!isNaN(expectedCount)) {
    var count = (haystack.match(regStr) || []).length;
    assert.strictEqual(count, expectedCount, needle + ' Count');
  }
}

context('Init', function () {
  describe('Self test', function () {
    it('assert true', function () {
      assert(true);
    });

    it('testRegex - match', function () {
      testRegex('ABCDE', 'BCD', true);
      testRegex('ABCDE', 'BDC', false);
    });

    it('testRegex - count', function () {
      testRegex('ABCDEABCDE', 'BCD', true, 2);
      testRegex('ABCDEABCDE', 'BCDEA', true, 1);
      testRegex('ABCDEABCDE', 'H', false, 0);
    });
  });

  describe('All necessary fixture files exist', function () {
    it('green_file.js exists', function (done) {
      fs.readdir(dir.fixtures, function (err, files) {
        if (err) throw err;
        assert(files.indexOf(dir.green) !== -1);
        done();
      });
    });

    it('yellow_file.js exists', function (done) {
      fs.readdir(dir.fixtures, function (err, files) {
        if (err) throw err;
        assert(files.indexOf(dir.yellow) !== -1);
        done();
      });
    });

    it('red_file.js exists', function (done) {
      fs.readdir(dir.fixtures, function (err, files) {
        if (err) throw err;
        assert(files.indexOf(dir.red) !== -1);
        done();
      });
    });

    it('orange_file.js exists', function (done) {
      fs.readdir(dir.fixtures, function (err, files) {
        if (err) throw err;
        assert(files.indexOf(dir.orange) !== -1);
        done();
      });
    });
  });

  describe('Formatter tests', function () {
    it('load "compact" formatter (buildin)', function () {
      var engine1 = new CLIEngine();
      var formatter1 = engine1.getFormatter('compact');
      assert.isFunction(formatter1);
    });

    it('load "markdown" formatter (own)', function () {
      var engine2 = new CLIEngine();
      var formatter2 = engine2.getFormatter(dir.formatter);
      assert.isFunction(formatter2);
    });
  });
});

context('File tests', function () {
  before(function (done) {
    engine = new CLIEngine();
    formatter = engine.getFormatter(dir.formatter);
    done();
  });

  after(function (done) {
    engine = null;
    formatter = null;
    done();
  });

  describe('Testing green_file.js', function () {
    before(function (done) {
      report = engine.executeOnFiles([path.join(dir.fixtures, dir.green)]);
      output = formatter(report.results);
      done();
    });

    after(function (done) {
      report = null;
      output = null;
      done();
    });

    it('should have processed one files', function () {
      testRegex(output, '_file.js', true, 1);
    });

    it('should have no error messages', function () {
      assert.strictEqual(report.errorCount, 0);
      testRegex(output, '```Error```', false, 0);
    });

    it('should have no warning messages', function () {
      assert.strictEqual(report.warningCount, 0);
      testRegex(output, '```Warning```', false, 0);
    });

    it('should have correct summary', function () {
      testRegex(output, '# ESLint Report - OK', true);
      testRegex(output, '# ESLint Report - Warning', false);
      testRegex(output, '# ESLint Report - Error', false);
      testRegex(output, '0 problems', true);
    });

    it('should have correct file summary', function () {
      testRegex(output, dir.green + ' - 0 problems', true);
    });

    it('should have no table header', function () {
      testRegex(output, '\\| Type \\| Line \\| Description \\| Rule \\|', false);
      testRegex(output, '\\| --- \\| --- \\| --- \\| --- \\|', false);
    });

    it('should have no trailing whitespace warning', function () {
      testRegex(output, '/no-trailing-spaces', false);
    });

    it('should have no indentation warning', function () {
      testRegex(output, '/indent', false);
    });

    it('should have no quotes error', function () {
      testRegex(output, '/quotes', false);
    });
  });

  describe('Testing yellow_file.js', function () {
    before(function (done) {
      report = engine.executeOnFiles([path.join(dir.fixtures, dir.yellow)]);
      output = formatter(report.results);
      done();
    });

    after(function (done) {
      report = null;
      output = null;
      done();
    });

    it('should have processed one files', function () {
      testRegex(output, '_file.js', true, 1);
    });

    it('should have no error messages', function () {
      assert.strictEqual(report.errorCount, 0);
      testRegex(output, '```Error```', false, 0);
    });

    it('should have warning messages', function () {
      assert.strictEqual(report.warningCount, 3);
      testRegex(output, '```Warning```', true, 3);
    });

    it('should have correct summary', function () {
      testRegex(output, '# ESLint Report - OK', false);
      testRegex(output, '# ESLint Report - Warning', true);
      testRegex(output, '# ESLint Report - Error', false);
      testRegex(output, '3 problems \\(0 errors, 3 warnings\\)', true);
    });

    it('should have correct file summary', function () {
      testRegex(output, dir.yellow + ' - 3 problems \\(0 errors, 3 warnings\\)', true);
    });

    it('should have table header', function () {
      testRegex(output, '\\| Type \\| Line \\| Description \\| Rule \\|', true, 1);
      testRegex(output, '\\| --- \\| --- \\| --- \\| --- \\|', true, 1);
    });

    it('should have trailing whitespace warning', function () {
      testRegex(output, '/no-trailing-spaces', true, 2);
    });

    it('should have indentation warning', function () {
      testRegex(output, '/indent', true, 1);
    });

    it('should have no quotes error', function () {
      testRegex(output, '/quotes', false);
    });
  });

  describe('Testing red_file.js', function () {
    before(function (done) {
      report = engine.executeOnFiles([path.join(dir.fixtures, dir.red)]);
      output = formatter(report.results);
      done();
    });

    after(function (done) {
      report = null;
      output = null;
      done();
    });

    it('should have processed one files', function () {
      testRegex(output, '_file.js', true, 1);
    });

    it('should have error messages', function () {
      assert.strictEqual(report.errorCount, 1);
      testRegex(output, '```Error```', true, 1);
    });

    it('should have no warning messages', function () {
      assert.strictEqual(report.warningCount, 0);
      testRegex(output, '```Warning```', false, 0);
    });

    it('should have correct summary', function () {
      testRegex(output, '# ESLint Report - OK', false);
      testRegex(output, '# ESLint Report - Warning', false);
      testRegex(output, '# ESLint Report - Error', true);
      testRegex(output, '1 problem \\(1 error, 0 warnings\\)', true);
    });

    it('should have correct file summary', function () {
      testRegex(output, dir.red + ' - 1 problem \\(1 error, 0 warnings\\)', true);
    });

    it('should have table header', function () {
      testRegex(output, '\\| Type \\| Line \\| Description \\| Rule \\|', true, 1);
      testRegex(output, '\\| --- \\| --- \\| --- \\| --- \\|', true, 1);
    });

    it('should have no trailing whitespace warning', function () {
      testRegex(output, '/no-trailing-spaces', false);
    });

    it('should have no indentation warning', function () {
      testRegex(output, '/indent', false);
    });

    it('should have quotes error', function () {
      testRegex(output, '/quotes', true, 1);
    });
  });

  describe('Testing orange_file.js (red + yellow)', function () {
    before(function (done) {
      report = engine.executeOnFiles([path.join(dir.fixtures, dir.orange)]);
      output = formatter(report.results);
      done();
    });

    after(function (done) {
      report = null;
      output = null;
      done();
    });

    it('should have processed one files', function () {
      testRegex(output, '_file.js', true, 1);
    });

    it('should have error messages', function () {
      assert.strictEqual(report.errorCount, 1);
      testRegex(output, '```Error```', true, 1);
    });

    it('should have warning messages', function () {
      assert.strictEqual(report.warningCount, 3);
      testRegex(output, '```Warning```', true, 3);
    });

    it('should have correct summary', function () {
      testRegex(output, '# ESLint Report - OK', false);
      testRegex(output, '# ESLint Report - Warning', false);
      testRegex(output, '# ESLint Report - Error', true);
      testRegex(output, '4 problems \\(1 error, 3 warnings\\)', true);
    });

    it('should have correct file summary', function () {
      testRegex(output, dir.orange + ' - 4 problems \\(1 error, 3 warnings\\)', true);
    });

    it('should have table header', function () {
      testRegex(output, '\\| Type \\| Line \\| Description \\| Rule \\|', true, 1);
      testRegex(output, '\\| --- \\| --- \\| --- \\| --- \\|', true, 1);
    });

    it('should have trailing whitespace warning', function () {
      testRegex(output, '/no-trailing-spaces', true, 2);
    });

    it('should have indentation warning', function () {
      testRegex(output, '/indent', true, 1);
    });

    it('should have quotes error', function () {
      testRegex(output, '/quotes', true, 1);
    });
  });

  describe('Testing all files together', function () {
    before(function (done) {
      report = engine.executeOnFiles([
        path.join(dir.fixtures, dir.green),
        path.join(dir.fixtures, dir.yellow),
        path.join(dir.fixtures, dir.red),
        path.join(dir.fixtures, dir.orange)
      ]);
      output = formatter(report.results);
      done();
    });

    after(function (done) {
      report = null;
      output = null;
      done();
    });

    it('should have processed four files', function () {
      testRegex(output, '_file.js', true, 4);
    });

    it('should have error messages', function () {
      assert.strictEqual(report.errorCount, 2);
      testRegex(output, '```Error```', true, 2);
    });

    it('should have warning messages', function () {
      assert.strictEqual(report.warningCount, 6);
      testRegex(output, '```Warning```', true, 6);
    });

    it('should have correct summary', function () {
      testRegex(output, '# ESLint Report - OK', false);
      testRegex(output, '# ESLint Report - Warning', false);
      testRegex(output, '# ESLint Report - Error', true);
      testRegex(output, '8 problems \\(2 errors, 6 warnings\\)', true);
    });

    it('should have correct file summary', function () {
      testRegex(output, dir.green + ' - 0 problems', true);
      testRegex(output, dir.yellow + ' - 3 problems \\(0 errors, 3 warnings\\)', true);
      testRegex(output, dir.red + ' - 1 problem \\(1 error, 0 warnings\\)', true);
      testRegex(output, dir.orange + ' - 4 problems \\(1 error, 3 warnings\\)', true);
    });

    it('should have table header', function () {
      testRegex(output, '\\| Type \\| Line \\| Description \\| Rule \\|', true, 3);
      testRegex(output, '\\| --- \\| --- \\| --- \\| --- \\|', true, 3);
    });

    it('should have trailing whitespace warning', function () {
      testRegex(output, '/no-trailing-spaces', true, 4);
    });

    it('should have indentation warning', function () {
      testRegex(output, '/indent', true, 2);
    });

    it('should have quotes error', function () {
      testRegex(output, '/quotes', true, 2);
    });
  });
});

context('Functionality tests', function () {
  before(function (done) {
    engine = new CLIEngine();
    formatter = engine.getFormatter(dir.formatter);
    done();
  });

  after(function (done) {
    engine = null;
    formatter = null;
    done();
  });

  describe('Testing sorting', function () {
    afterEach(function (done) {
      report = null;
      output = null;
      done();
    });

    it('should have errors first (yellow and red)', function () {
      report = engine.executeOnFiles([
        path.join(dir.fixtures, dir.yellow),
        path.join(dir.fixtures, dir.red)
      ]);
      output = formatter(report.results);
      testRegex(output, '```Error```[^]+?```Warning```', true, 1);
      testRegex(output, '```Warning```[^]+?```Error```', false);
    });

    it('should have errors first (all files)', function () {
      report = engine.executeOnFiles([
        path.join(dir.fixtures, dir.yellow),
        path.join(dir.fixtures, dir.red),
        path.join(dir.fixtures, dir.orange),
        path.join(dir.fixtures, dir.green)
      ]);
      output = formatter(report.results);
      testRegex(output, '```Error```[^]+?```Warning```', true, 1);
      testRegex(output, '```Warning```[^]+?```Error```', false);
    });
  });

  describe('Testing stats', function () {
    afterEach(function (done) {
      report = null;
      output = null;
      done();
    });

    it('should have no warnings and errors (green)', function () {
      report = engine.executeOnFiles([
        path.join(dir.fixtures, dir.green)
      ]);
      output = formatter(report.results);
      testRegex(output, '### Errors', false);
      testRegex(output, '### Warnings', false);
      testRegex(output, '\\| rule \\| count \\| visual \\|', false);
      testRegex(output, '\\| quotes \\| 1 \\| X \\|', false);
      testRegex(output, '\\| no-trailing-spaces \\| 2 \\| XX \\|', false);
      testRegex(output, '\\| indent \\| 1 \\| X \\|', false);
    });

    it('should have warnings (yellow)', function () {
      report = engine.executeOnFiles([
        path.join(dir.fixtures, dir.yellow)
      ]);
      output = formatter(report.results);
      testRegex(output, '### Errors', false);
      testRegex(output, '### Warnings', true, 1);
      testRegex(output, '\\| rule \\| count \\| visual \\|', true, 1);
      testRegex(output, '\\| quotes \\| 1 \\| X \\|', false);
      testRegex(output, '\\| no-trailing-spaces \\| 2 \\| XX \\|', true, 1);
      testRegex(output, '\\| indent \\| 1 \\| X \\|', true, 1);
    });

    it('should have errors (red)', function () {
      report = engine.executeOnFiles([
        path.join(dir.fixtures, dir.red)
      ]);
      output = formatter(report.results);
      testRegex(output, '### Errors', true, 1);
      testRegex(output, '### Warnings', false);
      testRegex(output, '\\| rule \\| count \\| visual \\|', true, 1);
      testRegex(output, '\\| quotes \\| 1 \\| X \\|', true, 1);
      testRegex(output, '\\| no-trailing-spaces \\| 2 \\| XX \\|', false);
      testRegex(output, '\\| indent \\| 1 \\| X \\|', false);
    });

    it('should have errors and warnings (orange)', function () {
      report = engine.executeOnFiles([
        path.join(dir.fixtures, dir.orange)
      ]);
      output = formatter(report.results);
      testRegex(output, '### Errors', true, 1);
      testRegex(output, '### Warnings', true, 1);
      testRegex(output, '\\| rule \\| count \\| visual \\|', true, 2);
      testRegex(output, '\\| quotes \\| 1 \\| X \\|', true, 1);
      testRegex(output, '\\| no-trailing-spaces \\| 2 \\| XX \\|', true, 1);
      testRegex(output, '\\| indent \\| 1 \\| X \\|', true, 1);
    });

    it('should have errors and warnings (all files)', function () {
      report = engine.executeOnFiles([
        path.join(dir.fixtures, dir.yellow),
        path.join(dir.fixtures, dir.red),
        path.join(dir.fixtures, dir.orange),
        path.join(dir.fixtures, dir.green)
      ]);
      output = formatter(report.results);
      testRegex(output, '### Errors', true, 1);
      testRegex(output, '### Warnings', true, 1);
      testRegex(output, '\\| rule \\| count \\| visual \\|', true, 2);
      testRegex(output, '\\| quotes \\| 2 \\| XX \\|', true, 1);
      testRegex(output, '\\| no-trailing-spaces \\| 4 \\| XXXX \\|', true, 1);
      testRegex(output, '\\| indent \\| 2 \\| XX \\|', true, 1);
    });
  });
});
