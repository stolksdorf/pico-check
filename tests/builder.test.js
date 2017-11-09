const test = require('../pico-test.js')();

test('I am a basic test', (t)=>{
	t.pass();
})

test.skip()('I am a basic test', (t)=>{
	t.fail();
})

test.group('New group', (test)=>{
	test.only()('I am a nested test', (t)=>{
		t.pass();
	});
});


//console.dir(test.get(), {depth:null});


test.run()
	.then((group)=>console.dir(group, {depth:null}))



module.exports = test;