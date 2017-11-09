const test = require('../pico-test.js')();
const pretty = require('../pretty.reporter.js');


test('I am a basic test', (t)=>{
	t.pass();
})

test('I should fail', (t)=>{
	t.fail();
})

test.group('New group', (test)=>{
	test('I am a nested test', (t)=>{
		t.pass();
	});
});

test('async Test', (t)=>{
	//t.fail()
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
			t.pass();
			resolve();
		}, 14000)
	})
})


test
	.run(pretty)
	.then((results)=>pretty.emit('finish', results));
