const check = require('../');
const runTest = check.runTest;

module.exports = {
	should_pass : async (t)=>{
		t.is(await runTest(async (t)=>{
			t.armed = true;
			return Promise.resolve()
				.then(()=>t.armed = false)
				.catch(()=>{})
		}), true);
	},
	should_fail : async (t)=>{
		t.type(await runTest(async (t)=>{
			t.armed=true;
			return Promise.reject()
				.then(()=>t.armed = false)
				.catch(()=>{})
		}), 'error');
		t.armed = false;
	}
}
