const assert = require('assert');

const isObjectLike = (...args) => !!args.find((val) => val != null && typeof val == 'object');

const Assert = Object.assign({}, assert, {
	timeout : 2000,

	armed  : false,
	arm    : ()=>Assert.armed=true,
	disarm : ()=>Assert.armed=false,

	is   : (act, exp, msg) => isObjectLike(act, exp) ? assert.deepEqual(act, exp, msg) : assert.equal(act, exp, msg),
	not  : (act, exp, msg) => isObjectLike(act, exp) ? assert.notDeepEqual(act, exp, msg) : assert.notEqual(act, exp, msg),
	pass : (msg) => assert.ok(true, msg),
	fail : (msg = 'Test manually failed') => assert.ok(false, msg),
	type : (val, type, msg) => assert.equal(Array.isArray(val) ? 'array' : typeof val, type, msg),
	no   : (act, msg) => assert.ok(!act, msg),
	err  : (val, msg) => assert.ok(val instanceof Error, msg)
});

module.exports = Assert;