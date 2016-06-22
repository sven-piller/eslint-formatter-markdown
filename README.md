# markdown-reporter
Markdown reporter for eslint

## Install

```bash
$ npm install --save-dev eslint-formatter-markdown
```


## Getting started

Use it with:

#### ESLint CLI

```bash
eslint --format node_modules/eslint-formatter-markdown/markdown.js file.js
```

#### [grunt-eslint](https://github.com/sindresorhus/grunt-eslint/)

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

## Tests

  npm test

At the moment the tests are not working or missing.

## Contributing

Feel free to contribute!

## Release History

* 0.1.0 Initial release


## License

[MIT](http://opensource.org/licenses/MIT) © Sven Piller
