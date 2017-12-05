const ErrorReport = require('../reporters/error.js');
const assert = require('assert');
const Assert = Object.assign({}, assert, {
	pass : ()=>{},
	fail : (msg = 't.fail')=>assert.fail(msg),
	timeout : new Error('Async timeout')
});

const pt = require('../lib.js');


const testcase = pt.createTestCase('testing out', (t)=>{
	t.fail();
});

console.log(testcase);

testcase.run()
	.then((res)=>{
		console.log('res', res);
		console.log('---');
		console.log(res.error.stack);
		console.log(testcase.error.stack);
	})





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


// Promise.resolve()
// 	.then(()=>{
// 		assert.fail()
// 	})
// 	.catch((err)=>console.log(ErrorReport(err, "This is an assertion fail")))


