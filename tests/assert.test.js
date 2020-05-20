const check = require('../src/engine.js');
const runTest = check.runTest;

module.exports = {
	pass : async (t)=>{
		t.is(await runTest((t)=>t.pass()), true)
	},
	fail : async (t)=>{
		t.err(await runTest((t)=>t.fail()))
	},

	is : async (t)=>{
		t.ok(await runTest((t)=>t.is(3,3)))
		t.ok(await runTest((t)=>t.is(true,true)))
		t.ok(await runTest((t)=>t.is('yo','yo')))

		t.ok(await runTest((t)=>t.is([1,2],[1,2])))
		t.ok(await runTest((t)=>t.is({a : true}, {a : true})))
		t.ok(await runTest((t)=>t.is({a : {b : true}}, {a : {b : true}})))


		t.err(await runTest((t)=>t.is(3,4)))
		t.err(await runTest((t)=>t.is(true,false)))
		t.err(await runTest((t)=>t.is('yo','yo!')))

		t.err(await runTest((t)=>t.is([1,2],[1,3])))
		t.err(await runTest((t)=>t.is({a : true}, {b : true})))
		t.err(await runTest((t)=>t.is({a : {b : true}}, {a : {b : false}})))
	},
	type : {
		string : async (t)=>{

			t.ok(await runTest((t)=>t.type('yo', 'string')));

			t.err(await runTest((t)=>t.type(3, 'string')));
			t.err(await runTest((t)=>t.type(true, 'string')));
			t.err(await runTest((t)=>t.type([], 'string')));
			t.err(await runTest((t)=>t.type({}, 'string')));
		},

		number : async (t)=>{
			t.ok(await runTest((t)=>t.type(3, 'number')));

			t.err(await runTest((t)=>t.type('yo', 'number')));
			t.err(await runTest((t)=>t.type(true, 'number')));
			t.err(await runTest((t)=>t.type([], 'number')));
			t.err(await runTest((t)=>t.type({}, 'number')));
		},

		boolean : async (t)=>{
			t.ok(await runTest((t)=>t.type(true, 'boolean')));

			t.err(await runTest((t)=>t.type('yo', 'boolean')));
			t.err(await runTest((t)=>t.type(3, 'boolean')));
			t.err(await runTest((t)=>t.type([], 'boolean')));
			t.err(await runTest((t)=>t.type({}, 'boolean')));
		},

		array : async (t)=>{
			t.ok(await runTest((t)=>t.type([], 'array')));

			t.err(await runTest((t)=>t.type('yo', 'array')));
			t.err(await runTest((t)=>t.type(3, 'array')));
			t.err(await runTest((t)=>t.type(true, 'array')));
			t.err(await runTest((t)=>t.type({}, 'array')));
		},

		object : async (t)=>{
			t.ok(await runTest((t)=>t.type({}, 'object')));

			t.err(await runTest((t)=>t.type('yo', 'object')));
			t.err(await runTest((t)=>t.type(3, 'object')));
			t.err(await runTest((t)=>t.type(true, 'object')));
			t.err(await runTest((t)=>t.type([], 'object')));
		},





	},

	"Disarm" : require('./disarm.test.js'),
}