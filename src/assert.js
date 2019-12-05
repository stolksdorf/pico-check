const utils = require('./utils.js');
const assert = require('assert');

const failMsg = 'Test failed via t.fail()';

let primed = false;

const Assert = Object.assign({}, assert, {
	is : (act, exp, msg) =>
		utils.isObjectLike(act, exp) ? assert.deepEqual(act, exp, msg) : assert.equal(act, exp, msg),
	not : (act, exp, msg) =>
		utils.isObjectLike(act, exp)
			? assert.notDeepEqual(act, exp, msg)
			: assert.notEqual(act, exp, msg),

	pass : (msg) => assert.ok(true, msg),
	fail : (msg = failMsg) => assert.ok(false, msg),

	type : (val, type, msg) => assert.equal(Array.isArray(val) ? 'array' : typeof val, type, msg),
	no   : (act, msg) => assert.ok(!act, msg),

	arm      : (msg = 'Test was armed, but not disarmed') => (primed = msg),
	disarm   : () => (primed = false),
	detonate : () => {
		if(primed){
			throw new Error(primed);
		}
	},

	timeout      : (resolve, time) => setTimeout(() => resolve(new Error('Async timeout')), time),
	isForcedFail : (err) => err.message === failMsg,
});

module.exports = Assert;
