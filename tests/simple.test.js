const test = require('../pico-test.js');




test('I AM A FAILED TEST', (t)=>{
	t.is([3], 4);
});

test('I am a basic2 test', (t)=>{
	t.pass();
});

test.skip('I am a skipped test', (t)=>{
	t.fail();
});

test.skip().group('new group', (test)=>{
	test('grouped test', (t)=>{
		t.pass();
	});
});

// test.skip.only('hybrid test', (t)=>{
// 	t.fail()
// });

console.dir(test.get(), { depth: null });

test.run()
	.then((results)=>{
		console.log(results);
	});

module.exports = test;
