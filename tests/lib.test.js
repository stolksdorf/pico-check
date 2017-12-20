const lib = require('../lib.js');


const group = lib.createGroup('New group');

const test1 = lib.createTestCase('This is a test', (t)=>{

	t.pass();
});

const test2 = lib.createTestCase('This is a failed test', (t)=>{
	t.is(3, [3]);
});

const test3 = lib.createTestCase('This is a skipped test', (t)=>{
	t.fail();
}, { skip: true });

const test4 = lib.createTestCase('This is a skipped test', (t)=>{
	return new Promise((resolve)=>setTimeout(resolve, 400));
}, { timeout: 30 });


test1.run().then((res)=>console.log('test1', res));
test2.run().then((res)=>console.log('test2', res));
test3.run().then((res)=>console.log('test3', res));
test4.run().then((res)=>console.log('test4', res));





group.add(test1);
group.add(test2);
group.add(test3);
group.add(test4);

group.run().then((res)=>console.log('group', res));