const check = require('../src/pico-check.js');
const runTest = check.runTest;

module.exports = {
	should_pass : async (t)=>{
		t.ok(await runTest(async (t)=>{
			t.arm();
			return Promise.resolve()
				.then(()=>t.disarm())
				.catch(()=>{})
		}));
	},
	should_fail : async (t)=>{
		t.err(await runTest(async (t)=>{
			t.arm();
			return Promise.reject()
				.then(()=>t.disarm())
				.catch(()=>{})
		}));
		t.disarm();
	}
}
