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
		console.log('Hello');
		console.log('This is pretty cool');
		console.log(test);
		t.pass();
	});
});

// test('async Test', (t)=>{
// 	return new Promise((resolve, reject)=>{
// 		setTimeout(()=>{
// 			t.pass();
// 			resolve();
// 		}, 14000)
// 	})
// }, {timeout : 2000})


test
	.run(pretty)
	.then((results)=>pretty.emit('finish', results));



