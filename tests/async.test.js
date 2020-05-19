const check = require('../src/engine.js');
const runTest = check.runTest;

const wait = async (n,val)=>new Promise((r)=>setTimeout(()=>r(val), n));

module.exports = {

	under_timeout : async (t)=>{
		const res = await runTest(async (t)=>{
			await wait(300);
			t.pass();
		})
		t.is(res, true);
	},

	over_timeout : async (t)=>{
		const res = await runTest(async (t)=>{
			await wait(2100);
			t.pass();
		});
		t.err(res);
	},

	async_pass : async (t)=>{
		const res = await runTest(async (t)=>{
			await wait(600);
			t.pass();
		})
		t.is(res, true);
	},

	async_throw : async (t)=>{
		const res = await runTest(async (t)=>{
			throw "oops";
		});
		t.err(res);
	},

	promise_reject : async (t)=>{
		const res = await runTest((t)=>{
			return Promise.reject('oops');
		})
		t.err(res);
	},

	promise_resolve : async (t)=>{
		const res = await runTest((t)=>{
			return Promise.resolve();
		})
		t.is(res, true);
	},

}