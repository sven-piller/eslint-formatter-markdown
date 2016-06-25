'use strict';

/* eslint-env mocha */
/* eslint func-names: 0, curly: 0*/
var assert = require('chai').assert;
var CLIEngine = require('eslint').CLIEngine;
var fs = require('fs');
var path = require('path');

var dir = {
  fixtures: path.join(__dirname, '/fixtures'),
  formatter: path.join(__dirname, '../markdown.js')
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

  });
});

context('Formatter tests', function () {
  describe('Loading formatters', function () {
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
});
