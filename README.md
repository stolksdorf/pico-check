# pico-check ✅
An incredibly tiny javascript testing library. Heavily inspired by the wonderful [ava](https://github.com/avajs/ava) and [tape](https://github.com/substack/tape).


## Contents
- [Test Syntax](#test-syntax])
- [Usage](#usage])
- [CLI](#cLI])
- [Reporters](#reporters])
- [Assertion](#assertion])
- [TODO](#todo])
- [Ideas](#ideas])


## Test Syntax
```js
const test = require('pico-check');

test('testing addition', (t)=>{
	t.is(3 + 4, 7);
});

test.group('async tests', (test)=>{
	test('promise check', (t)=>{
		return request(api_url)
			.then((result)=>{
				t.is(result, {code : 200, body : { ok : true }});
			});
	});

	test('async/await', async (t)=>{
		const bar = Promise.resolve('bar');
		t.is(await bar, 'bar');
	});
});

test.skip('skipped test', (t)=>t.fail());

module.exports = test;
```

## Usage

### install

```console
$ npm install --save-dev pico-check
```

`package.json`
```
{
	"name": "smashing-project",
	"scripts": {
		"test": "pico-check"
	},
	"pico-check": {
		//configs here
	},
	"devDependencies": {
		"pico-check": "^1.0.0"
	}
}
```

### test files

Create a file named `basic.test.js` in your project's `/tests` directory:

```js
const test = require('pico-check');

test('testing addition', (t)=>{
	t.is(3 + 4, 7);
});

module.exports = test;
```

### Run it

```console
$ npm test
```


## CLI

```console
$ pico-check --help

  Usage: pico-check [options] <test files...>

  Options:
    -v --verbose        use the verbose reporter
    -t --tap            use the TAP reporter
    -w --watch          enable watching
    -i --ignore [path]  paths to ignore
    --timeout [value]   default timeout for async tests
    --reporter [path]   path to custom reporter
    --require [path]    path to extra modules to require before tests are ran
    --source [path]     paths to files to watch
    -h, --help          output usage information

  Examples:
    pico-check
    pico-check -w tests/test3.js tests/test4.js
    pico-check --require babel-register tests/ui-*.jsx
```

## Reporters

### mini reporter
`//TODO: add gif`

### verbose reporter
`//TODO: add gif`

### TAP reporter
`pico-check` supports the [TAP format](https://testanything.org/) and will work with [any TAP reporter](https://testanything.org/consumers.html#javascript)

### Custom reporters
You can create your own reporters ... TODO


## Assertion
The testing function provided to a test case will be executed with `pico-check`'s assertion object as it's first and only parameter. `pico-check`s assertion object is just an extension of node's built-in [assert](https://nodejs.org/api/assert.html).

*Common Assertions*
- *`t.pass([msg])/t.fail([msg])`* - Passes/fails a test case with an optional message
- *`t.ok/t.no(actual, [msg])`* - Verifies that `actual` is truthy/falsey
- *`t.is/t.not(actual, expected, [msg])`* - Intelligently chooses between `assert.equal`/`assert.notEqual` or `assert.deepEqual`/`assert.notDeepEqual` based on the type of `expected` and `actual`.

```js
const test = require('pico-check');

test('Various assertions', (t)=>{
	(complexCondition ? t.pass() : t.fail('The complex condition failed'))
	t.not(3 + 4, 8);
	t.is({a : 6}, {a:6});
	t.no(shallNotPass, 'You must be a balrog');
});
```


## TODO

### Configuration

### Clean Stack Traces

### Groups

### Only & Skipping
Chaining

### Watching

### Async tests

### Before & after hooks

### JSX support


## Ideas

### `t.log()`

### [Power Assert](https://github.com/power-assert-js/power-assert)

