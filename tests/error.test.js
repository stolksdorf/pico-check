const ErrorReport = require('../reporters/error.js');
const assert = require('assert');

const lib = require('../lib.js');
const test = require('../pico-test.js')();


const temp = require('../require.test.js');


temp.add();
console.log(temp.show());


const temp2 = require('../require.test.js');

temp2.add();
console.log(temp2.show());


//console.log(ErrorReport(new Error('This is an error'), "This is the message for the error"));



// try{
// 	assert.equal([1,2], [2,1], "Let's go");
// }catch(err){
// 	console.log('ERR', typeof err);
// 	console.log(ErrorReport(err, "This is an assertion error"));
// }

// const temp =()=>Assert.fail();

// try{
// 	temp();
// }catch(err){
// 	console.log('ERR', typeof err);
// 	console.log(ErrorReport(err, "This is an external error"));
// }

const pureTest = lib.createTestCase('yo', (t)=>{
	t.pass();
});
pureTest.run().then((res)=>{
	console.log(res);
	//ErrorReport(res, 'This is a testcase error');
});

// console.log('pure', pureTest);


// // test('this is a built testcase', (t)=>{
// // 	console.log('running');
// // 	t.equal(5,6)
// // })

// test.get().add(pureTest)



// test.get().run().then((res)=>{
// 	console.log('RES', res);
// })
