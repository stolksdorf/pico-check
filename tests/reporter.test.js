const test = require('../pico-test.js')();
const verbose = require('../reporters/verbose.js');
const mini = require('../reporters/mini.js');


test('I am a basic test', (t)=>{
	a + b;
	t.pass();
})

test('I should fail', (t)=>{
	t.fail();
});

test.group('New group', (test)=>{
	test('I am a nested test', (t)=>{
		//console.log('Hello');
		//console.log('This is pretty cool');
		//console.log(test);
		t.pass();
	});
});

test('async Test', (t)=>{
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
			t.pass();
			resolve();
		}, 14000)
	})
}, {timeout : 8000})




module.exports = test;






// mini('start');
// test
// 	.run(mini)
// 	.then((results)=>console.dir(results, {depth:null}))
// 	.then((results)=>mini('finish', results))
// 	.then(()=>process.exit())



