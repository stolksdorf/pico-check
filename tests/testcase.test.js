const ptest = require('../pico-test.js');


const myGroup = ptest.createGroup('test');
const myGroup2 = ptest.createGroup('test2');


myGroup2.add(ptest.createTestCase('nested'))

myGroup.add(ptest.createTestCase('simple pass', (t)=>{
	console.log('Hello');
	t.pass();

	console.log('YO YO');
}));


myGroup.add(ptest.createTestCase('simple fail', (t)=>{
	console.log('fail');
	t.fail('Hello!');
}));

myGroup.add(ptest.createTestCase('async', (t)=>{
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
			t.pass();
			resolve();
		}, 400)
	})
}));

myGroup.add(myGroup2)


myGroup.add(ptest.createTestCase('bad code', (t)=>{
	a + b;
}));



myGroup.run().then((results)=>console.log(results))




/* TODO:

- figure out how to run multiple test cases together
- Figure out how the failing code snippet will work. Stack trace? Read the file from memory? Pretty diff?
-

*/