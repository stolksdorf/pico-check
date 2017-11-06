const ptest = require('../pico-test.js');


const tests = [];

tests.push(ptest.createTestCase('simple pass', (t)=>{
	console.log('Hello');
	t.pass();

	console.log('YO YO');
}));


tests.push(ptest.createTestCase('simple fail', (t)=>{
	//t.fail('Hello!');

}));

tests.push(ptest.createTestCase('async', (t)=>{
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
			t.pass();
			resolve();
		}, 400)
	})
}));

// tests.push(ptest.createTestCase('bad code', (t)=>{
// 	a + b;
// }));





tests.reduce((prom, test)=>prom.then(test.run), Promise.resolve())
	.then((res)=>console.log(res))
	.catch((err)=>{
		console.log('FAIL', err);
	})


/* TODO:



*/