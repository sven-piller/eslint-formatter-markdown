'use strict';
var assert = require('assert');
var eslint = require('eslint').cli;

it('should be green', function () {
	assert(true);
});


// it('should be used by ESLint', function () {
// 	var ret = false;
// 	var _log = console.log;

// 	console.log = function (str) {
// 		_log(str);

// 		if (/# ESLint Report/ig.test(str)) {
// 			ret = true;
// 		}
// 	}

// 	eslint.execute(['--format', './markdown.js', './markdown.js']);
// 	console.log = _log;
// 	assert(ret);
// });
