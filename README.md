# pico-test
An incredibly tiny javascript testing library. Heavily inspired by the wonderful [ava](https://github.com/avajs/ava) and [tape](https://github.com/substack/tape).


## Contents

- [Usage](#usage)
- [CLI Usage](#cli)
- [Debugging](#debugging)
- [Reporters](#reporters)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [API](#api)
- [Assertions](#assertions)
- [Snapshot testing](#snapshot-testing)
- [Tips](#tips)
- [FAQ](#faq)
- [Recipes](#recipes)
- [Support](#support)
- [Related](#related)
- [Links](#links)
- [Team](#team)

## Why `pico-test`
- Incredibly small
  - *Core Library*: 100 lines
  - *CLI*: 100 lines
  - *Reporters*: 50, 25, 15 lines (verbose, mini, TAP)



### Test Syntax
```js
const test = require('pico-test');

test('testing addition', (t)=>{
	t.is(3 + 4, 7);
});

test('something something', (t)=>{
	return request(api_url)
		.then((result)=>{
			t.is(result, {code : 200, body : { ok : true }});
		});
});

module.exports = test;
```

### install

```
$ npm install --save-dev pico-test
```

`package.json`
```
{
	"name": "smashing-project",
	"scripts": {
		"test": "pico-test"
	},
	"pico-test": {
		//configs here
	},
	"devDependencies": {
		"pico-test": "^0.20.0"
	}
}
```

## reporters

### mini

### verbose

### TAP



## opts
- Fail fast
- output tap
- add require hook
- file globs
-


### `lib.js`

`lib.createTestCase(msg, testFunc, [opts])`

Create a new


## API

### Assertion

The testing function provided to a test case will be executed with `pico-test`'s assertion object as it's first and only parameter. `pico-test`s assertion object is just an extension of node's built-in [assert](https://nodejs.org/api/assert.html). It extends it with three functions.

* `t.pass([msg])` - Always passes. Alias for `t.ok(true, [msg])`
* `t.is(actual, expected, [msg])` - Intelligently chooses between `t.equal` or `t.deepEqual` based on the type of `expected`.
* `t.not(actual, expected, [msg])` - Intelligently chooses between `t.notEqual` or `t.notDeepEqual` based on the type of `expected`.

*usage*
```js
const test = require('pico-test');

test('Making sure addition works', (t)=>{
	(complexCondition ? t.pass() : t.fail())
	t.is(3 + 4, 7);
	t.is({a : 6}, {a:6});
});
```



### Test

opts: skip, todo, only,

make
group
