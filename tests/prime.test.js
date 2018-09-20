const test = require('../pico-check.js');
const lib = require('../src/lib.js');

const wait = (fn)=>{
	return new Promise((resolve, reject)=>{
		setTimeout(()=>resolve(fn()), 300);
	});
}


test('basic use', (t)=>{
	t.prime();

	t.disarm();
});

test('async', (t)=>{
	t.prime();
	return wait(t.disarm);
});

test('not disarmed fails', async (t)=>{
	const tc = lib.createTestCase('sample', (t)=>{ t.prime(); });
	const res = await tc.run();
	t.ok(res instanceof Error);
})


module.exports = test;