const test = require('../pico-check.js');


test('I am a basic test', (t)=>{
	t.pass();
});


test('I am a skipped test', (t)=>{
	t.fail();
}, { skip: true });

test.skip()('I am also a skipped test');

test('I am a todo test', (t)=>{
	t.fail();
}, { todo: true });

test('I am an async test', (t)=>{
	return new Promise((resolve, reject)=>{
		t.pass('ye');
		setTimeout(resolve, 300);
	});
});

//Edge cases
test('I have no test function');
test('I call no assertions', (t)=>{});

test.skip().todo()('chained modifiers');


//
test.group('this is a group', (test)=>{
	console.log('executing on group');

	test('I am a nested test', (t)=>{
		t.pass();
	});

	test('Second nested test', (t)=>{
		t.fail();
	});

	test.group('nested group AGAIN', (test)=>{
		test('yo', (t)=>{
			t.pass();
		});
	});
});


test('I call no assertions', (t)=>{});

// test.skip()('I am a skipped test', (t)=>{
// 	t.pass();
// });

// test.skip().only()('hybrid test', (t)=>{
// 	t.fail()
// });




module.exports = test;