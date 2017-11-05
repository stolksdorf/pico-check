const test = require('../index.js');


test('I am a basic2 test', (t)=>{
	t.pass();
});


test.group('this is a group2', (test)=>{

	test('I am a nested test2', (t)=>{
		t.pass();
	});

	test('Second nested test2', (t)=>{
		t.fail();
	})

})


// test.skip('I am a skipped test', (t)=>{
// 	t.pass();
// });

// test.skip.only('hybrid test', (t)=>{
// 	t.fail()
// });


