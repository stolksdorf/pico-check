const ErrorReport = require('../reporters/error.js');
const Assert = require('../src/assert.js');




const manualError = new Error('This is an error');
let codeError;
try { a + b; } catch (err){ codeError = err; }
let diffError;
try { Assert.deepEqual({ b: 6, a: true }, { a: false }); } catch (err){ diffError = err; }
let failError;
try { Assert.fail(); } catch (err){ failError = err; }


console.log(ErrorReport(manualError, 'This is an manualError'));
console.log(ErrorReport(codeError, 'This is an codeError'));
console.log(ErrorReport(diffError, 'This is an diffError'));
console.log(ErrorReport(failError, 'This is an failError'));


// console.log(utils.parseError(manualError));
// console.log('-----------------');
// console.log(utils.parseError(codeError));
// console.log('-----------------');
// console.log(utils.parseError(assertError));d




//console.log(ErrorReport();



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

// const pureTest = lib.createTestCase('yo', (t)=>{
// 	t.pass();
// });
// pureTest.run().then((res)=>{
// 	console.log(res);
// 	//ErrorReport(res, 'This is a testcase error');
// });

// console.log('pure', pureTest);


// // test('this is a built testcase', (t)=>{
// // 	console.log('running');
// // 	t.equal(5,6)
// // })

// test.get().add(pureTest)



// test.get().run().then((res)=>{
// 	console.log('RES', res);
// })
