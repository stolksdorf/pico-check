const test = require('../pico-test.js')();


// test('I am a basic2 test', (t)=>{
// 	t.pass();
// });

test('I AM A FAILED TEST', (t)=>{
	console.log('yo', t);
	t.fail();
});


// test.skip('I am a skipped test', (t)=>{
// 	t.pass();
// });

// test.skip.only('hybrid test', (t)=>{
// 	t.fail()
// });

module.exports = test;
