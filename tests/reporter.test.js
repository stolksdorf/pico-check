/* This test is to simulate a full projects Tests cases to testing
   the visuals of the reporters.
*/
const test = require('../pico-check.js');
const lib = require('../src/lib.js');

const Tests = [
	lib.createTestCase('A basic test', (t)=>t.not(4, 5)),
	lib.createTestCase('A test with logs', (t)=>{
		t.pass();
		//console.log('How does your reporter deal with logs?');
		//console.log('Well I hope');
		t.pass();
	}),
	lib.createTestCase('Passed test',  (t)=>t.pass()),
	lib.createTestCase('Syntax error', (t)=>a + b),
	lib.createTestCase('Sluggish test', (t)=>{
		return new Promise((resolve, reject)=>{
			t.pass();
			setTimeout(resolve, 500);
		});
	}, { timeout: 600 }),
	lib.createTestCase('Diff fail',    (t)=>t.is({ a: 6 }, { a: false, b: true })),
	lib.createTestCase('Too slow', (t)=>{
		return new Promise((resolve, reject)=>{
			t.pass();
			setTimeout(resolve, 5000);
		});
	}, { timeout: 800 }),
	lib.createTestCase('Diff success', (t)=>t.is({ a: 6 }, { a: 6 })),
	lib.createTestCase('Forced Fail',  (t)=>t.fail('Super Forced')),
	lib.createTestCase('Skipped fail',  (t)=>t.fail(), { skip: true }),
	lib.createTestCase('Reject async', (t)=>{
		return new Promise((resolve, reject)=>{
			t.pass();
			setTimeout(reject, 500);
		});
	}, { timeout: 2000 })
];
Tests.map(test.add);


const newGroup = lib.createGroup('Grouped tests');
newGroup.add(Tests[3]);
newGroup.add(Tests[2]);
newGroup.add(Tests[6]);
newGroup.add(Tests[7]);
test.add(newGroup);


test.add(Tests[4]);


//times(10, ()=>test.add(Tests[0]))
//times(10, ()=>test.add(Tests[9]))

module.exports = test;