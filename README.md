# ✅ pico-check
An incredibly tiny javascript testing library. Heavily inspired by the wonderful [ava](https://github.com/avajs/ava) and [tape](https://github.com/substack/tape).


### Features
- Test cases are just functions
- Supports sync and async tests
- Provides arming/disarming and timeouts for async tests
- Test cases structured as simple objects and functions
- Easy to write custom reporters based on event emitters
- Supports TAP
- Easily flag a test or group to skip, or only run
- Comes with a file watcher to automatically re-run tests on file changes
- Uses built-in `assert` lib when possible
- No dependacies!




### TODO
- before/after
- parameterized tests
- custom timeouts



## Contents
- [Test Syntax](#test-syntax)
- [Usage](#usage)
- [CLI](#cli)
- [Reporters](#reporters)
- [Assertion](#assertion)
- [Before and After Tests](#lifecycle)



## Test Syntax
```js

// Tests are just functions or objects of functions. If the test passes,
// the function returns nothing, if the test fails the function should throw an error.

const check = require('pico-check');

const results = await check({
  'testing addition' : (t)=>{
    t.is(3 + 4, 7);
  },
  'async tests' : {
    'promise check' : (t)=>{
      return request(api_url)
        .then((result)=>{
          t.is(result, {code : 200, body : { ok : true }});
        });
    },
    'async/await' :  async (t)=>{
      const bar = Promise.resolve('bar');
      t.is(await bar, 'bar');
    }
  },
  '_skipped test' : (t)=>t.fail()
})

console.log(results);

/*
{
  'testing addition': true,
  'async tests': {
    'promise check': AssertionError [ERR_ASSERTION]: Expected values to be loosely deep-equal:
      { code: 404 } should loosely deep-equal { code: 200, body : { ok : true }},
    'async/await': true
  },
  '_skipped test': false
}
*/
```



## Usage

### install

```console
$ npm install --save-dev pico-check
```

### CLI usage
```
{
  "name": "smashing-project",
  "scripts": {
    "test": "pico-check ./tests",
    "test:dev": "pico-check --watch ./tests"
  },
  "devDependencies": {
    "pico-check": "^2.0.0"
  }
}
```


### Library Usage

```js
const check = require('pico-check');
const reporter = require('pico-check/reporters/basic.reporter.js');
const { summary } = require('pico-check/utils');

const testCases = {
  serious_test : (t)=>t.is(3+4, 7),
  _skipped_test : (t)=>t.fail()
}


check(testCases, { emitter : reporter })
  .then((results)=>{
    console.log(results)
    const { failed } = summary(results);
    process.exit(failed === 0 ? 0 : 1);
  })
```



## Reporters
`pico-check` can take an reporter event emitter as a optional parameter. As it executes your test cases it will emit various events that your reporter can react too. `pico-check` comes with a basic reporter, as well as a TAP reporter.

### basic reporter (default)
Prints out all testcases in an easy to read format.


### TAP reporter
`pico-check` supports the [TAP format](https://testanything.org/) and will work with [any TAP reporter](https://testanything.org/consumers.html#javascript)

### Custom reporters
You can create your own reporters, just look at the included basic reporter as a basis to create your own.




## Assertion
Each test function will be provided an assertion object as it's first parameter. `pico-check`s assertion object is an extension of node's built-in [assert](https://nodejs.org/api/assert.html), so you can use any of the default assertions. Here are `pico-check`s additional assertions:

#### `t.pass([msg]) / t.fail([msg])`
Passes/fails a test case with an optional message

```js
test('sample', (t)=>{
  (complexCondition ? t.pass() : t.fail('The complex condition failed'))
});
```
#### `t.ok(actual, [msg]) / t.no(actual, [msg])`
Verifies that `actual` is truthy/falsey with an optional message

```js
test('sample', (t)=>{
  t.ok(a == 3);
  t.no(b instanceof Error);
});
```

#### `t.is(actual, expected, [msg]) / t.not(actual, expected, [msg])`
Intelligently chooses between `assert.equal`/`assert.notEqual` or `assert.deepEqual`/`assert.notDeepEqual` based on the type of `expected` and `actual`.

```js
test('sample', (t)=>{
  t.not(3 + 4, 8);
  t.is({a : 6, b : [1,2,3]}, {a:6, b:[1,2,3]});
});
```

#### `t.type(value, type, [msg])`
A shorthand for `assert.equal(typeof value, type, msg)`. Handles arrays as type `'array'`;

```js
test('sample', (t)=>{
  t.type(3, 'number');
  t.type({a:true}, 'object');
  t.type([1,2,3], 'array');
});
```

#### `t.arm([msg]) / t.disarm()`
Sometimes you need a test to implictly fail unless a certain code path is ran. For this use case you can 'prime' your test case to error using `t.arm()`, and stop it from failing by calling `t.disarm()`.

test('emitter fires', (t)=>{
  t.arm('Update event was never caught');
  emitter.on('update', ()=>t.disarm());
  emitter.emit('update');
});




## Lifecycle
A common design pattern for testing is to have `before`, `after`, `beforeEach`, and `afterEach` triggers for your test cases. While `pico-check` lacks these functions explicitly, you can replicate this functionality using native javascript, since your tests run syncronously.

#### Before & After
Since tests run sync, the simplist way to achive this is to make a testcase at the beginning or end of your test file.

```js
const tests = {
  start : async ()=>{
    await DB.startup();
  },

  /** Your test cases... **/

  cleanup : async ()=>{
    await DB.shutdown();
  },
}

module.exports = tests;
```

**Notes**:
- If you have many before or after triggers, it's useful to create a group for them to easily turn them off/on, or add it them.
- If you have many test files that use the same before/after triggers, it useful to store the create group/testcases in a separate file and require them in as needed

