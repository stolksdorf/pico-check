# ✅ pico-check
An incredibly tiny javascript testing library. Heavily inspired by the wonderful [ava](https://github.com/avajs/ava) and [tape](https://github.com/substack/tape).

<a href="https://www.npmjs.com/package/pico-check"><img src="https://img.shields.io/npm/v/pico-check?style=flat-square"></img></a>

### Features
- Supports sync and async tests
- Provides arming/disarming and timeouts for async tests
- Test cases structured as simple objects and functions
- Easily flag a test or group to skip, or only run
- Can be used as a CLI tool or a library
- Comes with a file watcher to automatically re-run tests on file changes
- No dependacies!
- **Under 100 lines!**



## Test Syntax
```js

// Tests are just functions or objects of functions. If the test passes,
// the function returns nothing, if the test fails the function should throw an error.

const check = require('pico-check');

//Test Cases are just nested objects of test functions
const testCases = {
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
};

const {results, skipped, passed, failed} = await check(testCases);

console.log(results);

/* Returns the exact same object structure but true if pass, error if fail, and false if skipped
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

const testCases = {
  init$ : (t)=>{
    //This test always runs, even with the only flag
  },
  this_is_a_group : {
    addition_test : (t)=>t.is(3+4, 7),
    $only_test : (t)=>{
      //this test is flagged with a $, so pico-check will skip every other test not marked with '$'
    },
    _skipped_group : {
      sad_test : (t)=>{}
    }
  },
  _skipped_test : (t)=>{
    // this test is flagged with '_' so it will always be skipped
    t.fail()
  }
}


check(testCases, {logs: false})
  .then(({failed, skipped, results})=>{
    console.log(results);
    process.exit(failed === 0 ? 0 : 1);
  })
```


## Flags

You can flag tests and groups with `_` and `$` in the test name to change the test runner behaviour.

#### Skip Flag - `_test_name`
If a test or group name starts with a `_` the test/group will be skipped

#### Only Flag - `$test_name`
If a test or group name starts with a `$` the test runner will be set into "only mode", and will only run tests/groups with the Only Flag or the Always Flag.

#### Always Flag - `test_name$`
If a test or group ends with a `$` then this test will always run regardless of other flags and modes. This is useful for test cases that set up or clean up needed processes for other test cases (such as database connections or setting environment variables).



## Assertion
Each test function will be provided an assertion object as it's first parameter. `pico-check`s assertion object is an extension of node's built-in [assert](https://nodejs.org/api/assert.html), so you can use any of the default assertions. Here are `pico-check`s additional assertions:

#### `t.pass([msg]) / t.fail([msg])`
Passes/fails a test case with an optional message

```js
(t)=>{
  (complexCondition ? t.pass() : t.fail('The complex condition failed'))
};
```

#### `t.is(actual, expected, [msg])` / `t.not(actual, expected, [msg])`
Will do a deep comparison between the `actual` and the `expected`.

```js
(t)=>{
  t.not(3 + 4, 8);
  t.is({a : 6, b : [1,2,3]}, {a:6, b:[1,2,3]});
};
```

#### `t.ok(value, [msg])` / `t.no(value, [msg])`
Checks if `value` is truthy

```js
(t)=>{
  t.ok(3 + 4 == 7, 'Math is broken');
  t.no(3 + 4 == 8, 'Math is broken');
};
```


#### `t.type(value, type, [msg])`
A shorthand for `t.ok(typeof value === type, msg)`. Handles arrays as type `'array'` and errors as type `'error'`;

```js
(t)=>{
  t.type(3, 'number');
  t.type({a:true}, 'object');
  t.type([1,2,3], 'array');
  t.type(new Error('oops'), 'error');
};
```


#### `t.wait(time, [val])`
async function that waits `time` milliseconds, then returns `val`;

```js
async (t)=>{
  const val = threadedUpdate(); /* some threaded process */
  await t.wait(500); //Wait to give some time
  t.ok(val);
};
```

#### `t.armed = false`
Sometimes you need a test to implictly fail unless a certain code path is ran. For this use case you can 'prime' your test case to error using `t.armed = true`, and stop it from failing by calling `t.armed = false`.

```js
async (t)=>{
  t.armed = true;
  emitter.on('update', ()=>t.armed = false);
  emitter.emit('update');
  await t.wait(10);
};
```

#### `t.timeout = 2000`
`pico-check` only allows tests 2 seconds of run time before a timeout. You can modify this on a test by test basis by changing the `t.timeout` value in the test code.

```js
async (t)=>{
  t.timeout = 8000; //8 seconds
  await a_longer_process();
  t.pass();
};
```

#### `t.defer`
`pico-check` gives each test a promise with it's resolve and reject functions as `t.pass()` and `t.fail()` respectively. To use this the test function just needs to return the `t.defer`;

```js
async (t)=>{
  complex_function_with_callback(()=>{
    t.pass();
  });
  return t.defer;
};
```