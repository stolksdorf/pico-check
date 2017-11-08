const ptest = require('../pico-test.js');

const test = ptest();


test('I am a basic test', (t)=>{
	t.pass();
})

test.skip()('I am a basic test', (t)=>{
	t.fail();
})

test.skip().group('New group', (test)=>{
	test('I am a nested test', (t)=>{
		t.pass();
	});
});


test.run()
	.then((group)=>console.dir(group, {depth:null}))