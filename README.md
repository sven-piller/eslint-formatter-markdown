# eslint-formatter-markdown

Markdown ESLint formatter (reporter)

[![Build Status](https://travis-ci.org/sven-piller/eslint-formatter-markdown.png?branch=master)](https://travis-ci.org/sven-piller/eslint-formatter-markdown)
[![npm version](https://img.shields.io/npm/v/eslint-formatter-markdown.svg)](https://www.npmjs.com/package/eslint-formatter-markdown)
[![Downloads/month](https://img.shields.io/npm/dm/eslint-formatter-markdown.svg)](https://www.npmjs.com/package/eslint-formatter-markdown)
[![Dependency Status](https://david-dm.org/sven-piller/eslint-formatter-markdown/status.svg)](https://david-dm.org/sven-piller/eslint-formatter-markdown)
[![devDependency Status](https://david-dm.org/sven-piller/eslint-formatter-markdown/dev-status.svg)](https://david-dm.org/sven-piller/eslint-formatter-markdown?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/sven-piller/eslint-formatter-markdown/badge.svg?branch=master)](https://coveralls.io/github/sven-piller/eslint-formatter-markdown?branch=master)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/sven-piller/eslint-formatter-markdown/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/sven-piller/eslint-formatter-markdown.svg?style=plastic)](https://github.com/sven-piller/eslint-formatter-markdown/issues)
[![Greenkeeper badge](https://badges.greenkeeper.io/sven-piller/eslint-formatter-markdown.svg)](https://greenkeeper.io/)

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install eslint-formatter-markdown --save-dev
```

## Getting started

Use it with:

### ESLint CLI

```bash
eslint --format node_modules/eslint-formatter-markdown/markdown.js file.js
```

### [grunt-eslint](https://github.com/sindresorhus/grunt-eslint/)

```js
grunt.initConfig({
	eslint: {
		options: {
			format: require('eslint-formatter-markdown')
		},
		target: ['file.js']
	}
});

grunt.loadNpmTasks('grunt-eslint');
grunt.registerTask('default', ['eslint']);
```

### Example Output (rendered by github)

![Example report](/doc/example_report.png)

## Tests

```sh
npm install
npm test
```

Tested with ESLint@2 under node 0.12 - 6.3.* .

After changing to ESLint@3 tests with node 0.12 are failing because of lambda functions.

## Dependencies

- [lodash](https://github.com/lodash/lodash): Lodash modular utilities.

## Dev Dependencies

- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [coveralls](https://github.com/nickmerwin/node-coveralls): takes json-cov output into stdin and POSTs to coveralls.io.
- [eslint](https://github.com/eslint/eslint): An AST-based pattern checker for JavaScript.
- [istanbul](https://github.com/gotwarlost/istanbul): Yet another JS code coverage tool that computes statement, line, function and branch coverage with module loader hooks to transparently add coverage when running tests. Supports all JS coverage use cases including unit tests, server side functional tests.
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [mocha-lcov-reporter](https://github.com/StevenLooman/mocha-lcov-reporter): LCOV reporter for Mocha

## Contributing

Feel free to contribute!

## Release History

- 1.0.4 Updated Readme and DevDependencies
- 1.0.3 Updated Readme and DevDependencies
- 1.0.2 Updated Readme and DevDependencies
- 1.0.0 Release with Stats in Summary
- 0.11.0 Added Sorting
- 0.10.0 Added Tests
- 0.9.1 Improvements in Documentation, [Issue #2](https://github.com/sven-piller/eslint-formatter-markdown/issues/2)
- 0.9.0 Initial release

## License

[MIT](http://opensource.org/licenses/MIT) © Sven Piller
