const check = require('../');
const runTest = check.runTest;

module.exports = {
	pass : async (t)=>{
		t.is(await runTest((t)=>t.pass()), true)
	},
	fail : async (t)=>{
		t.type(await runTest((t)=>t.fail()), 'error');
	},

	is : async (t)=>{
		t.is(await runTest((t)=>t.is(3,3)), true);
		t.is(await runTest((t)=>t.is(true,true)), true);
		t.is(await runTest((t)=>t.is('yo','yo')), true);

		t.is(await runTest((t)=>t.is([1,2],[1,2])), true);
		t.is(await runTest((t)=>t.is({a : true}, {a : true})), true);
		t.is(await runTest((t)=>t.is({a : {b : true}}, {a : {b : true}})), true);


		t.type(await runTest((t)=>t.is(3,4)), 'error');
		t.type(await runTest((t)=>t.is(true,false)), 'error');
		t.type(await runTest((t)=>t.is('yo','yo!')), 'error');

		t.type(await runTest((t)=>t.is([1,2],[1,3])), 'error');
		t.type(await runTest((t)=>t.is({a : true}, {b : true})), 'error');
		t.type(await runTest((t)=>t.is({a : {b : true}}, {a : {b : false}})), 'error');
	},
	type : {
		string : async (t)=>{

			t.is(await runTest((t)=>t.type('yo', 'string')), true);

			t.type(await runTest((t)=>t.type(3, 'string')), 'error');
			t.type(await runTest((t)=>t.type(true, 'string')), 'error');
			t.type(await runTest((t)=>t.type([], 'string')), 'error');
			t.type(await runTest((t)=>t.type({}, 'string')), 'error');
		},

		number : async (t)=>{
			t.is(await runTest((t)=>t.type(3, 'number')), true);

			t.type(await runTest((t)=>t.type('yo', 'number')), 'error');
			t.type(await runTest((t)=>t.type(true, 'number')), 'error');
			t.type(await runTest((t)=>t.type([], 'number')), 'error');
			t.type(await runTest((t)=>t.type({}, 'number')), 'error');
		},

		boolean : async (t)=>{
			t.is(await runTest((t)=>t.type(true, 'boolean')), true);

			t.type(await runTest((t)=>t.type('yo', 'boolean')), 'error');
			t.type(await runTest((t)=>t.type(3, 'boolean')), 'error');
			t.type(await runTest((t)=>t.type([], 'boolean')), 'error');
			t.type(await runTest((t)=>t.type({}, 'boolean')), 'error');
		},

		array : async (t)=>{
			t.is(await runTest((t)=>t.type([], 'array')), true);

			t.type(await runTest((t)=>t.type('yo', 'array')), 'error');
			t.type(await runTest((t)=>t.type(3, 'array')), 'error');
			t.type(await runTest((t)=>t.type(true, 'array')), 'error');
			t.type(await runTest((t)=>t.type({}, 'array')), 'error');
		},

		object : async (t)=>{
			t.is(await runTest((t)=>t.type({}, 'object')), true);

			t.type(await runTest((t)=>t.type('yo', 'object')), 'error');
			t.type(await runTest((t)=>t.type(3, 'object')), 'error');
			t.type(await runTest((t)=>t.type(true, 'object')), 'error');
			t.type(await runTest((t)=>t.type([], 'object')), 'error');
		},





	},

	"Disarm" : require('./disarm.test.js'),
}