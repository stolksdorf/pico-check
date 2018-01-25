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
    --fail-skip         testsuite will fail if any tests are skipp
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
The testing function provided to a test case will be executed with `pico-check`'s assertion object as it's first and only parameter. `pico-check`s assertion object is an extension of node's built-in [assert](https://nodejs.org/api/assert.html). Here are some of the most common assertions:

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


## Tips & Tricks

### JSX testing


**package.json**
```json
{
  "scripts": {
    "test": "pico-check **/*.test.{js,jsx}"
  },
  "pico-check": {
    "require": "babel-register"
  },
  "babel": {
    "only": [
      "*.jsx"
    ],
    "presets": [
      "stage-3",
      "react"
    ]
  },
}
```

```jsx
const React  = require('react');
const test   = require('pico-check');
const render = (comp) => require('react-test-renderer').create(comp).toJSON();

const Button = require('./button.jsx');

test('renders a button', (t)=>{
  const btn = render(<Button>test</Button>);
  t.is(btn.type, 'button');
  t.is(btn.children, ['test']);
});

test('can be clicked', (t)=>{
  let clicked = false;
  const btn = render(<Button onClick={()=>clicked=true} />);
  btn.props.onClick();
  t.ok(clicked);
});

module.exports = test;
```


### Conditional Testing
Conditional testing based on environment or other factors.


### Before & after hooks
Test implicitly pass,
Tests happen in serial
can use tests to function as before and after hooks


## TODO

### Configuration

### Clean Stack Traces

### Groups

### Only & Skipping
Chaining

### Watching

### Async tests

### Before & after hooks
Test implicitly pass,
Tests happen in serial
can use tests to function as before and after hooks

### JSX support
Use `babel-register`
Show setup for the package.json
Show examples using the `react-test-renderer`



## Ideas

### `t.log()`

### [Power Assert](https://github.com/power-assert-js/power-assert)

